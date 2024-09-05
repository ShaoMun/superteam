'use client'

import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const SendSol: React.FC = () => {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const handleSendSol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;

    setStatus('Processing...');

    try {
      const toPublicKey = new PublicKey(toAddress);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: toPublicKey,
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');

      setStatus('Transaction sent successfully!');
      setToAddress('');
      setAmount('');
    } catch (error) {
      console.error('Error:', error);
      setStatus('Failed to send transaction. Please try again.');
    }
  };

  if (!publicKey) {
    return <p>Please connect your wallet to send SOL.</p>;
  }

  return (
    <form onSubmit={handleSendSol}>
      <h3>Send SOL</h3>
      <input
        type="text"
        placeholder="To Address"
        value={toAddress}
        onChange={(e) => {
          console.log('To Address:', e.target.value); // Debugging statement
          setToAddress(e.target.value);
        }}
        required
      />
      <input
        type="number"
        placeholder="Amount (SOL)"
        value={amount}
        onChange={(e) => {
          console.log('Amount:', e.target.value); // Debugging statement
          setAmount(e.target.value);
        }}
        required
        min="0"
        step="0.0001"
      />
      <button type="submit">Send SOL</button>
      {status && <p>{status}</p>}
    </form>
  );
};

export default SendSol;
