'use client'

import React, { useState } from 'react';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';

const Dashboard = () => {
  
  return (
    <>
        <Header/>
        <div className='page-container'>
            <Sidebar />
            <div>
                
            </div>
        </div>
    </>
  );
};

export default Dashboard;
