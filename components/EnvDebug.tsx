'use client'

export default function EnvDebug() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const envVars = {
    NEXT_PUBLIC_CHATBOT_ID: process.env.NEXT_PUBLIC_CHATBOT_ID,
    NEXT_PUBLIC_CHATBASE_HOST: process.env.NEXT_PUBLIC_CHATBASE_HOST,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set',
    NODE_ENV: process.env.NODE_ENV
  }

  return (
    <div className="fixed top-4 left-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Environment Debug</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(envVars, null, 2)}
      </pre>
    </div>
  )
}
