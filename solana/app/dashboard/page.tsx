'use client'

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import "../../styles/tokens.css";
import TransactionList from "../../components/TransactionList";
import TokenDistribution from '../../components/TokenDistribution';
import BalanceChart from '../../components/BalanceChart';
import AssetDistributionChart from '../../components/AssetDistributionChart';
import { getBalance, getDetailedTransactionInfo, getTokenDistribution } from '../../utils/solana';

const Tokens: React.FC = () => {
  const [balanceData, setBalanceData] = useState<Array<{ date: number; balance: number }>>([]);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [tokenDistribution, setTokenDistribution] = useState<Array<{ name: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { publicKey } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const fetchData = async () => {
      if (!publicKey) {
        setError('Please connect your wallet to view your tokens.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const walletAddress = publicKey.toString();

        const balance = await getBalance(walletAddress);
        setCurrentBalance(balance);

        const transactions = await getDetailedTransactionInfo(walletAddress);
        const balanceHistory = transactions.map((tx, index) => {
          const runningBalance = balance - transactions.slice(0, index + 1).reduce((sum, t) => sum + t.amount, 0);
          return {
            date: new Date(tx.date).getTime(),
            balance: runningBalance
          };
        });
        setBalanceData(balanceHistory);

        const distribution = await getTokenDistribution(walletAddress);
        const tokenData = Object.entries(distribution.tokens).map(([name, amount]) => ({
          name,
          value: amount
        }));
        setTokenDistribution([
          { name: 'SOL', value: distribution.solBalance },
          ...tokenData
        ]);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        setError('An error occurred while fetching wallet data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [publicKey, connection]);

  if (!publicKey) {
    return <p>Please connect your wallet to view your tokens.</p>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <div className="dashboard-item">
          <h1>Performance</h1>
          <BalanceChart data={balanceData} />
        </div>

        <TransactionList />
      </div>

      <h3>Asset Distribution</h3>
      <div className="dashboard-grid">
        <div className="dashboard-item">
          <AssetDistributionChart data={tokenDistribution} />
        </div>

        <TokenDistribution />
      </div>
    </div>
  );
};

export default Tokens;
