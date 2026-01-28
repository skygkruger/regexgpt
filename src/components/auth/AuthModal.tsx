'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'signin' | 'signup'
}

export function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { signInWithGoogle, signInWithGithub, signInWithEmail, signUpWithEmail } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'signin') {
        const result = await signInWithEmail(email, password)
        if (result.error) {
          setError(result.error)
        } else {
          onClose()
        }
      } else {
        const result = await signUpWithEmail(email, password)
        if (result.error) {
          setError(result.error)
        } else {
          setMessage('Check your email for a confirmation link!')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError('')
    try {
      if (provider === 'google') {
        await signInWithGoogle()
      } else {
        await signInWithGithub()
      }
    } catch (err) {
      setError('Failed to sign in')
    }
  }

  const colors = {
    bg: '#14171a',
    bgLight: '#252542',
    text: '#e8e3e3',
    muted: '#6e6a86',
    cyan: '#7eb8da',
    mint: '#a8d8b9',
    coral: '#eb6f92',
    purple: '#c4a7e7',
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: colors.bg,
          border: `1px solid ${colors.cyan}`,
          padding: '32px',
          maxWidth: '400px',
          width: '90%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: colors.cyan, margin: 0, fontSize: '16px' }}>
            {mode === 'signin' ? '[>] SIGN IN' : '[+] SIGN UP'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: colors.muted,
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            [x]
          </button>
        </div>

        {/* OAuth Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => handleOAuth('github')}
            style={{
              background: 'none',
              border: `1px solid ${colors.muted}`,
              color: colors.text,
              padding: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            [G] Continue with GitHub
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: colors.muted }} />
          <span style={{ color: colors.muted, fontSize: '12px' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: colors.muted }} />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: colors.muted, fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                background: colors.bgLight,
                border: `1px solid ${colors.muted}`,
                color: colors.text,
                padding: '12px',
                fontFamily: 'inherit',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: colors.muted, fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                background: colors.bgLight,
                border: `1px solid ${colors.muted}`,
                color: colors.text,
                padding: '12px',
                fontFamily: 'inherit',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              color: colors.coral,
              fontSize: '12px',
              marginBottom: '16px',
              padding: '8px',
              border: `1px solid ${colors.coral}`,
            }}>
              [!] {error}
            </div>
          )}

          {message && (
            <div style={{
              color: colors.mint,
              fontSize: '12px',
              marginBottom: '16px',
              padding: '8px',
              border: `1px solid ${colors.mint}`,
            }}>
              [/] {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'none',
              border: `1px solid ${colors.cyan}`,
              color: colors.cyan,
              padding: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              fontSize: '13px',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? '[~] PROCESSING...' : mode === 'signin' ? '[>] SIGN IN' : '[+] CREATE ACCOUNT'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            style={{
              background: 'none',
              border: 'none',
              color: colors.muted,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '12px',
            }}
          >
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
