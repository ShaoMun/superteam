'use client'

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import "../../styles/tokens.css"
import TransactionList from "../../components/TransactionList";
import TokenDistribution from '../../components/TokenDistribution';

const Tokens = () => {

  // Dummy data for charts
  const performanceData = [
    { name: '1d', value: 1 },
    { name: '1w', value: 2 },
    { name: '1m', value: 5 },
    { name: '1y', value: 3 },
    { name: 'Max', value: 9 },
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

        <TransactionList/>   
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
        
        <TokenDistribution/>
      </div>
    </div>
  );
};

export default Tokens;