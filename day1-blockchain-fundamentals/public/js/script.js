import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const connectBtn = document.getElementById("connectBtn");
    const statusEl = document.getElementById("status");
    const addressEl = document.getElementById("address");
    const networkEl = document.getElementById("network");
    const balanceEl = document.getElementById("balance");

    const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

    function formatAvaxBalance(balanceWei) {
      const balance = parseInt(balanceWei, 16);
      return (balance / 1e18).toFixed(4);
    }

    function shortenAddress(addr) {
      return addr.slice(0, 6) + "..." + addr.slice(-4);
    }

    async function connectWallet() {
      if (typeof window.ethereum === "undefined") {
        alert("Core Wallet tidak terdeteksi. Silakan install Core Wallet.");
        statusEl.textContent = "Wallet tidak ditemukan ❌";
        statusEl.style.color = "#e84118";
        return;
      }

      try {
        statusEl.textContent = "Connecting...";
        statusEl.style.color = "#fbc531";

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const address = accounts[0];
        addressEl.textContent = shortenAddress(address);

        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
          networkEl.textContent = "Avalanche Fuji Testnet";
          statusEl.textContent = "Connected ✅";
          statusEl.style.color = "#4cd137";

          const balanceWei = await window.ethereum.request({
            method: "eth_getBalance",
            params: [address, "latest"],
          });

          balanceEl.textContent = formatAvaxBalance(balanceWei);

          connectBtn.disabled = true;
          connectBtn.textContent = "Connected";
          connectBtn.style.backgroundColor = "#4cd137";
        } else {
          networkEl.textContent = "Wrong Network ❌";
          statusEl.textContent = "Please switch to Avalanche Fuji";
          statusEl.style.color = "#fbc531";
          balanceEl.textContent = "-";
        }
      } catch (error) {
        console.error(error);
        statusEl.textContent = "Connection Failed ❌";
        statusEl.style.color = "#e84118";
      }
    }

    connectBtn.addEventListener("click", connectWallet);

    // Listen for wallet events
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="container">
      <h1>Avalanche dApp</h1>
      <p className="subtitle">Connect Wallet (Core Wallet)</p>
      <button id="connectBtn">Connect Wallet</button>
      <div className="card">
        <p>
          <strong>Status:</strong> <span id="status">Not Connected</span>
        </p>
        <p>
          <strong>Wallet Address:</strong> <span id="address">-</span>
        </p>
        <p>
          <strong>Network:</strong> <span id="network">-</span>
        </p>
        <p>
          <strong>Balance:</strong> <span id="balance">-</span> AVAX
        </p>
        <p>
          <strong>Nama:</strong> Maulana Ikhsan Fadillah
        </p>
        <p>
          <strong>NIM:</strong> 241011400092
        </p>
      </div>
    </div>
  );
}
