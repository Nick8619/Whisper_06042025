import React from 'react';
import { AuthProvider } from '@/lib/auth-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>
        <AuthProvider>
          <div className="min-h-screen">
            <header className="bg-gray-900 shadow-md">
              <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src="/images/Logo_WhisperCapital.png" 
                    alt="WhisperCapital Logo" 
                    className="h-10"
                  />
                  <div className="ml-2 text-xs text-gray-400">
                    <div>WHISPERCAPITAL</div>
                    <div>FEEL THE BEAT OF YOUR INVESTMENTS</div>
                  </div>
                </div>
                <nav className="hidden md:flex space-x-4">
                  <a href="#" className="text-white hover:text-gold-400 transition-colors">Dashboard</a>
                  <a href="#" className="text-white hover:text-gold-400 transition-colors">Portfolio</a>
                  <a href="#" className="text-white hover:text-gold-400 transition-colors">Insights</a>
                  <a href="#" className="text-white hover:text-gold-400 transition-colors">News</a>
                </nav>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Suchen..."
                      className="whispercapital-input py-1 pl-3 pr-8 text-sm rounded-full"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                  <button className="bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center">
                    JD
                  </button>
                </div>
              </div>
            </header>
            <div className="flex flex-col md:flex-row">
              <aside className="w-full md:w-64 bg-gray-900 md:min-h-screen p-4">
                <nav className="space-y-2">
                  <a href="#" className="whispercapital-card p-3 flex items-center space-x-3 text-white hover:bg-gray-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Dashboard</span>
                  </a>
                  <a href="#" className="whispercapital-card p-3 flex items-center space-x-3 text-white hover:bg-gray-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Portfolio</span>
                  </a>
                  <a href="#" className="whispercapital-card p-3 flex items-center space-x-3 text-white hover:bg-gray-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Insights</span>
                  </a>
                  <div className="mt-8">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Wichtige Metriken</h3>
                    <div className="whispercapital-card p-4 mb-4">
                      <h4 className="text-sm text-gray-300 mb-1">Fear & Greed Index</h4>
                      <div className="flex items-center">
                        <div className="relative w-24 h-24">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="transparent"
                              stroke="#1a2e4c"
                              strokeWidth="10"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="transparent"
                              stroke="#00c6ff"
                              strokeWidth="10"
                              strokeDasharray="282.7"
                              strokeDashoffset="110"
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">61</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm text-gray-400">Gier</div>
                          <div className="text-xs text-gray-500">CURRENT</div>
                        </div>
                      </div>
                    </div>
                    <div className="whispercapital-card p-4">
                      <h4 className="text-sm text-gray-300 mb-1">Global Liquidity</h4>
                      <div className="text-2xl font-bold">$98.21T</div>
                      <div className="text-xs text-gray-500">MD MONEY STOCK</div>
                    </div>
                  </div>
                </nav>
              </aside>
              <main className="flex-1 p-4">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
