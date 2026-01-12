"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

function shortenAddress(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function getStatusMeta(status: string) {
  if (status === "Connected") {
    return { icon: "✅", className: "status-connected" };
  }

  if (status === "Not Connected" || status === "Connection Failed") {
    return { icon: "❌", className: "status-disconnected" };
  }

  return { icon: "⚠️", className: "status-warning" };
}

export default function HomePage() {
  const [status, setStatus] = useState("Not Connected");
  const [address, setAddress] = useState("-");
  const [network, setNetwork] = useState("-");
  const [balance, setBalance] = useState("-");
  const [isConnected, setIsConnected] = useState(false);

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const account = accounts[0];
        setIsConnected(true);
        setStatus("Connected");
        setAddress(shortenAddress(account));

        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (chainId === "0xa869") {
          setNetwork("Avalanche Fuji C-Chain");
        } else if (chainId === "0xa86a") {
          setNetwork("Avalanche Mainnet");
        } else {
          setNetwork("Wrong Network");
        }

        const balanceWei = await provider.getBalance(account);
        setBalance(ethers.formatEther(balanceWei));
      } catch {
        setStatus("Connection Failed");
        setIsConnected(false);
      }
    } else {
      alert("Core Wallet / MetaMask tidak terdeteksi");
    }
  }

  function disconnectWallet() {
    setIsConnected(false);
    setStatus("Not Connected");
    setAddress("-");
    setNetwork("-");
    setBalance("-");
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", () => {
        setStatus("Account Changed");
        setIsConnected(false);
        setAddress("-");
        setBalance("-");
      });

      window.ethereum.on("chainChanged", () => {
        setStatus("Network Changed");
        setIsConnected(false);
        setNetwork("-");
      });
    }
  }, []);

  const statusMeta = getStatusMeta(status);

  return (
    <div className="app-container">
      <h1 className="title">❄️ Avalanche dApp</h1>
      <p className="subtitle">Connect Wallet (Core Wallet)</p>

      <button
        className={isConnected ? "btn-green" : "btn-red"}
        onClick={isConnected ? disconnectWallet : connectWallet}
      >
        {isConnected ? "Disconnect" : "Connect Wallet"}
      </button>

      <div className="card">
        <div className="info-grid">
          <p>
            <strong>Status:</strong>{" "}
            <span className={`status ${statusMeta.className}`}>
              {statusMeta.icon} {status}
            </span>
          </p>

          <p>
            <strong>Wallet Address:</strong> {address}
          </p>

          <p>
            <strong>Network:</strong> {network}
          </p>

          <p>
            <strong>Balance:</strong> {balance} AVAX
          </p>

          <p>
            <strong>Nama:</strong> Maulana Ikhsan Fadillah
          </p>
          <p>
            <strong>NIM:</strong> 241011400092
          </p>
        </div>
      </div>
    </div>
  );
}
