# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
cd backend && pip install -r requirements.txt && cd ..
```

### 2. Set Up Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run the SQL from `supabase/schema.sql` in SQL Editor
4. Get your project URL and keys from Settings > API

### 3. Configure Environment
```bash
# Frontend
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your Supabase credentials
```

### 4. Start Development
```bash
# Option 1: Use the startup script
./start-dev.sh

# Option 2: Manual start
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload

# Terminal 2 - Frontend
npm run dev
```

### 5. Open Your Browser
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

## 🎯 What You'll See

1. **Homepage**: Grid of crypto sectors (like the stablecoinsmap layout)
2. **Sector Pages**: Companies within each sector
3. **Company Pages**: Detailed info + personal notes section

## 🔧 Key Features

- ✅ Responsive design with blue/purple theme
- ✅ Interactive sector exploration
- ✅ Company research data
- ✅ Personal notes (stored in Supabase)
- ✅ Mock data included for testing
- ✅ Ready for real auth integration

## 📱 Mobile Friendly

The entire app is responsive and works great on mobile devices.

## 🚢 Deploy

### Vercel (Frontend)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy!

### Railway/Heroku (Backend)
1. Connect GitHub repo
2. Set environment variables
3. Deploy backend
4. Update frontend API URL

## 🎨 Customization

- **Colors**: Edit `tailwind.config.js`
- **Data**: Add more sectors/companies in Supabase
- **Features**: Extend API endpoints in `backend/main.py`

## 🆘 Need Help?

Check the full README.md for detailed instructions and troubleshooting.
