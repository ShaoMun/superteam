## Overview
This project is a frontend application built with Next.js, Three.js, GSAP, and Recharts for data visualization. It integrates blockchain functionality using Solana Wallet Adapter, Solana Web3.js, and Solana SPL Token. Additionally, it includes API integrations such as CoinGecko for fetching cryptocurrency data.

## Tech Stack
- **Next.js**: Framework for server-rendered React applications.
- **Three.js**: JavaScript library for creating 3D graphics.
- **GSAP**: High-performance animation library.
- **Recharts**: Library for building responsive charts and data visualizations.
- **Solana Web3.js**: JavaScript API for interacting with the Solana blockchain.
- **Solana Wallet Adapter**: Set of wallet adapters and utilities for Solana applications.
- **Solana SPL Token**: Library for interacting with the SPL Token program on Solana.
- **Axios**: Promise-based HTTP client for making API requests.
- **CoinGecko API**: Provides access to comprehensive cryptocurrency data.


## API Integration
### CoinGecko API
- Fetch cryptocurrency data using Axios from the CoinGecko API.
- Ensure that API rate limits are respected during usage.

### Solana SPL Token API
- Manage SPL tokens on the Solana blockchain using `@solana/spl-token`.


## Installation and Setup
Follow these steps to set up the development environment:
1. **Clone the repository:**
   git clone https://github.com/ShaoMun/superteam.git
2. **Navigate to the project directory:**
   cd solana
3. **Install the dependencies:**
   npm install
4. **Start the development server:**
   npm run dev
5. **Open the application in your browser:**
   Visit http://localhost:3000 to view the application.
