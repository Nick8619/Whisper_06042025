'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import InvestmentForm from '@/components/InvestmentForm';
import InvestmentList from '@/components/InvestmentList';
import PortfolioSummary from '@/components/PortfolioSummary';
import ChartAnalysisComponent from '@/components/ChartAnalysis';
import PriceAlertForm, { PriceAlertList, Notifications } from '@/components/PriceAlerts';
import { Investment, Alert, PortfolioSummary as PortfolioSummaryType } from '@/lib/types';
import { createInvestment, deleteInvestment, getInvestments, getPortfolioSummary } from '@/lib/api';
import { createAlert, deleteAlert, getAlerts } from '@/lib/api';
import { getChartAnalysis } from '@/lib/api';
import { updateInvestmentPrices } from '@/lib/twelve-data';

export default function Home() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState<Alert[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummaryType>({
    totalValue: 0,
    dailyChange: 0,
    dailyChangePercentage: 0,
    totalAssets: 0,
    currency: 'EUR'
  });
  const [chartAnalysis, setChartAnalysis] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  // Define fetchInvestments and fetchAlerts before using them in useEffect
  const fetchInvestments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      let data = await getInvestments(user.id);
      
      // Update with current market prices
      data = await updateInvestmentPrices(data);
      
      setInvestments(data);
      
      // Update portfolio summary
      const summary = await getPortfolioSummary(user.id);
      setPortfolioSummary(summary);
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    if (!user) return;
    
    try {
      const data = await getAlerts(user.id);
      setAlerts(data.filter(alert => !alert.triggered));
      setTriggeredAlerts(data.filter(alert => alert.triggered && !alert.notification_sent));
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  // Fetch investments and portfolio summary
  useEffect(() => {
    if (user) {
      fetchInvestments();
      fetchAlerts();
    }
  }, [user, fetchInvestments, fetchAlerts]);

  const handleAddInvestment = async (data: Record<string, unknown>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await createInvestment({
        ...data,
        user_id: user.id,
      });
      await fetchInvestments();
    } catch (error) {
      console.error('Error adding investment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInvestment = async (investment: Investment) => {
    // For simplicity, we'll just show an alert for now
    alert(`Edit investment: ${investment.symbol}`);
    // In a real implementation, you would open a modal or form for editing
  };

  const handleDeleteInvestment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this investment?')) return;
    
    try {
      setLoading(true);
      await deleteInvestment(id);
      await fetchInvestments();
    } catch (error) {
      console.error('Error deleting investment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeInvestment = (symbol: string) => {
    const analysis = getChartAnalysis(symbol);
    setChartAnalysis(analysis);
  };

  const handleAddAlert = async (data: Record<string, unknown>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await createAlert({
        ...data,
        user_id: user.id,
        investment_id: '', // This would be set if creating from an investment detail page
      });
      await fetchAlerts();
    } catch (error) {
      console.error('Error adding alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      setLoading(true);
      await deleteAlert(id);
      await fetchAlerts();
    } catch (error) {
      console.error('Error deleting alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissNotification = async (id: string) => {
    setTriggeredAlerts(prev => prev.filter(alert => alert.id !== id));
    // In a real implementation, you would update the alert in the database
  };

  // Select investment categories
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const filteredInvestments = selectedCategory
    ? investments.filter(inv => inv.category === selectedCategory)
    : investments;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gold-400 mb-8" style={{ color: 'var(--gold-400)' }}>
        Configure Your Investments
      </h1>

      {/* Notifications */}
      <Notifications alerts={triggeredAlerts} onDismiss={handleDismissNotification} />

      {/* Portfolio Summary */}
      <PortfolioSummary summary={portfolioSummary} />

      {/* Category Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gold-400 mb-4" style={{ color: 'var(--gold-400)' }}>
          Select Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            className={`whispercapital-card p-4 text-center ${
              selectedCategory === null ? 'border-2 border-gold-400' : ''
            }`}
            style={{ borderColor: selectedCategory === null ? 'var(--gold-400)' : '' }}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          <button
            className={`whispercapital-card p-4 text-center ${
              selectedCategory === 'Aktie' ? 'border-2 border-gold-400' : ''
            }`}
            style={{ borderColor: selectedCategory === 'Aktie' ? 'var(--gold-400)' : '' }}
            onClick={() => setSelectedCategory('Aktie')}
          >
            Stocks
          </button>
          <button
            className={`whispercapital-card p-4 text-center ${
              selectedCategory === 'ETF' ? 'border-2 border-gold-400' : ''
            }`}
            style={{ borderColor: selectedCategory === 'ETF' ? 'var(--gold-400)' : '' }}
            onClick={() => setSelectedCategory('ETF')}
          >
            ETFs
          </button>
          <button
            className={`whispercapital-card p-4 text-center ${
              selectedCategory === 'Krypto' ? 'border-2 border-gold-400' : ''
            }`}
            style={{ borderColor: selectedCategory === 'Krypto' ? 'var(--gold-400)' : '' }}
            onClick={() => setSelectedCategory('Krypto')}
          >
            Cryptocurrencies
          </button>
          <button
            className={`whispercapital-card p-4 text-center ${
              selectedCategory === 'Rohstoff' ? 'border-2 border-gold-400' : ''
            }`}
            style={{ borderColor: selectedCategory === 'Rohstoff' ? 'var(--gold-400)' : '' }}
            onClick={() => setSelectedCategory('Rohstoff')}
          >
            Precious Metals
          </button>
        </div>
      </div>

      {/* Investment Form */}
      <InvestmentForm onSubmit={handleAddInvestment} isLoading={loading} />

      {/* Investment List */}
      <InvestmentList
        investments={filteredInvestments}
        onEdit={handleEditInvestment}
        onDelete={handleDeleteInvestment}
        onAnalyze={handleAnalyzeInvestment}
      />

      {/* Chart Analysis */}
      {chartAnalysis && (
        <ChartAnalysisComponent analysis={chartAnalysis} />
      )}

      {/* Price Alerts */}
      <PriceAlertForm onSubmit={handleAddAlert} isLoading={loading} />
      <PriceAlertList alerts={alerts} onDelete={handleDeleteAlert} />
    </main>
  );
}
