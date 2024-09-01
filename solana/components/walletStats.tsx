import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import '../styles/walletStats.css';

const WalletStats = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const walletAddress = "0xfFFB4A49f24176a5CC7B5e61B1EaC0b9234A262e";
  
  const truncateAddress = (address) => {
    return `${address.slice(0, 18)}...`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    // You might want to add a toast notification here
  };

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
        <div className='balance'>$0.00</div>
        <div className='transact-buttons'>
          <button className='reload'>
            <img src="/reload.png" alt="Reload" />
            Reload
          </button>
          <button className='send'>
            <img src="/send.png" alt="Send" />
            Send
          </button>
        </div>
      </div>
      <div className='qr'>
        <img src="/qrcode.png" alt="QR Code" />
      </div>
    </div>
  );
};

export default WalletStats;