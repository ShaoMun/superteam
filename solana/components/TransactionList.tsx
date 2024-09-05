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
        const txs = await getTransactionHistory(publicKey.toString());
        setTransactions(txs);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [publicKey, connection]);

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
