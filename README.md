# RegexGPT 🔤

AI-powered regex generator and explainer. Stop struggling with regex.

![RegexGPT Screenshot](./screenshot.png)

## Features

- **Generate Regex**: Describe what you want to match in plain English
- **Explain Regex**: Paste any pattern, get a human-readable breakdown
- **Copy & Share**: One-click copy, shareable links
- **Free Tier**: 10 generations/day free

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/regexgpt.git
cd regexgpt
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your keys:

```env
# Required: Get from https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-...

# Optional: For user tracking (get from https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Optional: For payments (get from https://stripe.com)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel (Free)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables
5. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/regexgpt)

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS
- **AI**: Claude API (Anthropic)
- **Database**: Supabase (optional, for usage tracking)
- **Payments**: Stripe (optional)
- **Hosting**: Vercel

## Project Structure

```
regexgpt/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/route.ts   # Regex generation endpoint
│   │   │   └── explain/route.ts    # Regex explanation endpoint
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Main app page
│   │   └── globals.css             # Global styles
│   ├── components/                  # React components
│   ├── lib/                         # Utilities
│   └── types/                       # TypeScript types
├── .env.example
├── package.json
└── README.md
```

## Adding Supabase (Optional - For Usage Tracking)

1. Create a project at [supabase.com](https://supabase.com)
2. Run this SQL in the SQL Editor:

```sql
-- Usage tracking table
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash TEXT NOT NULL,
  action TEXT NOT NULL, -- 'generate' or 'explain'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for rate limiting queries
CREATE INDEX idx_usage_ip_date ON usage(ip_hash, created_at);

-- Saved patterns table (for future feature)
CREATE TABLE patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  pattern TEXT NOT NULL,
  description TEXT,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. Add your Supabase URL and anon key to `.env.local`

## Adding Stripe (Optional - For Pro Subscriptions)

1. Create account at [stripe.com](https://stripe.com)
2. Create a product with price $6/month
3. Add webhook endpoint: `https://yourdomain.com/api/webhook`
4. Add keys to `.env.local`

## Monetization Strategy

| Tier | Limit | Price |
|------|-------|-------|
| Free | 10/day | $0 |
| Pro | Unlimited | $6/mo |
| API | Per request | $0.01/req |

## Launch Checklist

- [ ] Deploy to Vercel
- [ ] Set up custom domain
- [ ] Add Plausible/Vercel Analytics
- [ ] Submit to Product Hunt
- [ ] Post Show HN
- [ ] Tweet launch thread
- [ ] Post to r/webdev, r/programming

## License

MIT

---

Built with ❤️ and Claude
