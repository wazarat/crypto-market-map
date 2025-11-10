'use client'

import { useEffect, useRef } from 'react'
import { TrendingUp, ExternalLink } from 'lucide-react'

interface TradingViewChartSimpleProps {
  symbol: string
  companyName: string
}

export default function TradingViewChartSimple({ symbol, companyName }: TradingViewChartSimpleProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear existing content
    containerRef.current.innerHTML = ''

    // Create the TradingView widget script
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js'
    script.async = true

    // Clean ticker symbol
    const cleanSymbol = symbol.toUpperCase().replace(/^(NASDAQ:|NYSE:|TSX:)/, '')
    
    // Map to correct exchange
    const getExchange = (ticker: string) => {
      const exchangeMap: Record<string, string> = {
        'COIN': 'NASDAQ',
        'HOOD': 'NASDAQ', 
        'SQ': 'NYSE',
        'PYPL': 'NASDAQ',
        'V': 'NYSE',
        'MA': 'NYSE'
      }
      return exchangeMap[ticker] || 'NASDAQ'
    }

    const exchange = getExchange(cleanSymbol)
    const fullSymbol = `${exchange}:${cleanSymbol}`

    script.innerHTML = JSON.stringify({
      "symbols": [
        [
          fullSymbol,
          `${cleanSymbol}|1D`
        ]
      ],
      "chartOnly": false,
      "width": "100%",
      "height": "400",
      "locale": "en",
      "colorTheme": "light",
      "autosize": true,
      "showVolume": false,
      "showMA": false,
      "hideDateRanges": false,
      "hideMarketStatus": false,
      "hideSymbolLogo": false,
      "scalePosition": "right",
      "scaleMode": "Normal",
      "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      "fontSize": "10",
      "noTimeScale": false,
      "valuesTracking": "1",
      "changeMode": "price-and-percent",
      "chartType": "area",
      "maLineColor": "#2962FF",
      "maLineWidth": 1,
      "maLength": 9,
      "backgroundColor": "rgba(255, 255, 255, 1)",
      "lineWidth": 2,
      "lineType": 0,
      "dateRanges": [
        "1d|1",
        "1m|30",
        "3m|60",
        "12m|1D",
        "60m|1W",
        "all|1M"
      ]
    })

    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [symbol])

  // Clean ticker for display and links
  const cleanSymbol = symbol.toUpperCase().replace(/^(NASDAQ:|NYSE:|TSX:)/, '')
  const getExchange = (ticker: string) => {
    const exchangeMap: Record<string, string> = {
      'COIN': 'NASDAQ',
      'HOOD': 'NASDAQ', 
      'SQ': 'NYSE',
      'PYPL': 'NASDAQ',
      'V': 'NYSE',
      'MA': 'NYSE'
    }
    return exchangeMap[ticker] || 'NASDAQ'
  }
  const exchange = getExchange(cleanSymbol)
  const fullSymbol = `${exchange}:${cleanSymbol}`

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            {companyName} Stock Chart
          </h3>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
            {cleanSymbol}
          </span>
        </div>
        <a
          href={`https://www.tradingview.com/chart/?symbol=${fullSymbol}`}
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
          className="w-full min-h-[400px] bg-gray-50 rounded-lg"
        >
          {/* Loading state */}
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Loading {cleanSymbol} chart...</p>
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
