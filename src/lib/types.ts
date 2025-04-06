export type InvestmentCategory = 'Aktie' | 'ETF' | 'Krypto' | 'Rohstoff' | 'Fonds';

export interface Investment {
  id?: string;
  user_id?: string;
  symbol: string;
  name: string;
  category: InvestmentCategory;
  created_at?: string;
  updated_at?: string;
  current_price?: number;
  currency?: string;
  total_quantity?: number;
  total_value?: number;
  total_cost?: number;
  total_gain_loss?: number;
  total_gain_loss_percentage?: number;
  daily_change?: number;
  daily_change_percentage?: number;
}

export interface Position {
  id?: string;
  investment_id: string;
  user_id?: string;
  purchase_price: number;
  quantity: number;
  purchase_date?: string;
  created_at?: string;
  updated_at?: string;
  notes?: string;
  purchase_fees?: number;
}

export interface Alert {
  id?: string;
  user_id?: string;
  investment_id: string;
  symbol: string;
  condition: 'above' | 'below';
  price: number;
  created_at?: string;
  updated_at?: string;
  triggered?: boolean;
  triggered_at?: string;
  notification_sent?: boolean;
  notification_type?: 'in-app' | 'email' | 'telegram';
}

export interface PortfolioSummary {
  totalValue: number;
  dailyChange: number;
  dailyChangePercentage: number;
  totalAssets: number;
  currency: string;
}

export interface ChartAnalysis {
  symbol: string;
  rsi: number;
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  sentiment: 'bullisch' | 'neutral' | 'bärisch';
}
