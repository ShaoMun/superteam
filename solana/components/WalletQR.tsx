import React from 'react';
import { getQRCodeURL } from '../utils/solana'; // Adjust the import path accordingly

interface QRCodeProps {
    publicKey: string;
}

const QRCodeDisplay: React.FC<QRCodeProps> = ({ publicKey }) => {
    const qrCodeURL = getQRCodeURL(publicKey);

    return (
        <div style={{ textAlign: 'center' }}>
            <img src={qrCodeURL} alt="Account QR Code" style={{backgroundColor: 'black' }} />
        </div>
    );
};

export default QRCodeDisplay;
