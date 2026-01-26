'use client'

import { useState } from 'react'
import Link from 'next/link'

type SectionId = 'getting-started' | 'features' | 'examples' | 'api' | 'faq'

interface Section {
  id: SectionId
  label: string
}

const RegexGPTDocs = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('getting-started')

  const colors = {
    bg: '#1a1a2e',
    bgLight: '#252542',
    text: '#e8e3e3',
    muted: '#6e6a86',
    cyan: '#7eb8da',
    mint: '#a8d8b9',
    coral: '#eb6f92',
    cream: '#ffe9b0',
  }

  const sections: Section[] = [
    { id: 'getting-started', label: '[>] Getting Started' },
    { id: 'features', label: '[+] Features' },
    { id: 'examples', label: '[#] Examples' },
    { id: 'api', label: '[/] API Reference' },
    { id: 'faq', label: '[?] FAQ' },
  ]

  const CodeBlock = ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div style={{
      background: colors.bg,
      border: `1px solid ${colors.muted}`,
      marginBottom: '16px',
    }}>
      {title && (
        <div style={{
          padding: '8px 12px',
          borderBottom: `1px solid ${colors.muted}`,
          color: colors.muted,
          fontSize: '12px',
        }}>
          {title}
        </div>
      )}
      <pre style={{
        margin: 0,
        padding: '12px',
        color: colors.cyan,
        fontSize: '13px',
        lineHeight: '1.5',
        overflow: 'auto',
      }}>
        {children}
      </pre>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div>
            <h2 style={{ color: colors.cyan, marginTop: 0 }}>┌─ Getting Started ─┐</h2>

            <p style={{ color: colors.text, lineHeight: '1.7' }}>
              RegexGPT transforms natural language descriptions into working regular expressions.
              No more memorizing cryptic syntax or debugging escaped characters.
            </p>

            <h3 style={{ color: colors.mint }}>How It Works</h3>

            <div style={{
              background: colors.bgLight,
              border: `1px solid ${colors.muted}`,
              padding: '16px',
              marginBottom: '16px',
            }}>
              <div style={{ color: colors.text, marginBottom: '12px' }}>
                <span style={{ color: colors.cyan }}>[1]</span> Describe what you want to match in plain English
              </div>
              <div style={{ color: colors.text, marginBottom: '12px' }}>
                <span style={{ color: colors.cyan }}>[2]</span> RegexGPT generates the regex pattern
              </div>
              <div style={{ color: colors.text, marginBottom: '12px' }}>
                <span style={{ color: colors.cyan }}>[3]</span> Test against your sample text instantly
              </div>
              <div style={{ color: colors.text }}>
                <span style={{ color: colors.cyan }}>[4]</span> Copy and use in your code
              </div>
            </div>

            <h3 style={{ color: colors.mint }}>Quick Example</h3>

            <CodeBlock title="input.txt">
{`> "Match all email addresses"

Generated Pattern:
[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}

Flags: g (global)`}
            </CodeBlock>

            <h3 style={{ color: colors.mint }}>Supported Languages</h3>

            <p style={{ color: colors.text, lineHeight: '1.7' }}>
              RegexGPT generates patterns compatible with:
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '16px',
            }}>
              {['JavaScript', 'Python', 'Java', 'Go', 'Ruby', 'PHP', 'Rust', 'C#', '.NET'].map(lang => (
                <div key={lang} style={{
                  background: colors.bgLight,
                  border: `1px solid ${colors.muted}`,
                  padding: '8px 12px',
                  color: colors.text,
                  fontSize: '13px',
                }}>
                  [+] {lang}
                </div>
              ))}
            </div>
          </div>
        )

      case 'features':
        return (
          <div>
            <h2 style={{ color: colors.cyan, marginTop: 0 }}>┌─ Features ─┐</h2>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[&gt;] Natural Language Input</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Describe patterns in plain English. No regex knowledge required.
                The AI understands context and generates accurate patterns.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[&gt;] Real-Time Testing</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Paste your sample text and see matches highlighted instantly.
                Verify the pattern works before copying to your codebase.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[&gt;] Pattern Explanation</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Every generated regex comes with a breakdown explaining what each
                part does. Learn regex while you use it.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[&gt;] Flag Suggestions</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Automatic recommendations for regex flags based on your use case:
              </p>
              <CodeBlock>
{`g  - Global (find all matches)
i  - Case insensitive
m  - Multiline mode
s  - Dot matches newlines
u  - Unicode support`}
              </CodeBlock>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint, display: 'flex', alignItems: 'center', gap: '8px' }}>
                [&gt;] History
                <span style={{
                  color: colors.bgLight,
                  background: colors.cyan,
                  padding: '2px 8px',
                  fontSize: '11px',
                }}>PRO</span>
              </h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Access your previously generated patterns. Search, filter, and
                reuse patterns across projects.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint, display: 'flex', alignItems: 'center', gap: '8px' }}>
                [&gt;] Collections
                <span style={{
                  color: colors.bgLight,
                  background: colors.cyan,
                  padding: '2px 8px',
                  fontSize: '11px',
                }}>PRO</span>
              </h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Organize patterns into collections. Share with your team or keep
                private for personal reference.
              </p>
            </div>
          </div>
        )

      case 'examples':
        return (
          <div>
            <h2 style={{ color: colors.cyan, marginTop: 0 }}>┌─ Examples ─┐</h2>

            <p style={{ color: colors.muted, marginBottom: '24px' }}>
              Common patterns and how to describe them
            </p>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>Email Validation</h3>
              <CodeBlock title="prompt">
{`"Match valid email addresses"`}
              </CodeBlock>
              <CodeBlock title="output">
{`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`}
              </CodeBlock>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>Phone Numbers (US)</h3>
              <CodeBlock title="prompt">
{`"Match US phone numbers in any format"`}
              </CodeBlock>
              <CodeBlock title="output">
{`^(\\+1[-.]?)?(\\(?\\d{3}\\)?[-.]?)?\\d{3}[-.]?\\d{4}$

Matches:
  +1-555-123-4567
  (555) 123-4567
  555.123.4567
  5551234567`}
              </CodeBlock>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>URLs</h3>
              <CodeBlock title="prompt">
{`"Match http and https URLs"`}
              </CodeBlock>
              <CodeBlock title="output">
{`https?:\\/\\/[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&'()*+,;=]*`}
              </CodeBlock>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>Date Formats</h3>
              <CodeBlock title="prompt">
{`"Match dates in YYYY-MM-DD format"`}
              </CodeBlock>
              <CodeBlock title="output">
{`^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$`}
              </CodeBlock>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>Password Strength</h3>
              <CodeBlock title="prompt">
{`"Match passwords with at least 8 characters,
one uppercase, one lowercase, one number,
one special character"`}
              </CodeBlock>
              <CodeBlock title="output">
{`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$`}
              </CodeBlock>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>IPv4 Addresses</h3>
              <CodeBlock title="prompt">
{`"Match valid IPv4 addresses"`}
              </CodeBlock>
              <CodeBlock title="output">
{`^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$`}
              </CodeBlock>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>Credit Card Numbers</h3>
              <CodeBlock title="prompt">
{`"Match credit card numbers (Visa, Mastercard, Amex)"`}
              </CodeBlock>
              <CodeBlock title="output">
{`^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$

4xxx xxxx xxxx xxxx     - Visa
5[1-5]xx xxxx xxxx xxxx - Mastercard
3[47]x xxxx xxxx xxx    - Amex`}
              </CodeBlock>
            </div>
          </div>
        )

      case 'api':
        return (
          <div>
            <h2 style={{ color: colors.cyan, marginTop: 0 }}>┌─ API Reference ─┐</h2>

            <div style={{
              background: colors.bgLight,
              border: `1px solid ${colors.cyan}`,
              padding: '12px 16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{
                color: colors.bgLight,
                background: colors.cyan,
                padding: '2px 8px',
                fontSize: '11px',
              }}>PRO</span>
              <span style={{ color: colors.text }}>
                API access requires a Pro subscription
              </span>
            </div>

            <h3 style={{ color: colors.mint }}>Authentication</h3>
            <p style={{ color: colors.text, lineHeight: '1.7' }}>
              Include your API key in the request header:
            </p>
            <CodeBlock title="header">
{`Authorization: Bearer YOUR_API_KEY`}
            </CodeBlock>

            <h3 style={{ color: colors.mint }}>Generate Pattern</h3>
            <CodeBlock title="POST /api/v1/generate">
{`Request:
{
  "prompt": "Match all email addresses",
  "language": "javascript",  // optional
  "flags": ["g", "i"]        // optional
}

Response:
{
  "success": true,
  "pattern": "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}",
  "flags": "gi",
  "explanation": {
    "summary": "Matches standard email format",
    "parts": [
      {"part": "[a-zA-Z0-9._%+-]+", "desc": "Local part"},
      {"part": "@", "desc": "At symbol"},
      {"part": "[a-zA-Z0-9.-]+", "desc": "Domain"},
      {"part": "\\\\.", "desc": "Dot separator"},
      {"part": "[a-zA-Z]{2,}", "desc": "TLD (2+ chars)"}
    ]
  }
}`}
            </CodeBlock>

            <h3 style={{ color: colors.mint }}>Test Pattern</h3>
            <CodeBlock title="POST /api/v1/test">
{`Request:
{
  "pattern": "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}",
  "flags": "g",
  "text": "Contact us at hello@example.com or support@test.org"
}

Response:
{
  "success": true,
  "matches": [
    {"match": "hello@example.com", "index": 14, "length": 17},
    {"match": "support@test.org", "index": 35, "length": 16}
  ],
  "count": 2
}`}
            </CodeBlock>

            <h3 style={{ color: colors.mint }}>Rate Limits</h3>
            <div style={{
              background: colors.bgLight,
              border: `1px solid ${colors.muted}`,
              padding: '16px',
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                color: colors.text,
              }}>
                <div>Free tier:</div>
                <div style={{ color: colors.muted }}>10 requests/day</div>
                <div>Pro tier:</div>
                <div style={{ color: colors.cyan }}>1,000 requests/day</div>
                <div>Team tier:</div>
                <div style={{ color: colors.mint }}>10,000 requests/day</div>
              </div>
            </div>
          </div>
        )

      case 'faq':
        return (
          <div>
            <h2 style={{ color: colors.cyan, marginTop: 0 }}>┌─ FAQ ─┐</h2>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[?] How accurate are the generated patterns?</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                RegexGPT generates highly accurate patterns for common use cases.
                However, always test the pattern against your actual data before
                using in production. Edge cases may require manual refinement.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[?] Can I use generated patterns commercially?</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Yes. All patterns generated through RegexGPT are yours to use
                however you like, including in commercial projects.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[?] What languages are supported?</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                RegexGPT generates patterns compatible with JavaScript, Python,
                Java, Go, Ruby, PHP, Rust, C#, and .NET. Select your target
                language for syntax-specific escaping.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[?] Why is my pattern not matching?</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Common issues include:
              </p>
              <CodeBlock>
{`[1] Missing flags (try adding 'g' for global)
[2] Escape characters (backslashes may need doubling)
[3] Anchors (^ and $ for exact matches)
[4] Whitespace (\\s vs literal spaces)`}
              </CodeBlock>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[?] How do I cancel my subscription?</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Go to Settings {'->'} Billing {'->'} Cancel Subscription. Your Pro
                features remain active until the end of your billing period.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[?] Is my data private?</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Yes. We do not store your test text or generated patterns unless
                you explicitly save them to your history (Pro feature). API
                requests are logged for rate limiting only.
              </p>
            </div>

            <div style={{
              background: colors.bgLight,
              border: `1px solid ${colors.muted}`,
              padding: '16px',
              marginTop: '32px',
            }}>
              <div style={{ color: colors.muted, marginBottom: '8px' }}>
                Still have questions?
              </div>
              <div style={{ color: colors.text }}>
                Contact us at{' '}
                <span style={{ color: colors.cyan }}>support@regexgpt.dev</span>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
      color: colors.text,
    }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${colors.muted}`,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: colors.cyan, fontSize: '18px' }}>RegexGPT</span>
          <span style={{ color: colors.muted }}>|</span>
          <span style={{ color: colors.muted }}>Documentation</span>
        </div>
        <nav style={{ display: 'flex', gap: '24px' }}>
          <Link href="/" style={{ color: colors.muted, textDecoration: 'none' }}>[~] Home</Link>
          <Link href="/docs" style={{ color: colors.cyan, textDecoration: 'none' }}>[?] Docs</Link>
          <Link href="/#pricing" style={{ color: colors.muted, textDecoration: 'none' }}>[$] Pricing</Link>
        </nav>
      </header>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{
          width: '260px',
          flexShrink: 0,
          borderRight: `1px solid ${colors.muted}`,
          padding: '24px 28px',
          minHeight: 'calc(100vh - 60px)',
        }}>
          <div style={{
            color: colors.cyan,
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}>
            REGEXGPT
          </div>
          <div style={{
            color: colors.muted,
            fontSize: '11px',
            letterSpacing: '1px',
            marginBottom: '32px',
          }}>
            ·:·:· v1.0 ·:·:·
          </div>

          <div>
            <div style={{ color: colors.muted, fontSize: '11px', marginBottom: '16px', letterSpacing: '1px' }}>
              DOCUMENTATION
            </div>

            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '4px',
                  background: activeSection === section.id ? colors.bgLight : 'transparent',
                  border: activeSection === section.id ? `1px solid ${colors.cyan}` : '1px solid transparent',
                  color: activeSection === section.id ? colors.cyan : colors.text,
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                }}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div style={{
            marginTop: '32px',
            padding: '16px',
            background: colors.bgLight,
            border: `1px solid ${colors.muted}`,
          }}>
            <div style={{ color: colors.mint, marginBottom: '8px', fontSize: '12px' }}>
              [i] Pro Tip
            </div>
            <div style={{ color: colors.muted, fontSize: '11px', lineHeight: '1.5' }}>
              Be specific in your descriptions. &quot;Match emails&quot; works, but &quot;Match
              company emails ending in .com or .org&quot; gives better results.
            </div>
          </div>
        </aside>

        {/* Main Content Container - Centers content in remaining space */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 60px)',
          overflow: 'auto',
        }}>
          <main style={{
            width: '100%',
            maxWidth: '700px',
            padding: '32px 48px',
          }}>
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${colors.muted}`,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        color: colors.muted,
        fontSize: '12px',
      }}>
        <span>RegexGPT v1.0.0</span>
        <span>Built with [:] by developers, for developers</span>
      </footer>
    </div>
  )
}

export default RegexGPTDocs
