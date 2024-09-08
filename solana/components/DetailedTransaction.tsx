'use client'

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getDetailedTransactionInfo } from '../utils/solana';
import '../styles/detailedTransaction.css';
import WalletConnectionError from '../components/WalletConnectionError'; // Adjust the path as needed

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState<number>(5); // Default 5 for larger screens
  const [yearFilter, setYearFilter] = useState<string>('');
  const [monthFilter, setMonthFilter] = useState<string>('');
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setTransactionsPerPage(3); // Show 3 transactions per page on small screens
      } else {
        setTransactionsPerPage(5); // Default 5 for larger screens
      }
    };

    // Attach the resize listener
    window.addEventListener('resize', handleResize);

    // Call it initially to set the correct transactionsPerPage
    handleResize();

    // Clean up the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const txs = await getDetailedTransactionInfo(publicKey.toString());
        setTransactions(txs);
        setFilteredTransactions(txs); // Initial filter with all transactions
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setError('An error occurred while fetching transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [publicKey, connection]);

  useEffect(() => {
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
    return <WalletConnectionError />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="transact-container2">
      {/* Filter UI */}
      <div className="filters2">
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

      {/* Transaction Table */}
      <div className="table-container2">
        <table className="transaction-table2">
          <thead>
            <tr>
              <th className="date2">Date</th>
              <th className="time2">Time</th>
              <th className="status2">Status</th>
              <th className="amount2">Amount</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Signature</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map((tx, index) => (
                <tr key={index}>
                  <td className="date2" data-label="Date">{tx.date}</td>
                  <td className="time2" data-label="Time">{tx.time}</td>
                  <td className="status2" data-label="Status">{tx.status}</td>
                  <td className="amount2" data-label="Amount">{tx.amount.toFixed(4)} SOL</td>
                  <td data-label="Source">{tx.source}</td>
                  <td data-label="Destination">{tx.destination}</td>
                  <td data-label="Signature">{tx.signature}</td>
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

      {/* Pagination */}
      <div className="pagination2">
        <button onClick={handlePrevious} disabled={page === 1}>Previous</button>
        <span>Page {page}</span>
        <button onClick={handleNext} disabled={indexOfLastTransaction >= filteredTransactions.length}>Next</button>
      </div>
    </div>
  );
};

export default DetailedTransactionList;
