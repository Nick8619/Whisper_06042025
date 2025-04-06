/**
 * Twelve Data API Integration
 * 
 * This file contains functions for fetching market data from the Twelve Data API.
 */

const TWELVE_DATA_API_KEY = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY;
const BASE_URL = 'https://api.twelvedata.com';

export interface StockQuote {
  symbol: string;
  name?: string;
  exchange: string;
  currency: string;
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close: string;
  change: string;
  percent_change: string;
  price?: number;
}

export interface TimeSeriesData {
  meta: {
    symbol: string;
    interval: string;
    currency: string;
    exchange: string;
    type: string;
  };
  values: {
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
  }[];
}

/**
 * Fetches real-time quote data for a given symbol
 */
export async function getQuote(symbol: string): Promise<StockQuote> {
  const url = `${BASE_URL}/quote?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch quote for ${symbol}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Convert string values to numbers for easier use
  data.price = parseFloat(data.close);
  
  return data;
}

/**
 * Fetches time series data for a given symbol
 */
export async function getTimeSeries(
  symbol: string, 
  interval: string = '1day', 
  outputsize: number = 30
): Promise<TimeSeriesData> {
  const url = `${BASE_URL}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${TWELVE_DATA_API_KEY}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch time series for ${symbol}: ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Fetches multiple quotes at once
 */
export async function getMultipleQuotes(symbols: string[]): Promise<Record<string, StockQuote>> {
  if (symbols.length === 0) return {};
  
  const symbolsString = symbols.join(',');
  const url = `${BASE_URL}/quote?symbol=${symbolsString}&apikey=${TWELVE_DATA_API_KEY}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch quotes: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // If only one symbol was requested, wrap it in an object
  if (symbols.length === 1) {
    const result: Record<string, StockQuote> = {};
    result[symbols[0]] = data;
    result[symbols[0]].price = parseFloat(data.close);
    return result;
  }
  
  // Convert string values to numbers for easier use
  Object.keys(data).forEach(symbol => {
    data[symbol].price = parseFloat(data[symbol].close);
  });
  
  return data;
}

/**
 * Searches for symbols by name or keyword
 */
export async function searchSymbols(query: string): Promise<any[]> {
  const url = `${BASE_URL}/symbol_search?symbol=${query}&apikey=${TWELVE_DATA_API_KEY}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to search symbols: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data || [];
}

/**
 * Updates investment data with current market prices
 */
export async function updateInvestmentPrices(investments: any[]) {
  if (investments.length === 0) return investments;
  
  const symbols = investments.map(inv => inv.symbol);
  const quotes = await getMultipleQuotes(symbols);
  
  return investments.map(investment => {
    const quote = quotes[investment.symbol];
    if (!quote) return investment;
    
    const currentPrice = parseFloat(quote.close);
    const previousClose = parseFloat(quote.previous_close);
    const dailyChange = currentPrice - previousClose;
    const dailyChangePercentage = (dailyChange / previousClose) * 100;
    
    // Calculate total value and gain/loss
    const totalQuantity = investment.total_quantity || 0;
    const totalValue = currentPrice * totalQuantity;
    const totalCost = investment.total_cost || 0;
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
    
    return {
      ...investment,
      current_price: currentPrice,
      currency: quote.currency,
      total_value: totalValue,
      total_gain_loss: totalGainLoss,
      total_gain_loss_percentage: totalGainLossPercentage,
      daily_change: dailyChange * totalQuantity,
      daily_change_percentage: dailyChangePercentage
    };
  });
}
