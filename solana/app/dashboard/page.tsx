'use client'

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import "../../styles/tokens.css"

const Tokens = () => {

  // Dummy data for charts
  const performanceData = [
    { name: '1d', value: 0 },
    { name: '1w', value: 0 },
    { name: '1m', value: 0 },
    { name: '1y', value: 0 },
    { name: 'Max', value: 0 },
  ];

  const assetData = [
    { name: 'Solana', value: 40 },
    { name: 'Ethereum', value: 30 },
    { name: 'Bitcoin', value: 20 },
    { name: 'Other', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="dashboard">      
      <div className="dashboard-grid">      
        <div className="dashboard-item">
          <h1>Performance</h1>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div> 

        <div className="dashboard-item transact-container">
          <h2>Recent Transactions</h2>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>24 Feb 2025 01:15</td>
                <td>Received</td>
                <td>1SOL</td>
              </tr>
            </tbody>
          </table>
          <a href="#" className="view-all">View all transactions &gt;</a>
        </div>   
      </div>

      
      
      <h3>Assets</h3>
      <div className="dashboard-grid">
        <div className="dashboard-item">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="dashboard-item">
          <table className="asset-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Amount</th>
                <th>Price</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Solana</td>
                <td>10</td>
                <td>$20</td>
                <td>$200</td>
              </tr>
              <tr>
                <td>Ethereum</td>
                <td>0.5</td>
                <td>$3000</td>
                <td>$1500</td>
              </tr>
              <tr>
                <td>Bitcoin</td>
                <td>0.01</td>
                <td>$50000</td>
                <td>$500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tokens;