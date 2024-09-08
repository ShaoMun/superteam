'use client'

import React, { useEffect, useState } from 'react';
import { getSPLTokenPerformance } from '../utils/solana';
import '../styles/splperformance.css';

const SPLTokenPerformanceTable = () => {
    const [splTokenData, setSPLTokenData] = useState([]);
    const [displayedTokens, setDisplayedTokens] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const tokensPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSPLTokenPerformance();
                setSPLTokenData(data);
                setError('');
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    setError('Rate limit exceeded. Please try again later.');
                } else {
                    setError('An error occurred while fetching data.');
                }
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const startIndex = (currentPage - 1) * tokensPerPage;
        const endIndex = startIndex + tokensPerPage;
        setDisplayedTokens(splTokenData.slice(startIndex, endIndex));
    }, [splTokenData, currentPage]);

    const handleNextPage = () => {
        if (currentPage * tokensPerPage < splTokenData.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="spl-token-table-container">
            {error && <p className="error-message">{error}</p>}
            <div className="table-responsive">
                <table className="spl-token-table">
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Price (USD)</th>
                            <th>1h %</th>
                            <th>24h %</th>
                            <th>7d %</th>
                            <th>24h Volume</th>
                            <th>Market Cap</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedTokens.map(token => (
                            <tr key={token.id}>
                                <td>
                                    <div className="token-info">
                                        <img
                                            src={token.image}
                                            alt={token.name}
                                            width="30"
                                            height="30"
                                        />
                                        <span>{token.name}</span>
                                    </div>
                                </td>
                                <td>${token.current_price.toFixed(2)}</td>
                                <td className={token.price_change_percentage_1h_in_currency > 0 ? 'positive-change' : 'negative-change'}>
                                    {token.price_change_percentage_1h_in_currency?.toFixed(2)}%
                                </td>
                                <td className={token.price_change_percentage_24h > 0 ? 'positive-change' : 'negative-change'}>
                                    {token.price_change_percentage_24h?.toFixed(2)}%
                                </td>
                                <td className={token.price_change_percentage_7d_in_currency > 0 ? 'positive-change' : 'negative-change'}>
                                    {token.price_change_percentage_7d_in_currency?.toFixed(2)}%
                                </td>
                                <td>${token.total_volume.toLocaleString()}</td>
                                <td>${token.market_cap.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination-controls">
                <button
                    className="pagination-button"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button
                    className="pagination-button"
                    onClick={handleNextPage}
                    disabled={currentPage * tokensPerPage >= splTokenData.length}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default SPLTokenPerformanceTable;