import React from 'react';
import { PortfolioSummary as PortfolioSummaryType } from '@/lib/types';

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
}

export default function PortfolioSummary({ summary }: PortfolioSummaryProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gold-400 mb-4" style={{ color: 'var(--gold-400)' }}>
        Portfolio Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="whispercapital-card p-4">
          <h3 className="text-lg font-medium text-gray-300 mb-2">Total Value</h3>
          <p className="text-3xl font-bold text-white">
            {summary.currency} {summary.totalValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="whispercapital-card p-4">
          <h3 className="text-lg font-medium text-gray-300 mb-2">Daily Change</h3>
          <p className={`text-3xl font-bold ${summary.dailyChange > 0 ? 'text-green-500' : summary.dailyChange < 0 ? 'text-red-500' : 'text-white'}`}>
            {summary.dailyChange > 0 ? '+' : ''}{summary.dailyChange.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
            ({summary.dailyChangePercentage > 0 ? '+' : ''}{summary.dailyChangePercentage.toFixed(2)}%)
          </p>
        </div>
        <div className="whispercapital-card p-4">
          <h3 className="text-lg font-medium text-gray-300 mb-2">Total Assets</h3>
          <p className="text-3xl font-bold text-white">{summary.totalAssets}</p>
        </div>
      </div>
    </div>
  );
}
