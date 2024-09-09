import { Keypair } from "@solana/web3.js";
import fs from "fs";

export const getkeyPair = () => {
  const secret = JSON.parse(
    fs.readFileSync("/Users/chaud/.config/solana/id.json", {
      encoding: "utf-8",
    })
  );
  const secretKey = Uint8Array.from(secret);
  const keyPair = Keypair.fromSecretKey(secretKey);
  const privateKey = keyPair.secretKey;
  return [privateKey];
};
