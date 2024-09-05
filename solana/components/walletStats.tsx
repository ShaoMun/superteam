import React, { useState, useEffect } from 'react';
import { Copy, Eye, EyeOff } from 'lucide-react';
import SendSol from './SendSol'; // Import the SendSol component
import '../styles/walletStats.css';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import QRCodeDisplay from './WalletQR'; // Adjust the import path accordingly

const WalletStats: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSendSol, setShowSendSol] = useState(false); // State for SendSol modal visibility
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceVisible, setBalanceVisible] = useState(true); // State to toggle balance visibility
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const walletAddress = publicKey ? publicKey.toString() : '';

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 18)}...`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    // You might want to add a toast notification here
  };

  const toggleSendSol = () => {
    setShowSendSol(!showSendSol);
  };

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / 1e9); // Convert lamports to SOL
        } catch (error) {
          console.error('Failed to fetch balance:', error);
          setBalance(null);
        }
      }
    };

    fetchBalance();
    const id = setInterval(fetchBalance, 10000); // Refresh every 10 seconds
    return () => clearInterval(id);
  }, [publicKey, connection]);

  if (!publicKey) {
    return <p>Please connect your wallet to view balance and other details.</p>;
  }

  return (
    <div className='wallet-container'>
      <div className='wallet-detail'>
        <div className='wallet-address'>
          {truncateAddress(walletAddress)}
          <button onClick={() => setShowDropdown(!showDropdown)}>
            <img src="/down-arrow.png" alt="Toggle address" />
          </button>
          {showDropdown && (
            <div className='dropdown'>
              <div className='copy-address'>
                <button onClick={copyToClipboard}>
                  <Copy size={16} />
                  Copy
                  <p>{walletAddress}</p>
                </button>
              </div>
            </div>
          )}
        </div>
        <div className='balance-container'>
          <div className='balance'>
            {balanceVisible ? (
              balance !== null ? `${balance.toFixed(4)}` : 'Loading...'
            ) : (
              '••••••••'
            )}
          </div><span>SOL</span>
          <button className='toggle-balance' onClick={toggleBalanceVisibility}>
            {balanceVisible ? <EyeOff/> : <Eye/>}
          </button>
        </div>
        <div className='transact-buttons'>
          <button className='reload'>
            <img src="/reload.png" alt="Reload" />
            Reload
          </button>
          <button className='send' onClick={toggleSendSol}>
            <img src="/send.png" alt="Send" />
            Send
          </button>
        </div>
      </div>
      <div className='qr'>
        <QRCodeDisplay publicKey={walletAddress} />
      </div>
      
      {/* SendSol Modal */}
      {showSendSol && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <button className='close' onClick={toggleSendSol}>X</button>
            <SendSol />
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletStats;
