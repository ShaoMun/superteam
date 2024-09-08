import React from 'react';
import { AlertCircle } from 'lucide-react';
import '../styles/walleterror.css'; // Adjust the path as needed

const WalletConnectionError = () => {
  return (
    <div className="wallet-connection-container">
      <div className="wallet-connection-content">
        <div className="alert-box" role="alert">
          <div className="flex items-center">
            <AlertCircle className="alert-icon" />
            <p className="alert-title">Wallet Not Connected</p>
          </div>
          <p className="alert-message">
            Please connect your wallet to view your tokens and access the full features of this app.
          </p>
        </div>
        <div className="recommendation">
          <p className="recommendation-text">
            If you don't have a wallet, we recommend installing Phantom Wallet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionError;
