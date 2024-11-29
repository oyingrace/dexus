import { Connection, PublicKey, Transaction, Keypair } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createTransferInstruction, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from "@solana/spl-token";

export async function sendToken(recipientPublicKey: PublicKey) {
  const connection = new Connection("https://rpc.testnet.soo.network/rpc", "confirmed");

  // Hardcoded sender wallet (replace with your actual sender wallet)
  const senderWallet = Keypair.fromSecretKey(
    new Uint8Array([
      64, 45, 161, 163, 124, 19, 208, 228, 21, 74, 25, 213, 189, 58, 73, 62, 52, 15, 238, 81, 
      162, 204, 130, 137, 67, 241, 79, 235, 185, 110, 255, 220, 235, 88, 247, 189, 14, 105, 
      236, 40, 189, 62, 219, 249, 150, 160, 18, 162, 247, 121, 193, 232, 149, 151, 229, 220, 
      117, 39, 108, 237, 26, 179, 83, 232,
    ])
  );

  // Token mint address (replace with your actual token mint)
  const tokenMintAddress = new PublicKey("DvhNHdqpHvUFpxm7LtAWZYMGSV4MPAygJrM5YZ2Aixjg");

  console.log("Starting token transfer...");
  console.log("Sender public key:", senderWallet.publicKey.toBase58());
  console.log("Recipient public key:", recipientPublicKey.toBase58());

  try {
    // Get the associated token accounts
    const senderTokenAccount = await getAssociatedTokenAddress(
      tokenMintAddress, 
      senderWallet.publicKey
    );
    const recipientTokenAccount = await getAssociatedTokenAddress(
      tokenMintAddress, 
      recipientPublicKey
    );

    console.log("Sender token account:", senderTokenAccount.toBase58());
    console.log("Recipient token account:", recipientTokenAccount.toBase58());

    const tx = new Transaction();

    // Check if recipient ATA exists, if not, create it
    const recipientAccountInfo = await connection.getAccountInfo(recipientTokenAccount);
    if (!recipientAccountInfo) {
      console.log("Creating recipient token account...");
      tx.add(
        createAssociatedTokenAccountInstruction(
          senderWallet.publicKey,  // Payer
          recipientTokenAccount,   // Associated Token Account
          recipientPublicKey,      // Wallet owner
          tokenMintAddress         // Token Mint Address
        )
      );
    }

    // Add transfer instruction
    tx.add(
      createTransferInstruction(
        senderTokenAccount, 
        recipientTokenAccount, 
        senderWallet.publicKey, 
        10000000000,  // Amount to transfer
        [], 
        TOKEN_PROGRAM_ID
      )
    );

    // Set recent blockhash and fee payer
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = senderWallet.publicKey;

    // Sign and send transaction
    const signature = await connection.sendTransaction(tx, [senderWallet]);
    await connection.confirmTransaction(signature, "confirmed");

    console.log("Transaction successful!");
    console.log("Signature:", signature);
    return signature;
  } catch (error) {
    console.error("Error in token transfer:", error);
    throw error;
  }
}