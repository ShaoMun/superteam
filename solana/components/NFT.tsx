import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import '../styles/nft.css'; // Import the regular CSS file
import WalletConnectionError from '../components/WalletConnectionError'; // Assuming you have this component

// Dummy data for the NFT gallery
const nftData = [
  { mintAddress: '8fYWVx3kmZJGWBaL16Y37YKwKnCn2igwxeEeAbtzWwuz', name: 'SMB #2821', description: 'This is a description of NFT Artwork 1.', imageUrl: '/2821.png' },
  { mintAddress: 'BBMp4ndzeEvgPGrKN8kPnsB39zWU97QnA12J42fRLyPY', name: 'Kanpai Panda (YKPS)', description: 'This is a description of NFT Artwork 2.', imageUrl: '/9889.png' },
  { mintAddress: '3QxFCpP8oiPkEPLdnswgHYDqEfyyfyZGRw3MQoNmda16', name: 'Okay Bear #7014', description: 'This is a description of NFT Artwork 3.', imageUrl: '/7014.png' },
];

const NFTGallery = () => {
  const { publicKey } = useWallet(); // Access the public key from the wallet

  const [selectedItem, setSelectedItem] = useState(null); // State to track clicked item

  const handleItemClick = (item) => {
    setSelectedItem(item); // Set the clicked item as the selected item
  };

  const handleCloseModal = () => {
    setSelectedItem(null); // Close the modal when clicked outside or on close button
  };

  if (!publicKey) {
    // If the wallet is not connected, show an error
    return <WalletConnectionError />;
  }

  return (
    <>
      <h1 className='NFT-title'>NFT Gallery</h1>
      <div className='nft-container'>
        {nftData.map((item, index) => (
          <div
            key={index}
            className='box'
            onClick={() => handleItemClick(item)}
          >
            <img
              src={item.imageUrl} // Use image URL from the data
              alt={item.name}
            />
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className='modal' onClick={handleCloseModal}>
          <div className='modalContent' onClick={(e) => e.stopPropagation()}>
            <span className='closeButton' onClick={handleCloseModal}>&times;</span>
            <div className='modalMain'>
              <div className='modalImage'>
                <img
                  src={selectedItem.imageUrl} // Use image URL from the selected item
                  alt={selectedItem.name}
                />
              </div>
              <div className='modalInfo'>
                <p><strong className='strong'>Mint Address:</strong> {selectedItem.mintAddress}</p>
                <p><strong className='strong'>Name:</strong> {selectedItem.name}</p>
                <p><strong className='strong'>Description:</strong> {selectedItem.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NFTGallery;
