import React, { useState } from 'react';
import { InvestmentCategory } from '@/lib/types';

interface InvestmentFormProps {
  onSubmit: (data: {
    symbol: string;
    name: string;
    category: InvestmentCategory;
    purchase_price: number;
    quantity: number;
  }) => void;
  isLoading?: boolean;
}

export default function InvestmentForm({ onSubmit, isLoading = false }: InvestmentFormProps) {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InvestmentCategory>('Aktie');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      symbol,
      name,
      category,
      purchase_price: parseFloat(purchasePrice),
      quantity: parseFloat(quantity),
    });
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gold-400 mb-4" style={{ color: 'var(--gold-400)' }}>
        Add Investment
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="whispercapital-card">
            <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
            <input
              type="text"
              className="whispercapital-input w-full"
              placeholder="Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
            />
          </div>
          <div className="whispercapital-card">
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              type="text"
              className="whispercapital-input w-full"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="whispercapital-card">
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              className="whispercapital-select w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value as InvestmentCategory)}
              required
            >
              <option value="Aktie">Aktie</option>
              <option value="ETF">ETF</option>
              <option value="Krypto">Krypto</option>
              <option value="Rohstoff">Rohstoff</option>
              <option value="Fonds">Fonds</option>
            </select>
          </div>
          <div className="whispercapital-card">
            <label className="block text-sm font-medium text-gray-300 mb-2">Purchase Price</label>
            <input
              type="number"
              step="0.01"
              className="whispercapital-input w-full"
              placeholder="Purchase Price"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              required
            />
          </div>
          <div className="whispercapital-card">
            <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
            <input
              type="number"
              step="0.000001"
              className="whispercapital-input w-full"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
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
            {isLoading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}
