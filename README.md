# Crypto Market Map

A full-stack web application that provides an interactive market map of the cryptocurrency industry. Users can explore different sectors, view companies within each sector, and add personal notes about companies.

## Features

- **Interactive Market Map**: Grid-based layout inspired by stablecoinsmap.com
- **Sector Exploration**: Click on sectors to view all companies within that sector
- **Company Details**: Detailed company pages with research data and personal notes
- **User Notes**: Add, view, and delete personal notes for each company (stored in Supabase)
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Blue and purple theme with clean, modern design

## Tech Stack

### Frontend
- **Next.js 14** (React framework with App Router)
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Lucide React** for icons
- **SWR** for data fetching (ready to implement)

### Backend
- **FastAPI** (Python) for API endpoints
- **Supabase** (PostgreSQL) for database
- **Uvicorn** for ASGI server

### Database
- **Supabase** (PostgreSQL with real-time features)

## Project Structure

```
crypto-market-map/
├── app/                          # Next.js App Router pages
│   ├── company/[slug]/          # Company detail pages
│   ├── sector/[slug]/           # Sector detail pages
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── backend/                     # FastAPI backend
│   ├── main.py                  # FastAPI application
│   ├── requirements.txt         # Python dependencies
│   └── .env.example            # Environment variables template
├── lib/                         # Utility libraries
│   ├── api.ts                   # API client for FastAPI
│   ├── supabase.ts             # Supabase client configuration
│   └── utils.ts                # Utility functions
├── supabase/                    # Database schema and migrations
│   └── schema.sql              # Database schema with sample data
└── package.json                # Node.js dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Supabase account

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd crypto-market-map

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Go to SQL Editor and run the schema from `supabase/schema.sql`

### 3. Configure Environment Variables

#### Frontend (.env.local)
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MOCK_USER_ID=550e8400-e29b-41d4-a716-446655440000
```

#### Backend (backend/.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
```

### 4. Run the Development Servers

#### Start the FastAPI Backend
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

#### Start the Next.js Frontend
```bash
# In a new terminal, from the project root
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

The FastAPI backend provides the following endpoints:

- `GET /sectors` - List all sectors with company counts
- `GET /sectors/{slug}` - Get sector details with companies
- `GET /companies/{slug}` - Get company details
- `GET /companies/{slug}/research` - Get research entries for a company

## Database Schema

### Tables

1. **sectors** - Industry sectors (e.g., "Exchanges", "Stablecoins")
2. **companies** - Companies within each sector
3. **company_research** - Research articles and analysis for companies
4. **user_notes** - Personal notes added by users for companies

### Sample Data

The schema includes sample data for:
- 6 sectors (Exchanges, Stablecoins, Yield, B2B Payments, Cross Border, Wallets)
- 16+ companies across these sectors
- Sample research entries

## Deployment

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` (your deployed FastAPI URL)
   - `NEXT_PUBLIC_MOCK_USER_ID`

### Deploy Backend

#### Option 1: Railway
1. Connect your GitHub repo to Railway
2. Set environment variables in Railway dashboard
3. Railway will auto-deploy from the `backend` directory

#### Option 2: Heroku
```bash
# From backend directory
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile
git add .
git commit -m "Add Procfile"
heroku create your-app-name
heroku config:set SUPABASE_URL=your_url SUPABASE_KEY=your_key
git push heroku main
```

#### Option 3: DigitalOcean App Platform
1. Create new app from GitHub repo
2. Set build command: `pip install -r requirements.txt`
3. Set run command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables

### Production Environment Variables

Update your frontend environment variables to point to your deployed backend:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Features in Detail

### Homepage
- Grid layout of sector cards inspired by stablecoinsmap.com
- Each card shows sector name, company count, and company "pills"
- Hover effects and smooth transitions

### Sector Pages
- Detailed view of all companies in a sector
- Company cards with logos, descriptions, and quick actions
- Breadcrumb navigation

### Company Pages
- Company overview with logo, description, and website link
- Research section with latest analysis and articles
- Personal notes section with add/edit/delete functionality
- Sticky notes sidebar for easy access

### Notes System
- Personal notes stored per user per company
- Real-time sync with Supabase
- Markdown support ready for implementation
- Delete functionality with confirmation

## Customization

### Adding New Sectors/Companies
1. Add data directly in Supabase dashboard, or
2. Extend the sample data in `supabase/schema.sql`

### Styling
- Modify `tailwind.config.js` for color scheme changes
- Update `app/globals.css` for global styles
- Component styles are inline with Tailwind classes

### API Extensions
- Add new endpoints in `backend/main.py`
- Extend the API client in `lib/api.ts`

## Authentication (Future Enhancement)

The app is set up for easy auth integration:

1. Enable Supabase Auth in your project
2. Replace `MOCK_USER_ID` with real user authentication
3. Add auth middleware to protect user-specific data
4. Update the notes system to use real user IDs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the GitHub issues
2. Review the Supabase documentation
3. Check FastAPI documentation
4. Review Next.js documentation
