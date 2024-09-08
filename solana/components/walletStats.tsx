import React, { useState, useEffect, useRef } from 'react';
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
  const { publicKey, connect } = useWallet();
  const { connection } = useConnection();
  const modalRef = useRef<HTMLDivElement>(null); // Ref for modal content
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for wallet address dropdown

  const walletAddress = publicKey ? publicKey.toString() : '';

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 18)}...`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
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

  // Event listener to close modal on click outside
  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowSendSol(false); // Close modal if clicked outside
      }
    };

    if (showSendSol) {
      document.addEventListener('mousedown', handleClickOutsideModal);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [showSendSol]);

  // Event listener to close dropdown on click outside
  useEffect(() => {
    const handleClickOutsideDropdown = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false); // Close dropdown if clicked outside
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutsideDropdown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDropdown);
    };
  }, [showDropdown]);

  // Placeholder for when no wallet connection exists but keep UI
  const isWalletConnected = !!publicKey;

  return (
    <div className='wallet-container'>
      <div className='wallet-detail'>
        <div className='wallet-address'>
          {isWalletConnected
            ? truncateAddress(walletAddress)
            : 'Your Wallet Address'}
          <button onClick={() => setShowDropdown(!showDropdown)}>
            <img src="/down-arrow.png" alt="Toggle address" />
          </button>
          {showDropdown && (
            <div className='dropdown' ref={dropdownRef}>
              <div className='copy-address'>
                <button onClick={copyToClipboard} disabled={!isWalletConnected}>
                  <Copy size={16} />
                  Copy
                  <p>{isWalletConnected ? walletAddress : 'No Address'}</p>
                </button>
              </div>
            </div>
          )}
        </div>
        <div className='balance-container'>
          <div className='balance'>
            {balanceVisible ? (
              isWalletConnected ? `${balance?.toFixed(4)}` : '0.0000'
            ) : (
              '••••••••'
            )}
          </div><span>SOL</span>
          <button className='toggle-balance' onClick={toggleBalanceVisibility}>
            {balanceVisible ? <EyeOff/> : <Eye/>}
          </button>
        </div>
        <div className='transact-buttons'>
          <button className='reload' disabled={!isWalletConnected}>
            <img src="/reload.png" alt="Reload" />
            Reload
          </button>
          <button className='send' onClick={toggleSendSol} disabled={!isWalletConnected}>
            <img src="/send.png" alt="Send" />
            Send
          </button>
        </div>
      </div>
      <div className='qr'>
        {isWalletConnected ? (
          <QRCodeDisplay publicKey={walletAddress} />
        ) : (
          <img src="/placeholder-qr.png" alt="No QR Code" className='placeholder-image' />
        )}
      </div>

      {/* SendSol Modal */}
      {showSendSol && isWalletConnected && (
        <div className='modal-overlay'>
          <div className='modal-content' ref={modalRef}>
            <button className='close' onClick={toggleSendSol}>X</button>
            <SendSol />
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletStats;
