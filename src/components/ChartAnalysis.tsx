import React from 'react';
import { ChartAnalysis } from '@/lib/types';

interface ChartAnalysisComponentProps {
  analysis: ChartAnalysis;
}

export default function ChartAnalysisComponent({ analysis }: ChartAnalysisComponentProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullisch':
        return 'text-green-500';
      case 'bärisch':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <div className="whispercapital-card p-4">
      <h3 className="text-xl font-bold text-gold-400 mb-4" style={{ color: 'var(--gold-400)' }}>
        Chart Analysis: {analysis.symbol}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-800 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-1">RSI</h4>
          <p className="text-2xl font-bold text-white">{analysis.rsi.toFixed(2)}</p>
          <p className="text-xs text-gray-400">
            {analysis.rsi > 70 ? 'Überkauft' : analysis.rsi < 30 ? 'Überverkauft' : 'Neutral'}
          </p>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-1">MACD</h4>
          <p className="text-2xl font-bold text-white">{analysis.macd.histogram.toFixed(2)}</p>
          <p className="text-xs text-gray-400">
            Histogram: {analysis.macd.histogram > 0 ? 'Positiv' : 'Negativ'}
          </p>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-1">Bollinger Bands</h4>
          <p className="text-2xl font-bold text-white">{analysis.bollingerBands.middle.toFixed(2)}</p>
          <p className="text-xs text-gray-400">
            Breite: {(analysis.bollingerBands.upper - analysis.bollingerBands.lower).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Gesamtbewertung</h4>
        <p className={`text-3xl font-bold ${getSentimentColor(analysis.sentiment)}`}>
          {analysis.sentiment.toUpperCase()}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {analysis.sentiment === 'bullisch'
            ? 'Die technischen Indikatoren deuten auf steigende Kurse hin.'
            : analysis.sentiment === 'bärisch'
            ? 'Die technischen Indikatoren deuten auf fallende Kurse hin.'
            : 'Die technischen Indikatoren zeigen keine klare Richtung.'}
        </p>
      </div>
    </div>
  );
}
