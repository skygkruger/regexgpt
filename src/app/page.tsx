'use client'

import { useState } from 'react'
import { Sparkles, Code, ArrowRight, Copy, Check, Zap, Share2, BookOpen } from 'lucide-react'

type Mode = 'generate' | 'explain'

export default function Home() {
  const [mode, setMode] = useState<Mode>('generate')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

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
        throw new Error(data.error || 'Something went wrong')
      }

      setOutput(data.result)
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

  const examples = mode === 'generate'
    ? [
      'Match any email address',
      'Match a phone number like (123) 456-7890',
      'Match a URL starting with http or https',
      'Match a date in MM/DD/YYYY format',
      'Match a hex color code like #FF5733',
    ]
    : [
      '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      '\\d{3}-\\d{3}-\\d{4}',
      '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b',
      '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
    ]

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-black" />
            </div>
            <span className="font-semibold text-xl">RegexGPT</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#examples" className="text-sm text-gray-400 hover:text-white transition">Examples</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition">Pricing</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm mb-6">
          <Sparkles className="w-4 h-4" />
          AI-Powered Regex Made Simple
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Stop Struggling with Regex
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Generate regex from plain English or get instant explanations for any pattern.
          No more cryptic documentation.
        </p>
      </section>

      {/* Mode Toggle */}
      <section className="max-w-3xl mx-auto px-4 mb-8">
        <div className="flex bg-white/5 rounded-xl p-1 w-fit mx-auto">
          <button
            onClick={() => { setMode('generate'); setInput(''); setOutput(''); }}
            className={`px-6 py-3 rounded-lg font-medium transition ${mode === 'generate'
              ? 'bg-green-500 text-black'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Generate Regex
            </span>
          </button>
          <button
            onClick={() => { setMode('explain'); setInput(''); setOutput(''); }}
            className={`px-6 py-3 rounded-lg font-medium transition ${mode === 'explain'
              ? 'bg-green-500 text-black'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Explain Regex
            </span>
          </button>
        </div>
      </section>

      {/* Main Tool */}
      <section className="max-w-3xl mx-auto px-4 mb-12">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              {mode === 'generate' ? 'Describe what you want to match' : 'Paste your regex pattern'}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'generate'
                ? 'e.g., Match an email address...'
                : 'e.g., ^[a-zA-Z0-9]+$'
              }
              className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 resize-none font-mono"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmit()
                }
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-500/50 disabled:cursor-not-allowed text-black font-semibold py-4 rounded-xl transition flex items-center justify-center gap-2 glow-green"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {mode === 'generate' ? 'Generate Regex' : 'Explain Regex'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              {error}
            </div>
          )}

          {output && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-400">
                  {mode === 'generate' ? 'Your Regex' : 'Explanation'}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-green-400 whitespace-pre-wrap">
                {output}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="max-w-3xl mx-auto px-4 mb-16">
        <h2 className="text-lg font-medium text-gray-400 mb-4">Try an example:</h2>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => setInput(example)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition"
            >
              {example.length > 40 ? example.slice(0, 40) + '...' : example}
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Generation</h3>
            <p className="text-gray-400">
              Describe what you need in plain English. Get a working regex in seconds.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Clear Explanations</h3>
            <p className="text-gray-400">
              Paste any regex and get a human-readable breakdown of what it does.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
              <Share2 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Share & Save</h3>
            <p className="text-gray-400">
              Share regex explanations with your team. Build a library of patterns.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-4xl mx-auto px-4 mb-20">
        <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
        <p className="text-gray-400 text-center mb-12">Free for most users. Upgrade for unlimited access.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <p className="text-gray-400 mb-4">Perfect for occasional use</p>
            <div className="text-4xl font-bold mb-6">$0</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                10 generations per day
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                10 explanations per day
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Basic patterns
              </li>
            </ul>
            <button className="w-full py-3 border border-white/20 rounded-xl font-medium hover:bg-white/5 transition">
              Get Started
            </button>
          </div>

          <div className="bg-gradient-to-b from-green-500/10 to-transparent border border-green-500/30 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
              POPULAR
            </div>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-gray-400 mb-4">For power users and teams</p>
            <div className="text-4xl font-bold mb-6">$6<span className="text-lg text-gray-400 font-normal">/mo</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Unlimited generations
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Unlimited explanations
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                API access
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Priority support
              </li>
            </ul>
            <a
              href="https://buy.stripe.com/4gM7sMeWdd4r5LQ7NU1VK00"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-green-500 text-black rounded-xl font-semibold hover:bg-green-400 transition glow-green text-center"
            >
              Upgrade to Pro
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
              <Code className="w-4 h-4 text-black" />
            </div>
            <span className="font-medium">RegexGPT</span>
          </div>
          <p className="text-sm text-gray-500">© 2025 RegexGPT. Made with AI.</p>
        </div>
      </footer>
    </main>
  )
}
