import React from 'react';
import { Alert } from '@/lib/types';

interface PriceAlertFormProps {
  onSubmit: (data: {
    symbol: string;
    condition: 'above' | 'below';
    price: number;
  }) => void;
  isLoading?: boolean;
}

export default function PriceAlertForm({ onSubmit, isLoading = false }: PriceAlertFormProps) {
  const [symbol, setSymbol] = React.useState('');
  const [condition, setCondition] = React.useState<'above' | 'below'>('above');
  const [price, setPrice] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      symbol,
      condition,
      price: parseFloat(price),
    });
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gold-400 mb-4" style={{ color: 'var(--gold-400)' }}>
        Create Price Alert
      </h2>
      <form onSubmit={handleSubmit} className="whispercapital-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
            <input
              type="text"
              className="whispercapital-input w-full"
              placeholder="Symbol (e.g. BTC)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Condition</label>
            <select
              className="whispercapital-select w-full"
              value={condition}
              onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
              required
            >
              <option value="above">Price Above</option>
              <option value="below">Price Below</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
            <input
              type="number"
              step="0.01"
              className="whispercapital-input w-full"
              placeholder="Target Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary px-8"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Alert'}
          </button>
        </div>
      </form>
    </div>
  );
}

interface PriceAlertListProps {
  alerts: Alert[];
  onDelete: (id: string) => void;
}

export function PriceAlertList({ alerts, onDelete }: PriceAlertListProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gold-400 mb-4" style={{ color: 'var(--gold-400)' }}>
        Price Alerts
      </h2>
      <div className="whispercapital-card overflow-x-auto">
        <table className="whispercapital-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Condition</th>
              <th>Target Price</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">No price alerts found</td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.symbol}</td>
                  <td>{alert.condition === 'above' ? 'Above' : 'Below'}</td>
                  <td>${alert.price.toFixed(2)}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs ${
                      alert.triggered ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'
                    }`}>
                      {alert.triggered ? 'Triggered' : 'Active'}
                    </span>
                  </td>
                  <td>{new Date(alert.created_at || '').toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => onDelete(alert.id || '')}
                      className="btn-danger btn-sm"
                    >
                      Delete
                    </button>
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

interface NotificationProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export function Notifications({ alerts, onDismiss }: NotificationProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {alerts.map((alert) => (
        <div 
          key={alert.id} 
          className="whispercapital-card p-4 bg-gray-800 border-l-4 border-gold-400 shadow-lg max-w-md"
          style={{ borderColor: 'var(--gold-400)' }}
        >
          <div className="flex justify-between">
            <h3 className="text-lg font-medium text-gold-400" style={{ color: 'var(--gold-400)' }}>
              Price Alert Triggered
            </h3>
            <button 
              onClick={() => onDismiss(alert.id || '')}
              className="text-gray-400 hover:text-white"
            >
              &times;
            </button>
          </div>
          <p className="mt-2 text-white">
            {alert.symbol} is now {alert.condition === 'above' ? 'above' : 'below'} ${alert.price.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Triggered at {new Date(alert.triggered_at || '').toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
}
