'use client'

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import WalletStats from '../../components/walletStats';
import "../../styles/dashboard.css"

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'active' : '';
  };

  return (
    <>
      <Header/>
      <Sidebar />
      <div className="container">
        <div className='sub-container'>
          <WalletStats/>
          <div className='directory'>
            <Link href="/dashboard" className={isActive('/dashboard')}>Tokens</Link>
            <Link href="/dashboard/nft" className={isActive('/dashboard/nft')}>NFTs</Link>
            <Link href="/dashboard/transaction" className={isActive('/dashboard/transaction')}>Transaction</Link>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;