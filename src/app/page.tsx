'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { AuthModal } from '@/components/auth/AuthModal'

type Mode = 'generate' | 'explain'

export default function Home() {
  const { user, session, loading: authLoading, signOut } = useAuth()
  const [mode, setMode] = useState<Mode>('generate')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [remaining, setRemaining] = useState<number | null>(null)
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530)
    return () => clearInterval(interval)
  }, [])

  // Check for upgrade success/cancel in URL and fetch user plan
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('upgrade') === 'success') {
      window.history.replaceState({}, '', '/')
    }
  }, [])

  // Fetch user's plan when logged in
  useEffect(() => {
    async function fetchUserPlan() {
      if (!session?.access_token) return

      try {
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          if (data.plan) {
            setPlan(data.plan)
          }
        }
      } catch (err) {
        console.error('Failed to fetch user plan:', err)
      }
    }

    fetchUserPlan()
  }, [session])

  const handleSubmit = async () => {
    if (!input.trim()) return

    setLoading(true)
    setError('')
    setOutput('')

    try {
      const endpoint = mode === 'generate' ? '/api/generate' : '/api/explain'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429 && data.upgrade) {
          setError(data.error)
        } else {
          throw new Error(data.error || 'Something went wrong')
        }
        return
      }

      setOutput(data.result)
      if (data.remaining !== undefined) {
        setRemaining(data.remaining)
      }
      if (data.plan) {
        setPlan(data.plan)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUpgrade = async () => {
    if (!user) {
      setAuthMode('signin')
      setShowAuthModal(true)
      return
    }

    setUpgradeLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout')
    } finally {
      setUpgradeLoading(false)
    }
  }

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open billing portal')
      }

      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open billing portal')
    }
  }

  const examples = mode === 'generate'
    ? [
      'match an email address',
      'match a URL starting with https',
      'match a phone number like (123) 456-7890',
      'match a hex color code like #FF5733',
    ]
    : [
      '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      '\\d{3}-\\d{3}-\\d{4}',
      '^https?:\\/\\/',
      '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
    ]

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#14171a',
        color: '#a8b2c3',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        fontSize: '14px',
      }}
    >
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />

      {/* HEADER */}
      <header style={{ borderBottom: '1px solid #6e6a86' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <span style={{ color: '#7eb8da', fontSize: '18px', letterSpacing: '-0.025em' }}>REGEXGPT</span>
              <span
                style={{
                  color: '#7eb8da',
                  opacity: cursorVisible ? 1 : 0,
                  transition: 'opacity 0.1s',
                }}
              >_</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {[
                { label: 'DOCS', href: '/docs' },
                { label: 'PRICING', href: '#pricing' },
                { label: 'GITHUB', href: 'https://github.com/skygkruger' },
                { label: '@', href: 'https://x.com/run_veridian' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    position: 'relative',
                    color: hoveredNav === item.label ? '#7eb8da' : '#6e6a86',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    paddingLeft: hoveredNav === item.label ? '16px' : '0',
                  }}
                  onMouseEnter={() => setHoveredNav(item.label)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  {hoveredNav === item.label && <span style={{ position: 'absolute', left: 0, color: '#7eb8da' }}>&gt;</span>}
                  [{item.label}]
                </Link>
              ))}
              {authLoading ? (
                <span style={{ color: '#6e6a86' }}>[...]</span>
              ) : user ? (
                <>
                  <span style={{ color: '#a8d8b9' }}>[{plan.toUpperCase()}]</span>
                  <button
                    onClick={() => signOut()}
                    style={{
                      background: 'none',
                      border: '1px solid #6e6a86',
                      color: '#6e6a86',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      padding: '6px 16px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#6e6a86';
                      e.currentTarget.style.color = '#14171a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#6e6a86';
                    }}
                  >
                    [LOGOUT]
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setAuthMode('signin'); setShowAuthModal(true); }}
                  style={{
                    background: 'none',
                    border: '1px solid #7eb8da',
                    color: '#7eb8da',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    padding: '6px 16px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#7eb8da';
                    e.currentTarget.style.color = '#14171a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#7eb8da';
                  }}
                >
                  [LOGIN]
                </button>
              )}
            </nav>

            {/* Mobile Menu */}
            <div className="mobile-menu-btn" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href="/docs" style={{ color: '#6e6a86', textDecoration: 'none', fontSize: '12px' }}>[DOCS]</Link>
              {authLoading ? (
                <span style={{ color: '#6e6a86', fontSize: '12px' }}>[...]</span>
              ) : user ? (
                <button
                  onClick={() => signOut()}
                  style={{
                    background: 'none',
                    border: '1px solid #6e6a86',
                    color: '#6e6a86',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '12px',
                    padding: '4px 12px',
                  }}
                >
                  [LOGOUT]
                </button>
              ) : (
                <button
                  onClick={() => { setAuthMode('signin'); setShowAuthModal(true); }}
                  style={{
                    background: 'none',
                    border: '1px solid #7eb8da',
                    color: '#7eb8da',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '12px',
                    padding: '4px 12px',
                  }}
                >
                  [LOGIN]
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="main-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>

        {/* ASCII LOGO */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', marginTop: '24px', overflow: 'hidden' }}>
          <pre className="ascii-logo" style={{
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            lineHeight: '1.1',
            margin: 0,
            color: '#7eb8da',
            textAlign: 'left',
          }}>
{`██████╗ ███████╗ ██████╗ ███████╗██╗  ██╗
██╔══██╗██╔════╝██╔════╝ ██╔════╝╚██╗██╔╝
██████╔╝█████╗  ██║  ███╗█████╗   ╚███╔╝
██╔══██╗██╔══╝  ██║   ██║██╔══╝   ██╔██╗
██║  ██║███████╗╚██████╔╝███████╗██╔╝ ██╗
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝`}
          </pre>
          <div className="gpt-badge" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '12px', gap: '0' }}>
            <span style={{ border: '1px solid #7eb8da', padding: '4px 12px', color: '#7eb8da', fontSize: '14px' }}>G</span>
            <span style={{ color: '#7eb8da', fontSize: '14px' }}>───</span>
            <span style={{ border: '1px solid #7eb8da', padding: '4px 12px', color: '#7eb8da', fontSize: '14px' }}>P</span>
            <span style={{ color: '#7eb8da', fontSize: '14px' }}>───</span>
            <span style={{ border: '1px solid #7eb8da', padding: '4px 12px', color: '#7eb8da', fontSize: '14px' }}>T</span>
          </div>
          <p style={{ color: '#6e6a86', fontSize: '12px', letterSpacing: '1px', marginTop: '12px' }}>
            ·:·:· PATTERN GENERATOR v1.0 ·:·:·
          </p>
        </div>

        {/* TAGLINE */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ color: '#e8e3e3', marginBottom: '8px' }}>
            Stop struggling with regex. Describe it in plain English.
          </p>
          <p style={{ color: '#6e6a86', fontSize: '12px' }}>
            // generate patterns from descriptions or explain existing ones
          </p>
        </div>

        {/* TAB NAVIGATION */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0' }}>
            <button
              onClick={() => { setMode('generate'); setInput(''); setOutput(''); setError(''); }}
              style={{
                background: 'none',
                border: '1px solid #7eb8da',
                borderRight: 'none',
                color: mode === 'generate' ? '#7eb8da' : '#6e6a86',
                padding: '8px 24px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '12px',
              }}
            >
              {mode === 'generate' ? '[*] GENERATE' : '    GENERATE'}
            </button>
            <button
              onClick={() => { setMode('explain'); setInput(''); setOutput(''); setError(''); }}
              style={{
                background: 'none',
                border: '1px solid #7eb8da',
                color: mode === 'explain' ? '#7eb8da' : '#6e6a86',
                padding: '8px 24px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '12px',
              }}
            >
              {mode === 'explain' ? '[*] EXPLAIN' : '    EXPLAIN'}
            </button>
          </div>
        </div>

        {/* INPUT SECTION */}
        <div style={{ marginBottom: '24px', color: '#7eb8da' }}>
          <div style={{ border: '1px solid #7eb8da', padding: '16px' }}>
            <div style={{ fontSize: '12px', marginBottom: '12px', color: '#7eb8da', display: 'flex', justifyContent: 'space-between' }}>
              <span>{mode === 'generate' ? 'DESCRIBE YOUR PATTERN' : 'PASTE REGEX TO EXPLAIN'}</span>
              {remaining !== null && (
                <span style={{ color: remaining < 3 ? '#eb6f92' : '#6e6a86' }}>
                  {remaining} remaining today
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#f2cdcd', marginRight: '8px', flexShrink: 0 }}>{'>'}</span>
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleSubmit()
                    }
                  }}
                  placeholder={mode === 'generate' ? 'match an email address...' : '^[a-z]+$...'}
                  rows={3}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    color: '#e8e3e3',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    padding: 0,
                    margin: 0,
                  }}
                />
                {!input && (
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    color: '#f2cdcd',
                    opacity: cursorVisible ? 1 : 0,
                    pointerEvents: 'none',
                  }}>█</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            style={{
              background: 'none',
              border: '1px solid #a8d8b9',
              color: '#a8d8b9',
              padding: '8px 24px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              fontSize: '12px',
              opacity: loading || !input.trim() ? 0.5 : 1,
            }}
          >
            {loading ? '[~] PROCESSING...' : `[>] ${mode === 'generate' ? 'GENERATE' : 'EXPLAIN'}`}
          </button>
          <button
            onClick={() => { setInput(''); setOutput(''); setError(''); }}
            style={{
              background: 'none',
              border: '1px solid #6e6a86',
              color: '#6e6a86',
              padding: '8px 24px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '12px',
            }}
          >
            [x] CLEAR
          </button>
        </div>

        {/* ERROR SECTION */}
        {error && (
          <div style={{ marginBottom: '32px', border: '2px solid #eb6f92', padding: '16px' }}>
            <div style={{ color: '#eb6f92', fontSize: '12px', marginBottom: '8px' }}>[!] ERROR</div>
            <p style={{ color: '#e8e3e3', margin: 0 }}>{error}</p>
            {error.includes('Upgrade') && (
              <button
                onClick={handleUpgrade}
                disabled={upgradeLoading}
                style={{
                  marginTop: '16px',
                  background: 'none',
                  border: '1px solid #c4a7e7',
                  color: '#c4a7e7',
                  padding: '8px 16px',
                  cursor: upgradeLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '12px',
                }}
              >
                {upgradeLoading ? '[~] Loading...' : '[>] Upgrade to Pro'}
              </button>
            )}
          </div>
        )}

        {/* OUTPUT SECTION */}
        {(output || loading) && !error && (
          <div style={{ marginBottom: '32px', border: '2px solid #a8d8b9' }}>
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #a8d8b9', color: '#a8d8b9', fontSize: '12px' }}>
              RESULT
            </div>
            <div style={{ padding: '16px' }}>
              {loading ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #6e6a86',
                      borderTopColor: '#c4a7e7',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }} />
                    <span style={{ color: '#ffe9b0' }}>Generating pattern...</span>
                  </div>
                  <div style={{
                    height: '4px',
                    backgroundColor: '#252542',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: '40%',
                      background: 'linear-gradient(90deg, #7eb8da, #c4a7e7, #a8d8b9)',
                      borderRadius: '2px',
                      animation: 'progress 1.5s ease-in-out infinite',
                    }} />
                  </div>
                  <style>{`
                    @keyframes spin {
                      to { transform: rotate(360deg); }
                    }
                    @keyframes progress {
                      0% { transform: translateX(-100%); }
                      50% { transform: translateX(150%); }
                      100% { transform: translateX(-100%); }
                    }
                  `}</style>
                </div>
              ) : (
                <div>
                  <code style={{
                    display: 'block',
                    padding: '12px',
                    backgroundColor: '#191e22',
                    color: '#e8e3e3',
                    fontSize: '13px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    marginBottom: '16px',
                  }}>
                    {output}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f2cdcd',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '12px',
                      padding: 0,
                    }}
                  >
                    {copied ? '[/] COPIED' : '[:] COPY'}
                  </button>
                </div>
              )}
            </div>
            <div style={{ padding: '8px 16px', borderTop: '1px solid #a8d8b9', color: '#a8d8b9', fontSize: '12px' }}>
              STATUS: {loading ? '(~) PROCESSING' : '(o) COMPLETE'}
            </div>
          </div>
        )}

        {/* EXAMPLES */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ color: '#6e6a86', fontSize: '12px', marginBottom: '16px' }}>// TRY THESE EXAMPLES</p>
          <div className="grid-2-col">
            {examples.map((example, i) => (
              <button
                key={i}
                onClick={() => setInput(example)}
                style={{
                  background: 'none',
                  border: '1px solid #7eb8da',
                  color: '#7eb8da',
                  padding: '12px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '12px',
                  textAlign: 'left',
                }}
              >
                {'>>>'} {example.length > 30 ? example.slice(0, 30) + '...' : example}
              </button>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <div id="features" style={{ marginBottom: '32px' }}>
          <p style={{ color: '#6e6a86', fontSize: '12px', marginBottom: '16px' }}>// FEATURES</p>
          <div className="grid-3-col">
            <div style={{ border: '1px solid #7eb8da', padding: '16px' }}>
              <div style={{ color: '#7eb8da', marginBottom: '12px' }}>[{'>'}] GENERATE</div>
              <p style={{ color: '#a8b2c3', fontSize: '12px', margin: 0, lineHeight: '1.5' }}>
                Describe what you want to match in plain English. Get a working regex instantly.
              </p>
            </div>
            <div style={{ border: '1px solid #c4a7e7', padding: '16px' }}>
              <div style={{ color: '#c4a7e7', marginBottom: '12px' }}>[?] EXPLAIN</div>
              <p style={{ color: '#a8b2c3', fontSize: '12px', margin: 0, lineHeight: '1.5' }}>
                Paste any cryptic regex pattern. Get a human-readable explanation.
              </p>
            </div>
            <div style={{ border: '1px solid #a8d8b9', padding: '16px' }}>
              <div style={{ color: '#a8d8b9', marginBottom: '12px' }}>[:] COPY</div>
              <p style={{ color: '#a8b2c3', fontSize: '12px', margin: 0, lineHeight: '1.5' }}>
                One-click copy to clipboard. Ready to paste into your code editor.
              </p>
            </div>
          </div>
        </div>

        {/* PRICING */}
        <div id="pricing" style={{ marginBottom: '32px' }}>
          <p style={{ color: '#6e6a86', fontSize: '12px', marginBottom: '16px' }}>// PRICING</p>
          <div className="grid-pricing">
            {/* Free Tier */}
            <div style={{ border: '1px solid #6e6a86', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ border: '1px solid #6e6a86', padding: '8px 12px', color: '#a8b2c3' }}>F</div>
                <span style={{ color: '#a8b2c3' }}>FREE</span>
              </div>
              <div style={{ color: '#e8e3e3', fontSize: '18px', marginBottom: '16px' }}>$0/forever</div>
              <div style={{ color: '#a8b2c3', fontSize: '12px', lineHeight: '2' }}>
                <div>[/] 10 generations/day</div>
                <div>[/] 20 explanations/day</div>
                <div>[/] Basic patterns</div>
                <div>[x] History & favorites</div>
                <div>[x] Priority processing</div>
              </div>
              {plan === 'free' && (
                <div style={{ marginTop: '16px', border: '1px solid #6e6a86', padding: '8px', textAlign: 'center', color: '#6e6a86', fontSize: '12px' }}>
                  CURRENT PLAN
                </div>
              )}
            </div>

            {/* Pro Tier */}
            <div style={{ border: '2px solid #c4a7e7', padding: '24px' }}>
              <div style={{ color: '#c4a7e7', fontSize: '12px', textAlign: 'center', marginBottom: '16px' }}>
                * * * RECOMMENDED * * *
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ border: '2px solid #c4a7e7', padding: '8px 12px', color: '#c4a7e7' }}>P</div>
                <span style={{ color: '#c4a7e7' }}>PRO</span>
              </div>
              <div style={{ color: '#e8e3e3', fontSize: '18px', marginBottom: '16px' }}>$6/month</div>
              <div style={{ color: '#a8b2c3', fontSize: '12px', lineHeight: '2' }}>
                <div>[/] Unlimited generations</div>
                <div>[/] Unlimited explanations</div>
                <div>[/] Complex patterns</div>
                <div>[/] History & favorites</div>
                <div>[/] Priority processing</div>
              </div>
              {plan === 'pro' ? (
                <button
                  onClick={handleManageBilling}
                  style={{
                    marginTop: '16px',
                    width: '100%',
                    border: '1px solid #a8d8b9',
                    background: 'none',
                    padding: '8px',
                    textAlign: 'center',
                    color: '#a8d8b9',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  [/] MANAGE BILLING
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={upgradeLoading}
                  style={{
                    marginTop: '16px',
                    width: '100%',
                    border: '2px solid #c4a7e7',
                    background: 'none',
                    padding: '8px',
                    textAlign: 'center',
                    color: '#c4a7e7',
                    fontSize: '12px',
                    cursor: upgradeLoading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    opacity: upgradeLoading ? 0.5 : 1,
                  }}
                >
                  {upgradeLoading ? '[~] Loading...' : '[>] UPGRADE NOW'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* USE CASES */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ color: '#6e6a86', fontSize: '12px', marginBottom: '16px' }}>// COMMON USE CASES</p>
          <div className="grid-2-col">
            <div style={{ border: '1px solid #6e6a86', padding: '16px' }}>
              <div style={{ color: '#7eb8da', marginBottom: '8px' }}>[1] VALIDATION</div>
              <p style={{ color: '#a8b2c3', fontSize: '12px', margin: 0 }}>Emails, URLs, phone numbers, passwords, credit cards</p>
            </div>
            <div style={{ border: '1px solid #6e6a86', padding: '16px' }}>
              <div style={{ color: '#7eb8da', marginBottom: '8px' }}>[2] EXTRACTION</div>
              <p style={{ color: '#a8b2c3', fontSize: '12px', margin: 0 }}>Pull data from logs, parse HTML, scrape text patterns</p>
            </div>
            <div style={{ border: '1px solid #6e6a86', padding: '16px' }}>
              <div style={{ color: '#7eb8da', marginBottom: '8px' }}>[3] SEARCH/REPLACE</div>
              <p style={{ color: '#a8b2c3', fontSize: '12px', margin: 0 }}>Refactor code, clean data, bulk text transformations</p>
            </div>
            <div style={{ border: '1px solid #6e6a86', padding: '16px' }}>
              <div style={{ color: '#7eb8da', marginBottom: '8px' }}>[4] LEARNING</div>
              <p style={{ color: '#a8b2c3', fontSize: '12px', margin: 0 }}>Understand legacy patterns, debug failing matches</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ color: '#6e6a86', fontSize: '12px', marginBottom: '16px' }}>// FAQ</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <details style={{ color: '#a8b2c3' }}>
              <summary style={{ color: '#7eb8da', cursor: 'pointer', padding: '8px 0' }}>
                [?] How accurate are the generated patterns?
              </summary>
              <p style={{ margin: '8px 0 8px 24px', fontSize: '12px', lineHeight: '1.6' }}>
                Our AI generates patterns that work for common use cases. Always test with your specific data before production use.
              </p>
            </details>
            <details style={{ color: '#a8b2c3' }}>
              <summary style={{ color: '#7eb8da', cursor: 'pointer', padding: '8px 0' }}>
                [?] What regex flavors are supported?
              </summary>
              <p style={{ margin: '8px 0 8px 24px', fontSize: '12px', lineHeight: '1.6' }}>
                We generate patterns compatible with JavaScript/PCRE. Most patterns work across Python, Java, Go, and PHP.
              </p>
            </details>
            <details style={{ color: '#a8b2c3' }}>
              <summary style={{ color: '#7eb8da', cursor: 'pointer', padding: '8px 0' }}>
                [?] Is my data stored or used for training?
              </summary>
              <p style={{ margin: '8px 0 8px 24px', fontSize: '12px', lineHeight: '1.6' }}>
                No. We don't store your queries or use them for training. Your data is processed and immediately discarded.
              </p>
            </details>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #6e6a86', marginTop: '64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px', textAlign: 'center' }}>
          <div style={{ color: '#6e6a86', fontSize: '12px' }}>
            <p style={{ margin: '0 0 8px 0' }}>BUILT WITH {'<'}3 IN THE TERMINAL</p>
            <p style={{ margin: '0 0 16px 0' }}>(c) 2025 REGEXGPT</p>
            <div className="footer-links">
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>[HOME]</Link>
              <Link href="/docs" style={{ color: 'inherit', textDecoration: 'none' }}>[DOCS]</Link>
              <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>[PRICING]</a>
              <a href="https://github.com/skygkruger" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>[GITHUB]</a>
              <a href="https://x.com/run_veridian" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>[X]</a>
              <a href="mailto:sky@veridian.run" style={{ color: 'inherit', textDecoration: 'none' }}>[CONTACT]</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
