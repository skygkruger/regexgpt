'use client';

import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
//  REGEXGPT - PASTEL RETRO TERMINAL REDESIGN
//  Primary Accent: Soft Cyan (#7eb8da)
// ═══════════════════════════════════════════════════════════════

export default function RegexGPTRetro() {
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState('');

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  // Simulated generation (replace with actual API call)
  const handleGenerate = async () => {
    if (!inputValue.trim()) return;
    setIsLoading(true);
    setOutputValue('');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Example output (replace with actual API response)
    setOutputValue('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    setIsLoading(false);
  };

  const handleCopy = () => {
    if (outputValue) {
      navigator.clipboard.writeText(outputValue);
      setCopyFeedback('[/] COPIED');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  const tabs = ['GENERATE', 'EXPLAIN', 'HISTORY'];

  return (
    <div 
      className="min-h-screen font-mono text-sm"
      style={{ 
        backgroundColor: '#1a1a2e',
        color: '#a8b2c3'
      }}
    >
      {/* ═══════════════════════════════════════════════════════ */}
      {/*                       HEADER                            */}
      {/* ═══════════════════════════════════════════════════════ */}
      
      <header className="border-b" style={{ borderColor: '#6e6a86' }}>
        <div className="max-w-4xl mx-auto px-4">
          <pre className="text-xs py-2" style={{ color: '#7eb8da' }}>
{`╔════════════════════════════════════════════════════════════════════════════════╗
║  REGEXGPT                                    [DOCS]  [PRICING]  [GITHUB]  [@]  ║
╚════════════════════════════════════════════════════════════════════════════════╝`}
          </pre>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* ═══════════════════════════════════════════════════════ */}
        {/*                     ASCII LOGO                          */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div className="text-center" style={{ color: '#7eb8da' }}>
          <pre className="text-xs leading-tight inline-block">
{`
██████╗ ███████╗ ██████╗ ███████╗██╗  ██╗ ██████╗ ██████╗ ████████╗
██╔══██╗██╔════╝██╔════╝ ██╔════╝╚██╗██╔╝██╔════╝ ██╔══██╗╚══██╔══╝
██████╔╝█████╗  ██║  ███╗█████╗   ╚███╔╝ ██║  ███╗██████╔╝   ██║   
██╔══██╗██╔══╝  ██║   ██║██╔══╝   ██╔██╗ ██║   ██║██╔═══╝    ██║   
██║  ██║███████╗╚██████╔╝███████╗██╔╝ ██╗╚██████╔╝██║        ██║   
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝        ╚═╝   
`}
          </pre>
          <p className="text-xs tracking-widest mt-2" style={{ color: '#c4a7e7' }}>
            ·:·:· PATTERN GENERATOR v1.0 ·:·:·
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                      TAGLINE                            */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div className="text-center space-y-2">
          <p style={{ color: '#e8e3e3' }}>
            Stop struggling with regex. Describe it in plain English.
          </p>
          <p className="text-xs" style={{ color: '#6e6a86' }}>
            // generate patterns from descriptions or explain existing ones
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                    TAB NAVIGATION                       */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div style={{ color: '#7eb8da' }}>
          <pre className="text-xs">
{`┌──────────────────┬──────────────────┬──────────────────┐`}
          </pre>
          <div className="flex">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className="flex-1 text-center py-1 text-xs transition-colors"
                style={{ 
                  color: activeTab === i ? '#7eb8da' : '#6e6a86',
                }}
              >
                {activeTab === i ? `[*] ${tab}` : `    ${tab}   `}
              </button>
            ))}
          </div>
          <pre className="text-xs">
{`└──────────────────┴──────────────────┴──────────────────┘`}
          </pre>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                    INPUT SECTION                        */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div style={{ color: '#7eb8da' }}>
          <pre className="text-xs">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│  ${activeTab === 0 ? 'DESCRIBE YOUR PATTERN' : activeTab === 1 ? 'PASTE REGEX TO EXPLAIN' : 'SEARCH HISTORY'}                                                     │
├─────────────────────────────────────────────────────────────────────────────┤`}
          </pre>
          
          <div 
            className="px-4 py-4 border-l border-r"
            style={{ borderColor: '#7eb8da' }}
          >
            <div className="flex items-start gap-2">
              <span style={{ color: '#f2cdcd' }}>{'>'}</span>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  activeTab === 0 
                    ? "match an email address..." 
                    : activeTab === 1 
                    ? "^[a-z]+$..." 
                    : "search..."
                }
                rows={3}
                className="flex-1 bg-transparent outline-none resize-none placeholder-opacity-50"
                style={{ 
                  color: '#e8e3e3', 
                  caretColor: '#f2cdcd',
                }}
              />
              <span 
                className="transition-opacity"
                style={{ 
                  color: '#f2cdcd',
                  opacity: cursorVisible ? 1 : 0 
                }}
              >█</span>
            </div>
          </div>
          
          <pre className="text-xs">
{`└─────────────────────────────────────────────────────────────────────────────┘`}
          </pre>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                      BUTTONS                            */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Primary Action */}
          <button 
            onClick={handleGenerate}
            disabled={isLoading || !inputValue.trim()}
            className="transition-all hover:translate-y-px disabled:opacity-50"
            style={{ color: '#a8d8b9' }}
          >
            <pre className="text-xs leading-tight">
{isLoading 
  ? `┌─────────────────────────┐
│  [~] GENERATING...      │
└─────────────────────────┘`
  : `┌─────────────────────────┐
│  [>] ${activeTab === 0 ? 'GENERATE' : activeTab === 1 ? 'EXPLAIN ' : 'SEARCH  '}          │
└─────────────────────────┘`}
            </pre>
          </button>

          {/* Clear Button */}
          <button 
            onClick={() => { setInputValue(''); setOutputValue(''); }}
            className="transition-all hover:translate-y-px"
            style={{ color: '#6e6a86' }}
          >
            <pre className="text-xs leading-tight">
{`┌─────────────────────────┐
│  [x] CLEAR              │
└─────────────────────────┘`}
            </pre>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                   OUTPUT SECTION                        */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        {(outputValue || isLoading) && (
          <div style={{ color: '#a8d8b9' }}>
            <pre className="text-xs">
{`╔═════════════════════════════════════════════════════════════════════════════╗
║  RESULT                                                                     ║
╠═════════════════════════════════════════════════════════════════════════════╣`}
            </pre>
            
            <div 
              className="px-4 py-4 border-l-2 border-r-2"
              style={{ borderColor: '#a8d8b9' }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2" style={{ color: '#ffe9b0' }}>
                  <span>[~]</span>
                  <span>Processing your request...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <code 
                    className="block p-3 rounded text-sm break-all"
                    style={{ backgroundColor: '#16161a', color: '#e8e3e3' }}
                  >
                    {outputValue}
                  </code>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={handleCopy}
                      className="transition-all hover:translate-y-px"
                      style={{ color: '#f2cdcd' }}
                    >
                      <pre className="text-xs">
{copyFeedback || `[:] COPY`}
                      </pre>
                    </button>
                    
                    <button 
                      className="transition-all hover:translate-y-px"
                      style={{ color: '#c4a7e7' }}
                    >
                      <pre className="text-xs">
{`[+] SAVE`}
                      </pre>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <pre className="text-xs">
{`╠═════════════════════════════════════════════════════════════════════════════╣
║  STATUS: ${isLoading ? '(~) PROCESSING' : '(o) COMPLETE  '}                                                      ║
╚═════════════════════════════════════════════════════════════════════════════╝`}
            </pre>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                    EXAMPLES                             */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div className="space-y-3">
          <p className="text-xs" style={{ color: '#6e6a86' }}>// TRY THESE EXAMPLES</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'match an email address',
              'match a URL starting with https',
              'match a phone number like (123) 456-7890',
              'match a hex color code like #FF5733',
            ].map((example, i) => (
              <button
                key={i}
                onClick={() => setInputValue(example)}
                className="text-left transition-all hover:translate-x-1"
                style={{ color: '#7eb8da' }}
              >
                <pre className="text-xs">
{`┌${'─'.repeat(36)}┐
│  >>> ${example.slice(0, 28).padEnd(28)} │
└${'─'.repeat(36)}┘`}
                </pre>
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                    FEATURES                             */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div className="space-y-3">
          <p className="text-xs" style={{ color: '#6e6a86' }}>// FEATURES</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Feature 1 */}
            <div style={{ color: '#7eb8da' }}>
              <pre className="text-xs leading-tight">
{`┌───────────────────────────┐
│                           │
│    [>] GENERATE           │
│                           │
│  Describe what you want   │
│  to match in plain        │
│  English. Get a working   │
│  regex instantly.         │
│                           │
└───────────────────────────┘`}
              </pre>
            </div>
            
            {/* Feature 2 */}
            <div style={{ color: '#c4a7e7' }}>
              <pre className="text-xs leading-tight">
{`┌───────────────────────────┐
│                           │
│    [?] EXPLAIN            │
│                           │
│  Paste any cryptic        │
│  regex pattern. Get a     │
│  human-readable           │
│  explanation.             │
│                           │
└───────────────────────────┘`}
              </pre>
            </div>
            
            {/* Feature 3 */}
            <div style={{ color: '#a8d8b9' }}>
              <pre className="text-xs leading-tight">
{`┌───────────────────────────┐
│                           │
│    [:] COPY               │
│                           │
│  One-click copy to        │
│  clipboard. Ready to      │
│  paste into your          │
│  code editor.             │
│                           │
└───────────────────────────┘`}
              </pre>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                    PRICING                              */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div className="space-y-3">
          <p className="text-xs" style={{ color: '#6e6a86' }}>// PRICING</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free Tier */}
            <div style={{ color: '#a8b2c3' }}>
              <pre className="text-xs leading-tight">
{`┌─────────────────────────────────┐
│                                 │
│      ┌─────┐                    │
│      │  F  │   FREE             │
│      └─────┘                    │
│                                 │
│      $0/forever                 │
│                                 │
│      [/] 10 generations/day     │
│      [/] Basic patterns         │
│      [/] Explain any regex      │
│      [x] History & favorites    │
│      [x] Priority processing    │
│                                 │
│     ┌─────────────────────┐     │
│     │   CURRENT PLAN      │     │
│     └─────────────────────┘     │
│                                 │
└─────────────────────────────────┘`}
              </pre>
            </div>
            
            {/* Pro Tier */}
            <div style={{ color: '#c4a7e7' }}>
              <pre className="text-xs leading-tight">
{`╔═════════════════════════════════╗
║     * * * RECOMMENDED * * *     ║
║                                 ║
║      ╔═════╗                    ║
║      ║  P  ║   PRO              ║
║      ╚═════╝                    ║
║                                 ║
║      $6/month                   ║
║                                 ║
║      [/] Unlimited generations  ║
║      [/] Complex patterns       ║
║      [/] Explain any regex      ║
║      [/] History & favorites    ║
║      [/] Priority processing    ║
║                                 ║
║     ╔═════════════════════╗     ║
║     ║  [>] UPGRADE NOW    ║     ║
║     ╚═════════════════════╝     ║
║                                 ║
╚═════════════════════════════════╝`}
              </pre>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                    TESTIMONIALS                         */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div className="space-y-3">
          <p className="text-xs" style={{ color: '#6e6a86' }}>// WHAT DEVELOPERS SAY</p>
          
          <div style={{ color: '#a8b2c3' }}>
            <pre className="text-xs leading-tight">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  "Finally stopped googling 'regex for email' every single project."        │
│                                                                             │
│                                              - @dev_on_twitter              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  "The explain feature saved me 2 hours understanding legacy regex."         │
│                                                                             │
│                                              - reddit user                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                      FAQ                                */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div className="space-y-3">
          <p className="text-xs" style={{ color: '#6e6a86' }}>// FAQ</p>
          
          <div className="space-y-2" style={{ color: '#a8b2c3' }}>
            <details className="group">
              <summary className="cursor-pointer" style={{ color: '#7eb8da' }}>
                <pre className="text-xs inline">
{`[?] How accurate are the generated patterns?`}
                </pre>
              </summary>
              <pre className="text-xs pl-4 pt-2" style={{ color: '#a8b2c3' }}>
{`    Our AI generates patterns that work for common use cases.
    Always test with your specific data before production use.`}
              </pre>
            </details>
            
            <details className="group">
              <summary className="cursor-pointer" style={{ color: '#7eb8da' }}>
                <pre className="text-xs inline">
{`[?] What regex flavors are supported?`}
                </pre>
              </summary>
              <pre className="text-xs pl-4 pt-2" style={{ color: '#a8b2c3' }}>
{`    We generate patterns compatible with JavaScript/PCRE.
    Most patterns work across Python, Java, Go, and PHP.`}
              </pre>
            </details>
            
            <details className="group">
              <summary className="cursor-pointer" style={{ color: '#7eb8da' }}>
                <pre className="text-xs inline">
{`[?] Is my data stored or used for training?`}
                </pre>
              </summary>
              <pre className="text-xs pl-4 pt-2" style={{ color: '#a8b2c3' }}>
{`    No. We don't store your queries or use them for training.
    Your data is processed and immediately discarded.`}
              </pre>
            </details>
          </div>
        </div>

      </main>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*                      FOOTER                             */}
      {/* ═══════════════════════════════════════════════════════ */}
      
      <footer className="border-t mt-16" style={{ borderColor: '#6e6a86' }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <pre className="text-xs text-center" style={{ color: '#6e6a86' }}>
{`
════════════════════════════════════════════════════════════════════════════════

                           BUILT WITH <3 IN THE TERMINAL

                               (c) 2025 REGEXGPT
                         
              [HOME]  [DOCS]  [PRICING]  [GITHUB]  [TWITTER]  [CONTACT]

════════════════════════════════════════════════════════════════════════════════
`}
          </pre>
        </div>
      </footer>
    </div>
  );
}
