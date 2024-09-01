'use client'

import React, { useState } from 'react';
import '../styles/sidebar.css'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  
  return (
    <>
        <div className='hamburger' onClick={toggleSidebar}>
            <img src='../../hamburger-icon.svg' alt='Menu' />
          </div>
          <div className={`sidebar-container ${isOpen ? 'active' : ''}`}>
                <div className='sidebar-upper'>
                  <a href=""><img src='../../logo.png'/></a>
                  <ul>
                        <a href="/dashboard">
                            <li >
                                <img src="../../dashboard-icon.png" alt="Dashboard Icon" className="nav-icon"/>
                                Dashboard
                            </li>
                        </a>
                        <a href="/explore">
                            <li>
                                <img src="../../explore-icon.png" alt="Explore Icon" className="nav-icon"/>
                                Explore
                            </li>
                        </a>
                        <a href="/swap">
                            <li>
                                <img src="../../swap-icon.png" alt="Swap Icon" className="nav-icon"/>
                                Swap
                            </li>
                        </a>
                        <a href="/bridge">
                            <li>
                                <img src="../../bridge-icon.png" alt="Bridge Icon" className="nav-icon"/>
                                Bridge
                            </li>
                        </a>
                        <a href="/stakestep">
                            <li>
                                <img src="../../stake-icon.png" alt="Stake STEP Icon" className="nav-icon"/>
                                Stake STEP
                            </li>
                        </a>
                        <a href="/stakesol">
                            <li>
                                <img src="../../stake-icon.png" alt="Stake SOL Icon" className="nav-icon"/>
                                Stake SOL
                            </li>
                        </a>
                    </ul>
                </div>

                <div className='sidebar-lower'>
                  <ul>
                    <a href=""><li>Reward Options</li></a>
                    <a href=""><li>Analytics</li></a>
                    <a href=""><li>Docs</li></a>
                  </ul>
                  <button>Connect Wallet</button>
                  <ul className='social-media'>
                    <a href="https://x.com/StepFinance_" target="_blank"><li><img src="../../X.svg" alt="X" /></li></a>
                    <a href="https://discord.com/invite/Pab8wcH5Yt" target="_blank"><li><img src="../../discord.svg" alt="discord" /></li></a>
                    <a href="https://stepfinance.medium.com/" target="_blank"><li><img src="../../medium.svg" alt="medium" /></li></a>
                    <a href="https://stepdata.substack.com/" target="_blank"><li><img src="../../bookmark.svg" alt="stepdata" /></li></a>
                  </ul>
                </div>
            </div>
    </>
  );
};

export default Sidebar;
