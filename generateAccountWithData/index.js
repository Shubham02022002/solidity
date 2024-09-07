const solanaWeb3 = require("@solana/web3.js");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const filePath = process.env.FILE_PATH;
const {
  Keypair,
  Connection,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} = solanaWeb3;

// Connect to Solana devnet
const connection = new Connection(
  solanaWeb3.clusterApiUrl("devnet"),
  "confirmed"
);

const dataAccount = Keypair.generate();
const payer = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync(`${filePath}`, "utf-8")))
);

const createAccount = async () => {
  const tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: dataAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(1000),
      space: 1000,
      programId: SystemProgram.programId,
    })
  );
  const txId = await sendAndConfirmTransaction(connection, tx, [
    payer,
    dataAccount,
  ]);
  console.log(`Created account with transaction ID: ${txId}`);
};

createAccount();
