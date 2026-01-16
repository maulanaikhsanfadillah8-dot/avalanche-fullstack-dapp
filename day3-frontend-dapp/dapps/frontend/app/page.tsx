"use client";

import { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useChainId,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { avalancheFuji } from "wagmi/chains";

// ==============================
// 🔹 CONFIG
// ==============================
const CONTRACT_ADDRESS = "0x84a7e1a42ca5f7bd72b6849000ca64f0816e523a";

const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: "getValue",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_value", type: "uint256" }],
    name: "setValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default function Page() {
  // ==============================
  // 🔹 WALLET & NETWORK
  // ==============================
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const isWrongNetwork = isConnected && chainId !== avalancheFuji.id;

  // ==============================
  // 🔹 LOCAL STATE
  // ==============================
  const [inputValue, setInputValue] = useState("");
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  // ==============================
  // 🔹 READ CONTRACT
  // ==============================
  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: "getValue",
  });

  // ==============================
  // 🔹 WRITE CONTRACT (wagmi v2)
  // ==============================
  const { writeContract, isPending: isWriting } = useWriteContract({
    mutation: {
      onMutate() {
        setTxStatus("Transaction pending...");
        setTxError(null);
      },
      onSuccess() {
        setTxStatus("Transaction confirmed ✅");
        refetch();
        setInputValue("");
      },
      onError(error: any) {
        if (error?.cause?.code === 4001) {
          setTxError("User rejected the transaction");
        } else {
          setTxError("Transaction failed or reverted");
        }
        setTxStatus(null);
      },
    },
  });

  const handleSetValue = () => {
    if (!isConnected) return;
    if (isWrongNetwork) return;
    if (inputValue === "" || Number(inputValue) < 0) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: SIMPLE_STORAGE_ABI,
      functionName: "setValue",
      args: [BigInt(inputValue)],
    });
  };

  // ==============================
  // 🔹 HELPERS
  // ==============================
  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  // ==============================
  // 🔹 UI
  // ==============================
  return (
    <main
      className="min-h-screen bg-gradient-to-br from-[#0f172a] via-black to-[#020617]
                   flex items-center justify-center px-4 text-white"
    >
      <div
        className="w-full max-w-lg rounded-2xl
                    bg-white/5 backdrop-blur-xl
                    border border-white/10
                    shadow-[0_0_40px_rgba(56,189,248,0.15)]
                    p-8 space-y-8"
      >
        {/* HEADER */}
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-wide">Avalanche dApp</h1>
          <p className="text-sm text-gray-400">
            Simple smart contract interaction
          </p>
        </header>

        {/* WALLET */}
        <section className="space-y-3">
          {!isConnected ? (
            <button
              onClick={() => connect({ connector: injected() })}
              disabled={isConnecting}
              className="w-full py-3 rounded-xl
                       bg-gradient-to-r from-blue-600 to-cyan-500
                       font-medium hover:opacity-90 transition"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div className="rounded-xl border border-white/10 p-4 space-y-2">
              <p className="text-xs text-gray-400">Connected Wallet</p>
              <p className="font-mono text-sm">{shortAddress}</p>
              <button
                onClick={() => disconnect()}
                className="text-xs text-red-400 underline"
              >
                Disconnect
              </button>
            </div>
          )}
        </section>

        {/* NETWORK WARNING */}
        {isWrongNetwork && (
          <div
            className="rounded-xl border border-red-500/30
                        bg-red-500/10 p-3 text-sm text-red-400"
          >
            Wrong network. Please switch to Avalanche Fuji.
          </div>
        )}

        {/* READ */}
        <section className="rounded-xl border border-white/10 p-4 space-y-1">
          <p className="text-xs text-gray-400">Current Contract Value</p>
          <p className="text-3xl font-bold">
            {isReading ? "..." : value?.toString()}
          </p>
        </section>

        {/* WRITE */}
        <section className="space-y-3">
          <p className="text-sm text-gray-400">Update Value</p>

          <input
            type="number"
            placeholder="Enter new value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full rounded-xl bg-black/40
                     border border-white/10 p-3
                     focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={handleSetValue}
            disabled={isWriting || !isConnected || isWrongNetwork}
            className="w-full py-3 rounded-xl
                     bg-blue-600 hover:bg-blue-500
                     transition disabled:opacity-40"
          >
            {isWriting ? "Updating..." : "Set Value"}
          </button>

          {txStatus && <p className="text-sm text-green-400">{txStatus}</p>}
          {txError && <p className="text-sm text-red-400">{txError}</p>}
        </section>

        {/* FOOTER */}
        <footer className="text-center text-xs text-gray-500 pt-4">
          Smart contract is the single source of truth
        </footer>
      </div>
    </main>
  );
}
