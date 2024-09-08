'use client'

import TokenPerformanceTable from "../../components/SPLPerformance";
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import "../../styles/dashboard.css";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'active' : '';
  };

  return (
    <ConnectionProvider endpoint={clusterApiUrl('devnet')}>
      <WalletProvider wallets={[new PhantomWalletAdapter(), new SolflareWalletAdapter()]} autoConnect>
        <WalletModalProvider>
          <Header />
          <Sidebar />
          <div className="container">
            <div className='sub-container'>
              <TokenPerformanceTable />
              {children}
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default DashboardLayout;
