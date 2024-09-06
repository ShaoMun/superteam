import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getTransactionHistory } from '../utils/solana'; // Adjust the import path as needed

interface Transaction {
  date: string;
  time: string;
  status: string;
  amount: number;
}

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!publicKey) return;

      setLoading(true);
      try {
        const txs = await getTransactionHistoryWithRetry(publicKey.toString());
        setTransactions(txs);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [publicKey, connection]);

  // Retry logic with exponential backoff
  const getTransactionHistoryWithRetry = async (publicKey: string, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const txs = await getTransactionHistory(publicKey);
        return txs;
      } catch (err: any) {
        if (err.code === 429 && i < retries - 1) {
          console.warn(`Rate limit hit, retrying in ${delay}ms...`);
          await new Promise(res => setTimeout(res, delay));
          delay *= 2; // Exponential backoff
        } else {
          throw err;
        }
      }
    }
  };

  if (!publicKey) {
    return <p>Please connect your wallet to view transactions.</p>;
  }

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div className="dashboard-item transact-container">
      <h2>Recent Transactions</h2>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((tx, index) => (
              <tr key={index}>
                <td>{tx.date}</td>
                <td>{tx.time}</td>
                <td>{tx.status}</td>
                <td>{tx.amount.toFixed(4)} SOL</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No recent transactions found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <a href="/dashboard/transaction" className="view-all">View all transactions &gt;</a>
    </div>
  );
};

export default TransactionList;
