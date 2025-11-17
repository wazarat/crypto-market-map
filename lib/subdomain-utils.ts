// Subdomain detection and routing utilities
export type SubdomainType = 'main' | 'pcc' | 'enterprise'

export interface SubdomainConfig {
  type: SubdomainType
  name: string
  displayName: string
  corporateClient?: string
  theme?: {
    primaryColor: string
    logo?: string
    brandName: string
  }
}

// Subdomain configurations
export const SUBDOMAIN_CONFIGS: Record<string, SubdomainConfig> = {
  'main': {
    type: 'main',
    name: 'main',
    displayName: 'CanHav Research Portal',
    theme: {
      primaryColor: 'indigo',
      brandName: 'CanHav'
    }
  },
  'pcc': {
    type: 'pcc',
    name: 'pcc',
    displayName: 'PCC Corporate Portal',
    corporateClient: 'PCC',
    theme: {
      primaryColor: 'blue',
      brandName: 'PCC Portal'
    }
  }
}

/**
 * Extract subdomain from hostname
 * @param hostname - The full hostname (e.g., 'pcc.canhav.com', 'canhav.com')
 * @returns The subdomain or 'main' for the root domain
 */
export function extractSubdomain(hostname: string): string {
  // Handle localhost development
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // Check for subdomain in localhost (e.g., pcc.localhost:3000)
    const parts = hostname.split('.')
    if (parts.length > 1 && parts[0] !== 'localhost') {
      return parts[0]
    }
    return 'main'
  }

  // Production domain handling
  const parts = hostname.split('.')
  
  // For canhav.com or www.canhav.com
  if (parts.length <= 2 || (parts.length === 3 && parts[0] === 'www')) {
    return 'main'
  }
  
  // For subdomain.canhav.com
  if (parts.length >= 3) {
    return parts[0]
  }
  
  return 'main'
}

/**
 * Get subdomain configuration
 * @param hostname - The full hostname
 * @returns SubdomainConfig object
 */
export function getSubdomainConfig(hostname: string): SubdomainConfig {
  const subdomain = extractSubdomain(hostname)
  return SUBDOMAIN_CONFIGS[subdomain] || SUBDOMAIN_CONFIGS['main']
}

/**
 * Check if current subdomain is corporate
 * @param hostname - The full hostname
 * @returns boolean indicating if it's a corporate subdomain
 */
export function isCorporateSubdomain(hostname: string): boolean {
  const config = getSubdomainConfig(hostname)
  return config.type !== 'main'
}

/**
 * Get the appropriate redirect URL for a subdomain
 * @param subdomain - The subdomain type
 * @param path - The path to redirect to (default: '/')
 * @returns Full URL for redirect
 */
export function getSubdomainUrl(subdomain: string, path: string = '/'): string {
  if (typeof window === 'undefined') {
    // Server-side: construct URL based on environment
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'canhav.io' 
      : 'localhost:3000'
    
    if (subdomain === 'main') {
      return `${protocol}://${baseUrl}${path}`
    }
    
    return `${protocol}://${subdomain}.${baseUrl}${path}`
  }
  
  // Client-side: use current protocol and construct URL
  const protocol = window.location.protocol
  const port = window.location.port ? `:${window.location.port}` : ''
  const baseUrl = window.location.hostname.includes('localhost') 
    ? `localhost${port}`
    : 'canhav.io'
  
  if (subdomain === 'main') {
    return `${protocol}//${baseUrl}${path}`
  }
  
  return `${protocol}//${subdomain}.${baseUrl}${path}`
}

/**
 * Hook to get current subdomain configuration (client-side only)
 */
export function useSubdomain() {
  if (typeof window === 'undefined') {
    return SUBDOMAIN_CONFIGS['main']
  }
  
  return getSubdomainConfig(window.location.hostname)
}
