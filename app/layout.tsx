import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SupabaseAuthProvider } from '../lib/supabase-auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Crypto Market Map',
  description: 'Explore the cryptocurrency industry landscape',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseAuthProvider>
          <div className="min-h-screen bg-slate-50">
            {children}
          </div>
        </SupabaseAuthProvider>
      </body>
    </html>
  )
}
