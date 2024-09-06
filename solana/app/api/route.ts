import type { NextApiRequest, NextApiResponse } from 'next';
import { getBalance, getTransactionHistory, getTokenDistribution } from '../../utils/solana';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Alchemy Connection setup
const ALCHEMY_API_KEY = 'aVbNyel3GL5lyN1gTYu3vo471--R0l-W';
const CONNECTION_URL = `https://solana-devnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
const connection = new Connection(CONNECTION_URL);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { publicKey } = req.query;

    if (typeof publicKey !== 'string') {
      return res.status(400).json({ error: 'Invalid public key' });
    }

    try {
      console.log('Fetching data for publicKey:', publicKey);
      const balance = await getBalance(publicKey);
      const transactions = await getTransactionHistory(publicKey);
      const tokenDistribution = await getTokenDistribution(publicKey);

      console.log('Balance:', balance);
      console.log('Transactions:', transactions);
      console.log('Token Distribution:', tokenDistribution);

      res.status(200).json({
        balance,
        transactions,
        tokenDistribution,
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      res.status(500).json({ error: 'An error occurred while fetching wallet data' });
    }
  } else if (req.method === 'POST') {
    const { fromPublicKey, toAddress, amount } = req.body;

    if (!fromPublicKey || !toAddress || !amount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
      const fromPubkey = new PublicKey(fromPublicKey);
      const toPubkey = new PublicKey(toAddress);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: amount * LAMPORTS_PER_SOL
        })
      );

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      // Serialize transaction for client-side signing
      const serializedTransaction = transaction.serialize({ requireAllSignatures: false });
      const transactionBase64 = serializedTransaction.toString('base64');

      res.status(200).json({ 
        transaction: transactionBase64,
        lastValidBlockHeight
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(500).json({ error: 'An error occurred while creating the transaction' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
