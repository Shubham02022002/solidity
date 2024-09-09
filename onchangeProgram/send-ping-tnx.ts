import * as web3 from "@solana/web3.js";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env") });

async function main() {
  const secretKeyString = process.env.SECRET_KEY;
  if (!secretKeyString) {
    console.log(`SECRET_KEY is missing in the environment file`);
    process.exit(1);
  }

  const secretKeyArray = JSON.parse(secretKeyString);
  const secretKey = Uint8Array.from(secretKeyArray);
  const senderKeypair = web3.Keypair.fromSecretKey(secretKey);

  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

  const newBalance = await airdropIfRequired(
    connection,
    senderKeypair.publicKey,
    1 * web3.LAMPORTS_PER_SOL
  );

  console.log(`Balance after airdrop: ${newBalance}`);

  const PING_PROGRAM_ADDRESS = new web3.PublicKey(
    "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa"
  );
  const PING_PROGRAM_DATA_ADDRESS = new web3.PublicKey(
    "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod"
  );
  const txn = new web3.Transaction();
  const programId = new web3.PublicKey(PING_PROGRAM_ADDRESS);
  const pingProgramDataId = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS);

  const instruction = new web3.TransactionInstruction({
    keys: [
      {
        pubkey: pingProgramDataId,
        isSigner: false,
        isWritable: true,
      },
    ],
    programId,
  });

  txn.add(instruction);

  const signature = await web3.sendAndConfirmTransaction(connection, txn, [
    senderKeypair,
  ]);

  console.log(`✅ Transaction completed! Signature is ${signature}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function airdropIfRequired(
  connection: web3.Connection,
  publicKey: web3.PublicKey,
  targetBalance: number
) {
  const currentBalance = await connection.getBalance(publicKey);
  if (currentBalance < targetBalance) {
    console.log("Requesting airdrop...");
    const airdropSignature = await connection.requestAirdrop(
      publicKey,
      targetBalance - currentBalance
    );
    await connection.confirmTransaction(airdropSignature);
    console.log(`Airdrop completed: ${airdropSignature}`);
  }

  return connection.getBalance(publicKey);
}
