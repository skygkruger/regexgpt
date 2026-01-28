import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://regexgpt.io'),
  title: 'RegexGPT - AI-Powered Regex Generator & Explainer',
  description: 'Generate regex from plain English or explain any regex pattern instantly. Free AI-powered regex tool for developers.',
  keywords: ['regex', 'regular expression', 'regex generator', 'regex explainer', 'AI regex', 'regex help'],
  openGraph: {
    title: 'RegexGPT - AI-Powered Regex Generator & Explainer',
    description: 'Generate regex from plain English or explain any regex pattern instantly.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RegexGPT - AI-Powered Regex Generator & Explainer',
    description: 'Generate regex from plain English or explain any regex pattern instantly.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#14171a] text-[#a8b2c3] antialiased font-mono">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
