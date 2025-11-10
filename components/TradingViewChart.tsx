'use client'

import { useEffect, useRef } from 'react'
import { TrendingUp, ExternalLink } from 'lucide-react'

interface TradingViewChartProps {
  symbol: string
  companyName: string
}

declare global {
  interface Window {
    TradingView: any
  }
}

export default function TradingViewChart({ symbol, companyName }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    // Load TradingView script if not already loaded
    if (!window.TradingView) {
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
      script.async = true
      script.onload = () => {
        initializeWidget()
      }
      document.head.appendChild(script)
    } else {
      initializeWidget()
    }

    return () => {
      // Cleanup widget on unmount
      if (widgetRef.current) {
        try {
          widgetRef.current.remove()
        } catch (e) {
          console.log('TradingView widget cleanup error:', e)
        }
      }
    }
  }, [symbol])

  const getFullSymbol = (ticker: string) => {
    // Clean the ticker symbol
    const cleanTicker = ticker.toUpperCase().replace(/^(NASDAQ:|NYSE:|TSX:)/, '')
    
    // Map common crypto/fintech companies to their exchanges
    const exchangeMap: Record<string, string> = {
      'COIN': 'NASDAQ:COIN',
      'HOOD': 'NASDAQ:HOOD',
      'SQ': 'NYSE:SQ',
      'PYPL': 'NASDAQ:PYPL',
      'V': 'NYSE:V',
      'MA': 'NYSE:MA',
      'MSTR': 'NASDAQ:MSTR',
      'TSLA': 'NASDAQ:TSLA'
    }
    
    // Return mapped symbol or default to NASDAQ
    return exchangeMap[cleanTicker] || `NASDAQ:${cleanTicker}`
  }

  const initializeWidget = () => {
    if (!containerRef.current || !window.TradingView) return

    // Clear existing widget
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
    }

    try {
      const fullSymbol = getFullSymbol(symbol)
      console.log('Loading TradingView chart for:', fullSymbol)
      
      widgetRef.current = new window.TradingView.widget({
        autosize: true,
        symbol: fullSymbol,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'light',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true, // Allow users to change symbol
        container_id: containerRef.current.id,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        studies: [
          'Volume@tv-basicstudies'
        ],
        show_popup_button: true,
        popup_width: '1000',
        popup_height: '650',
        // Add error handling
        onChartReady: () => {
          console.log('TradingView chart loaded successfully for', fullSymbol)
        }
      })
    } catch (error) {
      console.error('TradingView widget initialization error:', error)
      // Show error message in the container
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="flex items-center justify-center h-full bg-red-50 rounded-lg">
            <div class="text-center">
              <p class="text-red-600 font-medium">Chart Loading Error</p>
              <p class="text-red-500 text-sm">Unable to load chart for ${symbol}</p>
            </div>
          </div>
        `
      }
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            {companyName} Stock Chart
          </h3>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
            {symbol}
          </span>
        </div>
        <a
          href={`https://www.tradingview.com/chart/?symbol=${getFullSymbol(symbol)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          View on TradingView
        </a>
      </div>
      
      <div className="relative">
        <div 
          ref={containerRef}
          id={`tradingview-widget-${symbol}`}
          className="w-full h-96 bg-gray-50 rounded-lg"
        >
          {/* Loading state */}
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Loading chart...</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>
          Chart powered by{' '}
          <a 
            href="https://www.tradingview.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
          >
            TradingView
          </a>
          . Real-time data may be delayed.
        </p>
      </div>
    </div>
  )
}
