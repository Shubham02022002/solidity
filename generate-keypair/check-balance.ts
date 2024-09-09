import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

async function checkBalance() {
  const publicAddress = process.argv[2];
  if (!publicAddress) {
    throw new Error("Please provide a public address to check balance of !");
  }

  if (publicAddress.length !== 44) {
    throw new Error(
      "Please provide a valid public address to check balance of!"
    );
  }

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const publicKey = new PublicKey(publicAddress);

  try {
    const balanceInLamports = await connection.getBalance(publicKey);
    const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

    console.log(
      `💰 Finished! The balance for the wallet at address ${publicKey.toBase58()} is ${balanceInSOL} SOL!`
    );
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
}

checkBalance();
