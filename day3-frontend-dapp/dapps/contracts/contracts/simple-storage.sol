// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    // menyimpan alamat pemilik contract (wallet yang melakukan deploy)
    address public owner;

    // saya ingin menyimpan sebuah nilai dalam bentuk uint256
    uint256 private storedValue;

    // menyimpan pesan dalam bentuk text
    string private message;

    // event untuk mencatat perubahan kepemilikan contract
    // oldOwner : pemilik sebelumnya
    // newOwner : pemilik baru (wallet deployer)
    event OwnerSet(address indexed oldOwner, address indexed newOwner);

    // ketika ada update saya akan track perubahannya
    event ValueUpdated(uint256 newValue);

    // event ini akan muncul setiap kali fungsi setMessage berhasil dijalankan
    event MessageUpdated(string newMessage);

    // modifier untuk membatasi akses fungsi dan hanya pemilik contract (owner) yang boleh menjalankan fungsi tertentu
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // constructor dijalankan satu kali saat contract di-deploy
    constructor() {
        owner = msg.sender;
        emit OwnerSet(address(0), msg.sender);
    }

    // simpan nilai ke blockchain (write)
    function setValue(uint256 _value) public onlyOwner {
        require(_value > 0, "Value must be > 0"); // validasi
        storedValue = _value; // simpan
        emit ValueUpdated(_value); // event
    }

    // menyimpan message ke blockchain dan hanya bisa dipanggil oleh owner
    function setMessage(string calldata _message) public onlyOwner {
        message = _message;
        emit MessageUpdated(_message);
    }

    // membaca nilai dari blockchain (read) terakhir kali di update
    function getValue() public view returns (uint256) {
        return storedValue;
    }

    // membaca message terakhir yang tersimpan di blockchain
    function getMessage() public view returns (string memory) {
        return message;
    }
}