import {
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  PublicKey,
  Keypair,
} from "@solana/web3.js";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env") });

async function sendTransaction() {
  const suppliedToPubkey = process.argv[2] || null;
  if (!suppliedToPubkey) {
    console.log(`Please provide a public key to send to`);
    process.exit(1);
  }

  const secretKeyString = process.env.SECRET_KEY;

  if (!secretKeyString) {
    console.log(`SECRET_KEY is missing in the environment file`);
    process.exit(1);
  }

  const secretKeyArray = JSON.parse(secretKeyString);
  const secretKey = Uint8Array.from(secretKeyArray);

  const senderKeypair = Keypair.fromSecretKey(secretKey);

  console.log(`suppliedToPubkey: ${suppliedToPubkey}`);

  const toPubkey = new PublicKey(suppliedToPubkey);

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  console.log(
    `✅ Loaded our own keypair, the destination public key, and connected to Solana`
  );

  const txn = new Transaction();

  const LAMPORTS_TO_SEND = 5000;

  const sendSolInstructions = SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey,
    lamports: LAMPORTS_TO_SEND,
  });

  txn.add(sendSolInstructions);

  try {
    const signature = await sendAndConfirmTransaction(connection, txn, [
      senderKeypair,
    ]);

    console.log(
      `💸 Finished! Sent ${LAMPORTS_TO_SEND} Lamports to the address ${toPubkey}.`
    );
    console.log(`Transaction signature is ${signature}!`);
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}

sendTransaction();
