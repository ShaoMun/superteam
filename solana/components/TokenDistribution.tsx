'use client'

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ParsedAccountData } from '@solana/web3.js';

interface Token {
  mint: string;
  amount: number;
  price?: number; // Add price to token for future use
  value?: number; // Add value to token for future use
}

const TokenDistribution: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const fetchTokens = async () => {
      if (!publicKey) return;

      setLoading(true);
      try {
        const accounts = await connection.getParsedProgramAccounts(
          TOKEN_PROGRAM_ID,
          {
            filters: [
              {
                dataSize: 165,  // size of token account
              },
              {
                memcmp: {
                  offset: 32,  // location of the owner address
                  bytes: publicKey.toBase58(),
                },
              },
            ],
          }
        );

        const tokenAccounts = accounts.map((account) => {
          const data = account.account.data as ParsedAccountData;
          const info = data.parsed.info;
          return {
            mint: info.mint,
            amount: Number(info.tokenAmount.amount) / Math.pow(10, info.tokenAmount.decimals),
            // You might need to fetch the price for each token, this example assumes static prices
            price: getTokenPrice(info.mint),
          };
        });

        // Calculate value of each token
        const tokensWithValue = tokenAccounts.map((token) => ({
          ...token,
          value: token.amount * (token.price || 0),
        }));

        setTokens(tokensWithValue);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      }
      setLoading(false);
    };

    fetchTokens();
  }, [publicKey, connection]);

  // Mock function to get token price; you should replace this with real data
  const getTokenPrice = (mint: string) => {
    const prices: Record<string, number> = {
      'SolanaMintAddress': 20,
      'EthereumMintAddress': 3000,
      'BitcoinMintAddress': 50000,
    };
    return prices[mint] || 0;
  };

  if (!publicKey) {
    return <p>Please connect your wallet to view token distribution.</p>;
  }

  if (loading) {
    return <p>Loading token distribution...</p>;
  }

  return (
    <div className="dashboard-item">
      <table className="asset-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Amount</th>
            <th>Price</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {tokens.length > 0 ? (
            tokens.map((token, index) => (
              <tr key={index}>
                <td>{token.mint}</td>
                <td>{token.amount.toFixed(4)}</td>
                <td>${token.price?.toFixed(2) || 'N/A'}</td>
                <td>${token.value?.toFixed(2) || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No tokens found in this wallet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TokenDistribution;
