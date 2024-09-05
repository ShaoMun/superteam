'use client';

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import '../styles/SendSol.css';  // Import the new CSS file

const SendSol: React.FC = () => {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [hasSufficientBalance, setHasSufficientBalance] = useState(true);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  // Fetch SOL balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const balance = await connection.getBalance(publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);
        if (balance < 0.01 * LAMPORTS_PER_SOL) {
          setHasSufficientBalance(false);
        }
      }
    };
    fetchBalance();
  }, [publicKey, connection]);

  // Handle send SOL transaction
  const handleSendSol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || parseFloat(amount) > (solBalance ?? 0)) {
      setErrorMessage('Amount exceeds balance');
      return;
    }

    setStatus('Processing...');
    setErrorMessage(null); // Clear previous error message

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
    <div className="send-sol-container">
      <form onSubmit={handleSendSol}>
        <h3 className="form-title">Send</h3>

        <div className="token-selector">
          <div className="token-icon">
            <img src="/solana-icon.svg" alt="SOL" />
          </div>
          <div className="token-balance">Max: {solBalance ? solBalance.toFixed(2) : '0'}</div>
        </div>

        <div className="input-group">
          <label htmlFor="toAddress">Recipient</label>
          <input
            type="text"
            id="toAddress"
            placeholder="Search or paste"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="amount">Amount (SOL)</label>
          <input
            type="number"
            id="amount"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
            step="0.0001"
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {!hasSufficientBalance && (
          <p className="error-message">
            Insufficient SOL. Please ensure you have at least 0.01 SOL in your wallet to cover network fees.
          </p>
        )}

        <button type="submit" className="submit-button" disabled={!toAddress || !amount || !hasSufficientBalance}>
          Send
        </button>

        {status && <p className="status-message">{status}</p>}
      </form>
    </div>
  );
};

export default SendSol;
