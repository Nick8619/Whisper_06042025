import React from 'react';
import { Investment } from '@/lib/types';

interface InvestmentListProps {
  investments: Investment[];
  onEdit: (investment: Investment) => void;
  onDelete: (id: string) => void;
  onAnalyze: (symbol: string) => void;
}

export default function InvestmentList({ 
  investments, 
  onEdit, 
  onDelete,
  onAnalyze
}: InvestmentListProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gold-400 mb-4" style={{ color: 'var(--gold-400)' }}>
        Investment List
      </h2>
      <div className="whispercapital-card overflow-x-auto">
        <table className="whispercapital-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Category</th>
              <th>Purchase Price</th>
              <th>Quantity</th>
              <th>Current Price</th>
              <th>Change (%)</th>
              <th>Total Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {investments.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4">No investments found</td>
              </tr>
            ) : (
              investments.map((investment) => (
                <tr key={investment.id}>
                  <td>{investment.symbol}</td>
                  <td>{investment.name}</td>
                  <td>{investment.category}</td>
                  <td>${investment.total_cost && investment.total_quantity ? 
                    (investment.total_cost / investment.total_quantity).toFixed(2) : '0.00'}</td>
                  <td>{investment.total_quantity?.toFixed(2) || '0'}</td>
                  <td>${investment.current_price?.toFixed(2) || '0.00'}</td>
                  <td className={
                    investment.daily_change_percentage && investment.daily_change_percentage > 0 
                      ? 'text-green-500' 
                      : investment.daily_change_percentage && investment.daily_change_percentage < 0 
                        ? 'text-red-500' 
                        : ''
                  }>
                    {investment.daily_change_percentage 
                      ? `${investment.daily_change_percentage > 0 ? '+' : ''}${investment.daily_change_percentage.toFixed(2)}%` 
                      : '0.00%'}
                  </td>
                  <td>${investment.total_value?.toFixed(2) || '0.00'}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onEdit(investment)}
                        className="btn-secondary btn-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => onDelete(investment.id || '')}
                        className="btn-danger btn-sm"
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => onAnalyze(investment.symbol)}
                        className="btn-primary btn-sm"
                      >
                        Analyze
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
