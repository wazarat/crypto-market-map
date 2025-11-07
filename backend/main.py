from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import json

# Load environment variables
load_dotenv()

app = FastAPI(title="Crypto Market Map API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-vercel-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if supabase_url and supabase_key:
    supabase: Client = create_client(supabase_url, supabase_key)
else:
    supabase = None
    print("Warning: Supabase not configured, using mock data")

# Pydantic models
class Company(BaseModel):
    id: str
    name: str
    slug: str
    logo_url: Optional[str] = None
    short_summary: str
    website: Optional[str] = None

class Sector(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    company_count: int
    companies: List[Company] = []

class ResearchEntry(BaseModel):
    id: str
    title: str
    content: str
    source_url: Optional[str] = None
    updated_at: str

class CompanyDetail(BaseModel):
    id: str
    name: str
    slug: str
    logo_url: Optional[str] = None
    short_summary: str
    website: Optional[str] = None
    sector_name: str

# Mock data for when Supabase is not available
MOCK_SECTORS = [
    {
        "id": "1",
        "name": "Exchanges / On-Off Ramps",
        "slug": "exchanges-on-off-ramps",
        "description": "Cryptocurrency exchanges and fiat on/off ramp services",
        "companies": [
            {"id": "1", "name": "Coinbase", "slug": "coinbase", "logo_url": "https://via.placeholder.com/40", "short_summary": "Leading US cryptocurrency exchange", "website": "https://coinbase.com"},
            {"id": "2", "name": "Binance", "slug": "binance", "logo_url": "https://via.placeholder.com/40", "short_summary": "World's largest cryptocurrency exchange", "website": "https://binance.com"},
            {"id": "3", "name": "Kraken", "slug": "kraken", "logo_url": "https://via.placeholder.com/40", "short_summary": "Secure and compliant crypto exchange", "website": "https://kraken.com"}
        ]
    },
    {
        "id": "2",
        "name": "Stablecoin Issuers",
        "slug": "stablecoin-issuers",
        "description": "Companies that issue and maintain stablecoins",
        "companies": [
            {"id": "4", "name": "Circle", "slug": "circle", "logo_url": "https://via.placeholder.com/40", "short_summary": "Issuer of USDC stablecoin", "website": "https://circle.com"},
            {"id": "5", "name": "Tether", "slug": "tether", "logo_url": "https://via.placeholder.com/40", "short_summary": "Issuer of USDT stablecoin", "website": "https://tether.to"},
            {"id": "6", "name": "MakerDAO", "slug": "makerdao", "logo_url": "https://via.placeholder.com/40", "short_summary": "Decentralized stablecoin protocol (DAI)", "website": "https://makerdao.com"}
        ]
    },
    {
        "id": "3",
        "name": "Yield",
        "slug": "yield",
        "description": "DeFi protocols and services focused on yield generation",
        "companies": [
            {"id": "7", "name": "Aave", "slug": "aave", "logo_url": "https://via.placeholder.com/40", "short_summary": "Decentralized lending protocol", "website": "https://aave.com"},
            {"id": "8", "name": "Compound", "slug": "compound", "logo_url": "https://via.placeholder.com/40", "short_summary": "Algorithmic money market protocol", "website": "https://compound.finance"},
            {"id": "9", "name": "Yearn Finance", "slug": "yearn-finance", "logo_url": "https://via.placeholder.com/40", "short_summary": "Yield optimization protocol", "website": "https://yearn.finance"}
        ]
    },
    {
        "id": "4",
        "name": "B2B Payments",
        "slug": "b2b-payments",
        "description": "Business-to-business payment solutions using crypto",
        "companies": [
            {"id": "10", "name": "BitPay", "slug": "bitpay", "logo_url": "https://via.placeholder.com/40", "short_summary": "Bitcoin payment processor", "website": "https://bitpay.com"},
            {"id": "11", "name": "Ripple", "slug": "ripple", "logo_url": "https://via.placeholder.com/40", "short_summary": "Enterprise blockchain solutions", "website": "https://ripple.com"}
        ]
    },
    {
        "id": "5",
        "name": "Cross Border",
        "slug": "cross-border",
        "description": "Cross-border payment and remittance services",
        "companies": [
            {"id": "12", "name": "Stellar", "slug": "stellar", "logo_url": "https://via.placeholder.com/40", "short_summary": "Cross-border payment network", "website": "https://stellar.org"},
            {"id": "13", "name": "Remitly", "slug": "remitly", "logo_url": "https://via.placeholder.com/40", "short_summary": "Digital remittance service", "website": "https://remitly.com"}
        ]
    },
    {
        "id": "6",
        "name": "Wallets",
        "slug": "wallets",
        "description": "Cryptocurrency wallet providers and custody solutions",
        "companies": [
            {"id": "14", "name": "MetaMask", "slug": "metamask", "logo_url": "https://via.placeholder.com/40", "short_summary": "Popular Ethereum wallet", "website": "https://metamask.io"},
            {"id": "15", "name": "Ledger", "slug": "ledger", "logo_url": "https://via.placeholder.com/40", "short_summary": "Hardware wallet manufacturer", "website": "https://ledger.com"},
            {"id": "16", "name": "Trust Wallet", "slug": "trust-wallet", "logo_url": "https://via.placeholder.com/40", "short_summary": "Multi-currency mobile wallet", "website": "https://trustwallet.com"}
        ]
    }
]

MOCK_RESEARCH = {
    "coinbase": [
        {"id": "1", "title": "Coinbase Q3 2023 Earnings", "content": "Coinbase reported strong Q3 results with increased trading volume and institutional adoption. The company showed resilience in a challenging market environment.", "source_url": "https://investor.coinbase.com", "updated_at": "2023-11-01T10:00:00Z"}
    ],
    "circle": [
        {"id": "2", "title": "USDC Market Analysis", "content": "Circle's USDC maintains its position as the second-largest stablecoin by market cap. Recent regulatory clarity has strengthened its position in the market.", "source_url": "https://circle.com/blog", "updated_at": "2023-10-28T14:30:00Z"}
    ],
    "aave": [
        {"id": "3", "title": "Aave V3 Protocol Update", "content": "Aave V3 introduces new features including cross-chain functionality and improved capital efficiency. The protocol continues to lead in DeFi innovation.", "source_url": "https://aave.com/blog", "updated_at": "2023-10-25T09:15:00Z"}
    ]
}

@app.get("/")
async def root():
    return {"message": "Crypto Market Map API", "version": "1.0.0"}

@app.get("/sectors", response_model=List[Sector])
async def get_sectors():
    """Get all sectors with company counts"""
    if supabase:
        try:
            # Fetch sectors with company counts from Supabase
            sectors_response = supabase.table("sectors").select("*, companies(count)").execute()
            sectors = []
            for sector_data in sectors_response.data:
                companies_response = supabase.table("companies").select("*").eq("sector_id", sector_data["id"]).execute()
                companies = [Company(**company) for company in companies_response.data]
                
                sector = Sector(
                    id=sector_data["id"],
                    name=sector_data["name"],
                    slug=sector_data["slug"],
                    description=sector_data["description"],
                    company_count=len(companies),
                    companies=companies
                )
                sectors.append(sector)
            return sectors
        except Exception as e:
            print(f"Supabase error: {e}")
            # Fall back to mock data
            pass
    
    # Use mock data
    sectors = []
    for sector_data in MOCK_SECTORS:
        companies = [Company(**company) for company in sector_data["companies"]]
        sector = Sector(
            id=sector_data["id"],
            name=sector_data["name"],
            slug=sector_data["slug"],
            description=sector_data["description"],
            company_count=len(companies),
            companies=companies
        )
        sectors.append(sector)
    return sectors

@app.get("/sectors/{slug}", response_model=Sector)
async def get_sector(slug: str):
    """Get sector details with companies"""
    if supabase:
        try:
            # Fetch sector from Supabase
            sector_response = supabase.table("sectors").select("*").eq("slug", slug).execute()
            if not sector_response.data:
                raise HTTPException(status_code=404, detail="Sector not found")
            
            sector_data = sector_response.data[0]
            companies_response = supabase.table("companies").select("*").eq("sector_id", sector_data["id"]).execute()
            companies = [Company(**company) for company in companies_response.data]
            
            return Sector(
                id=sector_data["id"],
                name=sector_data["name"],
                slug=sector_data["slug"],
                description=sector_data["description"],
                company_count=len(companies),
                companies=companies
            )
        except HTTPException:
            raise
        except Exception as e:
            print(f"Supabase error: {e}")
            # Fall back to mock data
            pass
    
    # Use mock data
    for sector_data in MOCK_SECTORS:
        if sector_data["slug"] == slug:
            companies = [Company(**company) for company in sector_data["companies"]]
            return Sector(
                id=sector_data["id"],
                name=sector_data["name"],
                slug=sector_data["slug"],
                description=sector_data["description"],
                company_count=len(companies),
                companies=companies
            )
    
    raise HTTPException(status_code=404, detail="Sector not found")

@app.get("/companies/{slug}", response_model=CompanyDetail)
async def get_company(slug: str):
    """Get company details"""
    if supabase:
        try:
            # Fetch company with sector info from Supabase
            company_response = supabase.table("companies").select("*, sectors(name)").eq("slug", slug).execute()
            if not company_response.data:
                raise HTTPException(status_code=404, detail="Company not found")
            
            company_data = company_response.data[0]
            return CompanyDetail(
                id=company_data["id"],
                name=company_data["name"],
                slug=company_data["slug"],
                logo_url=company_data["logo_url"],
                short_summary=company_data["short_summary"],
                website=company_data["website"],
                sector_name=company_data["sectors"]["name"]
            )
        except HTTPException:
            raise
        except Exception as e:
            print(f"Supabase error: {e}")
            # Fall back to mock data
            pass
    
    # Use mock data
    for sector_data in MOCK_SECTORS:
        for company_data in sector_data["companies"]:
            if company_data["slug"] == slug:
                return CompanyDetail(
                    id=company_data["id"],
                    name=company_data["name"],
                    slug=company_data["slug"],
                    logo_url=company_data["logo_url"],
                    short_summary=company_data["short_summary"],
                    website=company_data["website"],
                    sector_name=sector_data["name"]
                )
    
    raise HTTPException(status_code=404, detail="Company not found")

@app.get("/companies/{slug}/research", response_model=List[ResearchEntry])
async def get_company_research(slug: str):
    """Get research entries for a company"""
    if supabase:
        try:
            # First get company ID
            company_response = supabase.table("companies").select("id").eq("slug", slug).execute()
            if not company_response.data:
                raise HTTPException(status_code=404, detail="Company not found")
            
            company_id = company_response.data[0]["id"]
            
            # Fetch research entries
            research_response = supabase.table("company_research").select("*").eq("company_id", company_id).order("updated_at", desc=True).execute()
            return [ResearchEntry(**entry) for entry in research_response.data]
        except HTTPException:
            raise
        except Exception as e:
            print(f"Supabase error: {e}")
            # Fall back to mock data
            pass
    
    # Use mock data
    if slug in MOCK_RESEARCH:
        return [ResearchEntry(**entry) for entry in MOCK_RESEARCH[slug]]
    
    return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
