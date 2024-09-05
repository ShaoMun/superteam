'use client'

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getDetailedTransactionInfo } from '../utils/solana'; // Adjust the import path as needed
import '../styles/detailedTransaction.css'

interface Transaction {
  date: string;
  time: string;
  status: string;
  amount: number;
  source: string;
  destination: string;
  signature: string;
}

const DetailedTransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [transactionsPerPage] = useState(5);
  const [yearFilter, setYearFilter] = useState<string>('');
  const [monthFilter, setMonthFilter] = useState<string>('');
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!publicKey) return;

      setLoading(true);
      try {
        const txs = await getDetailedTransactionInfo(publicKey.toString());
        setTransactions(txs);
        setFilteredTransactions(txs); // Initial filter with all transactions
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [publicKey, connection]);

  useEffect(() => {
    // Filter transactions based on year and month
    let filtered = transactions;

    if (yearFilter) {
      filtered = filtered.filter(tx => tx.date.split('/')[2] === yearFilter);
    }

    if (monthFilter) {
      const monthNum = new Date(Date.parse(monthFilter + " 1, 2022")).getMonth() + 1;
      filtered = filtered.filter(tx => parseInt(tx.date.split('/')[0]) === monthNum);
    }

    setFilteredTransactions(filtered);
  }, [yearFilter, monthFilter, transactions]);

  const indexOfLastTransaction = page * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (indexOfLastTransaction < filteredTransactions.length) {
      setPage(page + 1);
    }
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setYearFilter(event.target.value);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonthFilter(event.target.value);
  };

  if (!publicKey) {
    return <p>Please connect your wallet to view transactions.</p>;
  }

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div className="transact-container">      
      <div className="filters">
        <label htmlFor="year">Year:</label>
        <select id="year" value={yearFilter} onChange={handleYearChange}>
          <option value="">All Years</option>
          {Array.from(new Set(transactions.map(tx => tx.date.split('/')[2]))).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <label htmlFor="month">Month:</label>
        <select id="month" value={monthFilter} onChange={handleMonthChange}>
          <option value="">All Months</option>
          {Array.from(new Set(transactions.map(tx => new Date(Date.parse(tx.date.split('/')[0] + "/01/" + tx.date.split('/')[2])).toLocaleString('default', { month: 'long' })))).map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="transaction-table">
          <thead>
            <tr>
            <th className="date">Date</th>
              <th className="time">Time</th>
              <th className="status">Status</th>
              <th className="amount">Amount</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Signature</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map((tx, index) => (
                <tr key={index}>
                  <td className="date">{tx.date}</td>
                  <td className="time">{tx.time}</td>
                  <td className="status">{tx.status}</td>
                  <td className="amount">{tx.amount.toFixed(4)} SOL</td>
                  <td>{tx.source}</td>
                  <td>{tx.destination}</td>
                  <td>{tx.signature}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={handlePrevious} disabled={page === 1}>Previous</button>
        <span>Page {page}</span>
        <button onClick={handleNext} disabled={indexOfLastTransaction >= filteredTransactions.length}>Next</button>
      </div>
    </div>
  );
};

export default DetailedTransactionList;
