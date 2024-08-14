import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";


const suppliedPublicKey=process.argv[2];

if(!suppliedPublicKey){
    throw new Error(`Please provide a public key to check the balance of!`);
}

const isBase58 = (suppliedPublicKey: string)=> /^[A-HJ-NP-Za-km-z1-9]*$/.test(suppliedPublicKey);

if((suppliedPublicKey.length>44) || !isBase58(suppliedPublicKey)){
    throw new Error("Invalid wallet address!");
}


const publicKey = new PublicKey(suppliedPublicKey);

const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

const balanceInLamports = await connection.getBalance(publicKey);

const balanceInSOL= balanceInLamports/LAMPORTS_PER_SOL;

console.log(
    `💰 Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`,
  );