const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface Company {
  id: string
  name: string
  slug: string
  logo_url?: string
  short_summary: string
  website?: string
}

export interface Sector {
  id: string
  name: string
  slug: string
  description?: string
  company_count: number
  companies: Company[]
}

export interface ResearchEntry {
  id: string
  title: string
  content: string
  source_url?: string
  updated_at: string
}

export interface CompanyDetail {
  id: string
  name: string
  slug: string
  logo_url?: string
  short_summary: string
  website?: string
  sector_name: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`)
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }
    return response.json()
  }

  async getSectors(): Promise<Sector[]> {
    return this.request<Sector[]>('/sectors')
  }

  async getSector(slug: string): Promise<Sector> {
    return this.request<Sector>(`/sectors/${slug}`)
  }

  async getCompany(slug: string): Promise<CompanyDetail> {
    return this.request<CompanyDetail>(`/companies/${slug}`)
  }

  async getCompanyResearch(slug: string): Promise<ResearchEntry[]> {
    return this.request<ResearchEntry[]>(`/companies/${slug}/research`)
  }
}

export const apiClient = new ApiClient()
