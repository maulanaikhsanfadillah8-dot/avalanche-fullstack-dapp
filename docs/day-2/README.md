# 📘 Day 2 – Smart Contract Fundamentals & Solidity (Avalanche)

## 🎯 Tujuan Pembelajaran

Pada akhir sesi Day 2, peserta mampu:

- Memahami peran smart contract dalam dApp
- Memahami _mental model_ smart contract di blockchain
- Menulis smart contract sederhana dengan Solidity
- Menggunakan Hardhat sebagai development environment
- Melakukan compile & deploy smart contract
- Deploy smart contract ke Avalanche Fuji Testnet
- Memverifikasi contract melalui block explorer
- Memahami hubungan **Frontend with framework ↔ Wallet ↔ Smart Contract**

---

## 🧩 Studi Kasus Day 2

### Avalanche Simple Full Stack dApp – Smart Contract Layer

Hari kedua difokuskan pada **Smart Contract**, yaitu:

- Menyimpan data di blockchain
- Menjadi _single source of truth_
- Diakses oleh frontend melalui wallet

> 📌 Smart contract ini akan digunakan kembali di **Day 3 (Frontend)** dan **Day 5 (Integration)**.

---

## ⏱️ Struktur Sesi (3 Jam)

| Sesi    | Durasi | Aktivitas                        |
| ------- | ------ | -------------------------------- |
| Theory  | 1 Jam  | Konsep smart contract & Solidity |
| Demo    | 1 Jam  | Setup Hardhat & deploy contract  |
| Praktik | 1 Jam  | Modifikasi & deploy mandiri      |

---

## 1️⃣ Theory (1 Jam)

### 1.1 Apa itu Smart Contract?

Smart contract adalah **program yang berjalan di blockchain** dan:

- Menyimpan state
- Mengeksekusi logic
- Tidak bisa diubah setelah di-deploy (immutable)

> 📌 Smart contract **bukan backend server**.

---

### 1.2 Mental Model Smart Contract (Penting)

```bash
User
  ↓
Frontend (HTML / JS)
  ↓
Wallet (Core)
  ↓
Smart Contract (Solidity)
  ↓
Blockchain (Avalanche C-Chain)
```

🔑 **Catatan penting:**

- Frontend **tidak menjalankan logic bisnis**
- Semua logic penting ada di smart contract
- Wallet bertugas:
  - Menandatangani transaksi
  - Mengirim transaksi ke blockchain

---

### 1.3 Smart Contract vs Backend Tradisional

| Backend Tradisional    | Smart Contract      |
| ---------------------- | ------------------- |
| Bisa diubah kapan saja | Immutable           |
| Server terpusat        | Terdesentralisasi   |
| Trust ke operator      | Trust ke code       |
| Bisa rollback          | Tidak bisa rollback |

---

### 1.4 Solidity Basics

Konsep dasar Solidity:

- `contract` → blueprint program
- `state variable` → data di blockchain
- `function` → logic
- `view / pure` → read-only
- `event` → log transaksi

Contoh mental model:

```solidity
contract Storage {
  uint256 value;
}
```

> ➡️ `value` disimpan **di blockchain**, bukan di browser.

---

### 1.5 Transaction vs Read (Call)

| Read (Call)           | Write (Transaction)    |
| --------------------- | ---------------------- |
| Tidak pakai gas       | Pakai gas              |
| Tidak ubah state      | Mengubah state         |
| Tidak perlu signature | Perlu wallet signature |

> 📌 Hari ini fokus ke **menyiapkan contract**, interaksi dilakukan Day 3.

---

### 1.6 Hardhat Overview

Hardhat adalah:

- Development environment untuk smart contract
- Compiler Solidity
- Tool deployment & testing

Kenapa Hardhat?

- Mudah digunakan
- Banyak dipakai industri
- Cocok untuk Avalanche (EVM)

---

## 2️⃣ Demo (1 Jam)

### 2.1 Setup Project Smart Contract

Masuk ke folder contracts:

```bash
cd apps/contracts
npm install
```

Struktur utama:

```
apps/contracts/
├── contracts/
├── scripts/
├── test/
├── hardhat.config.ts
```

---

### 2.2 Smart Contract Pertama

File: `contracts/SimpleStorage.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private storedValue;

    event ValueUpdated(uint256 newValue);

    function setValue(uint256 _value) public {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    function getValue() public view returns (uint256) {
        return storedValue;
    }
}
```

📌 Contract ini:

- Menyimpan 1 nilai integer
- Bisa di-update oleh siapa saja (sementara)

---

### 2.3 Compile Smart Contract

```bash
npx hardhat compile
```

Output:

- ABI
- Bytecode

📌 **ABI adalah jembatan antara frontend dan smart contract.**

---

### 2.4 Konfigurasi Network Avalanche Fuji

Pastikan `hardhat.config.ts` sudah ada network Fuji:

```ts
fuji: {
  url: "https://api.avax-test.network/ext/bc/C/rpc",
  accounts: [process.env.PRIVATE_KEY]
}
```

📌 Gunakan **private key wallet testnet** (Core Wallet).

---

### 2.5 Deploy Smart Contract

```bash
npx hardhat run scripts/deploy.ts --network fuji
```

Output:

- Contract address
- Transaction hash

---

### 2.6 Verifikasi di Block Explorer

- Buka Snowtrace / Avalanche Explorer
- Cari contract address
- Lihat:

  - Transaction
  - Contract creation
  - Event log

> 📌 Sekarang smart contract **hidup di blockchain**.

---

## 3️⃣ Praktik / Homework (1 Jam)

### 🎯 Objective Praktik

Peserta mampu **memodifikasi dan deploy smart contract secara mandiri**.

---

### 3.1 Task 1 – Modifikasi Contract

Tambahkan:

- Variable baru (contoh: `owner`)
- Function `getOwner()`

---

### 3.2 Task 2 – Event Tambahan

Tambahkan event:

```solidity
event OwnerSet(address owner);
```

Emit event saat contract dibuat.

---

### 3.3 Task 3 – Deploy Ulang

- Compile ulang
- Deploy ulang ke Fuji
- Simpan:
  - Contract address
  - ABI

> 📌 Data ini akan dipakai di **Day 3**.

---

### 3.4 Task 4 – Review Explorer

Pastikan:

- Contract address valid
- Event muncul
- Transaction sukses

---

## 🧪 Checklist Praktik

- [ ] Hardhat berhasil compile
- [ ] Contract berhasil deploy
- [ ] Contract address tersimpan
- [ ] ABI tersedia
- [ ] Contract terlihat di explorer

---

## ✅ Output Day 2

Pada akhir Day 2:

- Smart contract aktif di Avalanche Fuji Testnet
- Peserta memahami:
  - Smart contract lifecycle
  - Peran contract dalam dApp
- Contract siap diintegrasikan ke frontend

---

## 🚀 Preview Day 3

Di Day 3, kita akan:

- Menghubungkan frontend (HTML/JS → Next.js)
- Load ABI & contract address
- Read data dari smart contract
- Kirim transaction menggunakan Core Wallet

---

## 📚 Referensi Tambahan

- Solidity Docs: [https://docs.soliditylang.org](https://docs.soliditylang.org)
- Hardhat Docs: [https://hardhat.org](https://hardhat.org)
- Avalanche Academy:
  [https://build.avax.network/academy](https://build.avax.network/academy)

---

🔥 **Smart Contract deployed!**
Besok kita mulai menghubungkan **frontend with framework ↔ smart contract** 🚀
