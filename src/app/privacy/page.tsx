'use client'

import Link from 'next/link'

export default function PrivacyPage() {
  const colors = {
    bg: '#14171a',
    text: '#e8e3e3',
    muted: '#6e6a86',
    cyan: '#7eb8da',
    mint: '#a8d8b9',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
      color: colors.text,
    }}>
      {/* Header */}
      <header style={{ borderBottom: `1px solid ${colors.muted}` }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Link href="/" style={{ color: colors.cyan, fontSize: '18px', textDecoration: 'none' }}>
            RegexGPT
          </Link>
          <nav style={{ display: 'flex', gap: '16px' }}>
            <Link href="/" style={{ color: colors.muted, textDecoration: 'none' }}>[Home]</Link>
            <Link href="/terms" style={{ color: colors.muted, textDecoration: 'none' }}>[Terms]</Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ color: colors.cyan, marginTop: 0, marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ color: colors.muted, marginBottom: '32px', fontSize: '14px' }}>
          Last updated: January 2026
        </p>

        {/* Privacy Commitment Banner */}
        <div style={{
          padding: '16px',
          border: `1px solid ${colors.mint}`,
          marginBottom: '32px',
          background: 'rgba(168, 216, 185, 0.05)',
        }}>
          <p style={{ color: colors.mint, margin: 0, fontSize: '14px' }}>
            [/] We do not sell your data. Ever.
          </p>
        </div>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: colors.cyan, fontSize: '16px' }}>1. Information We Collect</h2>
          <p style={{ lineHeight: '1.7', color: colors.text }}>
            <strong style={{ color: colors.cyan }}>Account Information:</strong> When you create an account,
            we collect your email address and authentication credentials. If you sign in with GitHub or Google,
            we receive basic profile information from those services.
          </p>
          <p style={{ lineHeight: '1.7', color: colors.text }}>
            <strong style={{ color: colors.cyan }}>Usage Data:</strong> We track the number of generations and
            explanations you perform daily for rate limiting purposes. For Pro users, we store your generated
            patterns to provide history functionality.
          </p>
          <p style={{ lineHeight: '1.7', color: colors.text }}>
            <strong style={{ color: colors.cyan }}>Payment Information:</strong> Payment processing is handled
            by Stripe. We do not store your credit card details. We only store your Stripe customer ID to
            manage your subscription.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: colors.cyan, fontSize: '16px' }}>2. How We Use Your Information</h2>
          <ul style={{ lineHeight: '1.7', color: colors.text, paddingLeft: '24px' }}>
            <li>To provide and maintain the Service</li>
            <li>To enforce rate limits based on your subscription tier</li>
            <li>To save your pattern history (Pro users only)</li>
            <li>To process payments and manage subscriptions</li>
            <li>To communicate with you about your account</li>
            <li>To improve the Service based on aggregate usage patterns</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: colors.cyan, fontSize: '16px' }}>3. What We Do NOT Do</h2>
          <div style={{
            padding: '16px',
            border: `1px solid ${colors.muted}`,
            marginBottom: '16px',
          }}>
            <ul style={{ lineHeight: '2', color: colors.text, paddingLeft: '24px', margin: 0 }}>
              <li>[x] We do NOT sell your personal information</li>
              <li>[x] We do NOT use your data for advertising</li>
              <li>[x] We do NOT share your data with third-party marketers</li>
              <li>[x] We do NOT train AI models on your queries or patterns</li>
              <li>[x] We do NOT track you across other websites</li>
              <li>[x] We do NOT use dark patterns to manipulate your choices</li>
            </ul>
          </div>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: colors.cyan, fontSize: '16px' }}>4. Data Retention</h2>
          <p style={{ lineHeight: '1.7', color: colors.text }}>
            <strong style={{ color: colors.cyan }}>Free users:</strong> We retain your account information and
            daily usage counts. Usage counts reset daily.
          </p>
          <p style={{ lineHeight: '1.7', color: colors.text }}>
            <strong style={{ color: colors.cyan }}>Pro users:</strong> Your pattern history is retained for as
            long as you maintain an active subscription. You can request deletion of your history at any time.
          </p>
          <p style={{ lineHeight: '1.7', color: colors.text }}>
            <strong style={{ color: colors.cyan }}>Account deletion:</strong> When you delete your account, all
            your data is permanently removed within 30 days.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: colors.cyan, fontSize: '16px' }}>5. Data Security</h2>
          <p style={{ lineHeight: '1.7', color: colors.text }}>
            We use industry-standard security measures to protect your data:
          </p>
          <ul style={{ lineHeight: '1.7', color: colors.text, paddingLeft: '24px' }}>
            <li>All data is transmitted over HTTPS</li>
            <li>Passwords are hashed using secure algorithms</li>
            <li>Database access is restricted and monitored</li>
            <li>We use Supabase&apos;s built-in Row Level Security</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: colors.cyan, fontSize: '16px' }}>6. Third-Party Services</h2>
          <p style={{ lineHeight: '1.7', color: colors.text }}>
            We use the following third-party services:
          </p>
          <ul style={{ lineHeight: '1.7', color: colors.text, paddingLeft: '24px' }}>
            <li><strong>Supabase:</strong> Database and authentication</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>Anthropic:</strong> AI model for regex generation/explanation</li>
            <li><strong>Vercel:</strong> Hosting</li>
          </ul>
          <p style={{ lineHeight: '1.7', color: colors.text }}>
            Each service has its own privacy policy governing their handling of your data.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: colors.cyan, fontSize: '16px' }}>7. Your Rights</h2>
          <p style={{ lineHeight: '1.7', color: colors.text }}>
            You have the right to:
          </p>
          <ul style={{ lineHeight: '1.7', color: colors.text, paddingLeft: '24px' }}>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and data</li>
            <li>Export your pattern history (Pro users)</li>
            <li>Cancel your subscription at any time</li>
          </ul>
          <p style={{ lineHeight: '1.7', color: colors.text }}>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:sky@veridian.run" style={{ color: colors.cyan }}>sky@veridian.run</a>.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: colors.cyan, fontSize: '16px' }}>8. Cookies</h2>
          <p style={{ lineHeight: '1.7', color: colors.text }}>
            We use essential cookies only for authentication and session management. We do not use
            tracking cookies or third-party analytics that track you across websites.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: colors.cyan, fontSize: '16px' }}>9. Changes to This Policy</h2>
          <p style={{ lineHeight: '1.7', color: colors.text }}>
            We may update this Privacy Policy from time to time. We will notify you of significant
            changes by posting a notice on the Service or sending you an email.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: colors.cyan, fontSize: '16px' }}>10. Contact</h2>
          <p style={{ lineHeight: '1.7', color: colors.text }}>
            For questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:sky@veridian.run" style={{ color: colors.cyan }}>sky@veridian.run</a>.
          </p>
        </section>

        {/* VERIDIAN Ethics Notice */}
        <div style={{
          marginTop: '48px',
          padding: '24px',
          border: `1px solid ${colors.muted}`,
          textAlign: 'center',
        }}>
          <p style={{ color: colors.cyan, margin: '0 0 8px 0' }}>
            VERIDIAN TOOLS PRIVACY COMMITMENT
          </p>
          <p style={{ color: colors.muted, margin: 0, fontSize: '13px', lineHeight: '1.6' }}>
            We believe in building technology that respects users. Your data belongs to you, not to advertisers.
            We collect only what we need to provide the service, nothing more. This is a core principle of
            VERIDIAN TOOLS, not just a policy.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${colors.muted}`,
        padding: '16px 24px',
        textAlign: 'center',
        color: colors.muted,
        fontSize: '12px',
      }}>
        (c) 2026 RegexGPT · A VERIDIAN TOOLS Product
      </footer>
    </div>
  )
}
