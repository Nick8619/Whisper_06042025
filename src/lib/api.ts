import { supabase } from './supabase';
import { Investment, Position, Alert, PortfolioSummary, ChartAnalysis } from './types';

// Investment Management
export async function createInvestment(investment: Investment) {
  const { data, error } = await supabase
    .from('investments')
    .insert([investment])
    .select();
  
  if (error) throw error;
  return data?.[0];
}

export async function updateInvestment(id: string, investment: Partial<Investment>) {
  const { data, error } = await supabase
    .from('investments')
    .update(investment)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data?.[0];
}

export async function deleteInvestment(id: string) {
  const { error } = await supabase
    .from('investments')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

export async function getInvestments(userId: string) {
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data as Investment[];
}

export async function getInvestment(id: string) {
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Investment;
}

// Position Management
export async function createPosition(position: Position) {
  const { data, error } = await supabase
    .from('positions')
    .insert([position])
    .select();
  
  if (error) throw error;
  return data?.[0];
}

export async function updatePosition(id: string, position: Partial<Position>) {
  const { data, error } = await supabase
    .from('positions')
    .update(position)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data?.[0];
}

export async function deletePosition(id: string) {
  const { error } = await supabase
    .from('positions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

export async function getPositions(investmentId: string) {
  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('investment_id', investmentId);
  
  if (error) throw error;
  return data as Position[];
}

// Alert Management
export async function createAlert(alert: Alert) {
  const { data, error } = await supabase
    .from('alerts')
    .insert([alert])
    .select();
  
  if (error) throw error;
  return data?.[0];
}

export async function updateAlert(id: string, alert: Partial<Alert>) {
  const { data, error } = await supabase
    .from('alerts')
    .update(alert)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data?.[0];
}

export async function deleteAlert(id: string) {
  const { error } = await supabase
    .from('alerts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

export async function getAlerts(userId: string) {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data as Alert[];
}

// Portfolio Summary
export async function getPortfolioSummary(userId: string): Promise<PortfolioSummary> {
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  
  const investments = data as Investment[];
  
  // Calculate portfolio summary
  const totalValue = investments.reduce((sum, investment) => sum + (investment.total_value || 0), 0);
  const dailyChange = investments.reduce((sum, investment) => sum + (investment.daily_change || 0), 0);
  const totalAssets = investments.length;
  
  // Calculate daily change percentage
  const dailyChangePercentage = totalValue > 0 ? (dailyChange / totalValue) * 100 : 0;
  
  // Get user's preferred currency
  const { data: preferences, error: prefError } = await supabase
    .from('preferences')
    .select('currency')
    .eq('user_id', userId)
    .single();
  
  if (prefError) throw prefError;
  
  return {
    totalValue,
    dailyChange,
    dailyChangePercentage,
    totalAssets,
    currency: preferences?.currency || 'EUR'
  };
}

// Chart Analysis (Dummy implementation for now)
export function getChartAnalysis(symbol: string): ChartAnalysis {
  // Generate random values for demonstration
  const rsi = Math.floor(Math.random() * 100);
  const macdValue = Math.random() * 2 - 1;
  const macdSignal = Math.random() * 2 - 1;
  const macdHistogram = macdValue - macdSignal;
  
  const middleBand = Math.random() * 100 + 100;
  const volatility = Math.random() * 10 + 5;
  
  // Determine sentiment based on RSI and MACD
  let sentiment: 'bullisch' | 'neutral' | 'bärisch';
  if (rsi > 70 || macdHistogram > 0.5) {
    sentiment = 'bullisch';
  } else if (rsi < 30 || macdHistogram < -0.5) {
    sentiment = 'bärisch';
  } else {
    sentiment = 'neutral';
  }
  
  return {
    symbol,
    rsi,
    macd: {
      value: macdValue,
      signal: macdSignal,
      histogram: macdHistogram
    },
    bollingerBands: {
      upper: middleBand + volatility * 2,
      middle: middleBand,
      lower: middleBand - volatility * 2
    },
    sentiment
  };
}
