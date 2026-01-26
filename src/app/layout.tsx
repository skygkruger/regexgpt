import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
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
      <body className="min-h-screen bg-[#1a1a2e] text-[#a8b2c3] antialiased font-mono">
        {children}
      </body>
    </html>
  )
}
