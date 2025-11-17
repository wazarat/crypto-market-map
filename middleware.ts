import { NextRequest, NextResponse } from 'next/server'
import { extractSubdomain, getSubdomainConfig } from './lib/subdomain-utils'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const subdomain = extractSubdomain(hostname)
  const config = getSubdomainConfig(hostname)
  
  // Add subdomain info to headers for use in components
  const response = NextResponse.next()
  response.headers.set('x-subdomain', subdomain)
  response.headers.set('x-subdomain-type', config.type)
  response.headers.set('x-corporate-client', config.corporateClient || '')
  
  // Handle subdomain-specific routing
  const url = request.nextUrl.clone()
  
  // For corporate subdomains, we might want to redirect certain paths
  if (config.type !== 'main') {
    // Add any subdomain-specific routing logic here
    // For example, redirect /admin to main domain for corporate users
    if (url.pathname.startsWith('/admin') && config.type === 'pcc') {
      url.hostname = hostname.replace(`${subdomain}.`, '')
      return NextResponse.redirect(url)
    }
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
