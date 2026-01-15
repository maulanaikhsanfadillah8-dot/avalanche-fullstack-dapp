import { viem } from "hardhat";

import Artifact from "../artifacts/contracts/simple-storage.sol/SimpleStorage.json";

async function main() {
  // Wallet client (signer)
  const [walletClient] = await viem.getWalletClients();

  // Public client (read-only)
  const publicClient = await viem.getPublicClient();

  console.log("Deploying with account:", walletClient.account.address);

  // Deploy contract
  const hash = await walletClient.deployContract({
    abi: Artifact.abi,
    bytecode: Artifact.bytecode as `0x${string}`,
    args: [],
  });

  console.log("Deployment tx hash:", hash);

  // wait for confirmation
  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
  });

  console.log("✅ SimpleStorage deploy at:", receipt.contractAddress);
}

main().catch((eror) => {
  console.error(eror);
  process.exitCode = 1;
});
