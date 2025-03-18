import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export async function transferSOLBulk(
  connection: Connection,
  fromWallet: PublicKey,
  transfers: { toWallet: string; amount: number }[]
): Promise<string[]> {
  try {
    // Get latest blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    // Create a single transaction for all transfers
    const transaction = new Transaction();

    // Add transfer instructions to the transaction
    for (const { toWallet, amount } of transfers) {
      const toPublicKey = new PublicKey(toWallet);
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: fromWallet,
          toPubkey: toPublicKey,
          lamports: Math.floor(amount * LAMPORTS_PER_SOL),
        })
      );
    }

    // Set transaction properties
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromWallet;

    // Sign and send the transaction
    const signed = await window.solana.signAndSendTransaction(transaction);

    // Wait for confirmation with improved error handling
    const confirmation = await connection.confirmTransaction({
      signature: signed.signature,
      blockhash: blockhash,
      lastValidBlockHeight: lastValidBlockHeight
    });

    if (confirmation.value.err) throw new Error('Transaction failed');

    return [signed.signature];
  } catch (error) {
    console.error('Error processing bulk transfers:', error);
    throw error;
  }
}