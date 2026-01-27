-- RegexGPT Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- Stores user profile information and subscription status
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for Stripe customer lookup
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);

-- ============================================
-- USAGE TABLE
-- Tracks daily usage for rate limiting
-- ============================================
CREATE TABLE IF NOT EXISTS usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  generation_count INTEGER NOT NULL DEFAULT 0,
  explanation_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Index for efficient daily usage lookups
CREATE INDEX IF NOT EXISTS idx_usage_user_date ON usage(user_id, date);

-- ============================================
-- PATTERNS TABLE (Pro feature - History)
-- Stores generated patterns for Pro users
-- ============================================
CREATE TABLE IF NOT EXISTS patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  pattern TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('generate', 'explain')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user's pattern history
CREATE INDEX IF NOT EXISTS idx_patterns_user ON patterns(user_id, created_at DESC);

-- ============================================
-- COLLECTIONS TABLE (Pro feature)
-- Allows users to organize patterns into collections
-- ============================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user's collections
CREATE INDEX IF NOT EXISTS idx_collections_user ON collections(user_id);

-- ============================================
-- COLLECTION_PATTERNS TABLE (Junction table)
-- Links patterns to collections
-- ============================================
CREATE TABLE IF NOT EXISTS collection_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  pattern_id UUID NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(collection_id, pattern_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures users can only access their own data
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_patterns ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Usage: Users can view their own usage
CREATE POLICY "Users can view own usage"
  ON usage FOR SELECT
  USING (auth.uid() = user_id);

-- Patterns: Users can view their own patterns
CREATE POLICY "Users can view own patterns"
  ON patterns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patterns"
  ON patterns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own patterns"
  ON patterns FOR DELETE
  USING (auth.uid() = user_id);

-- Collections: Users can manage their own collections
CREATE POLICY "Users can view own collections"
  ON collections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own collections"
  ON collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collections"
  ON collections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own collections"
  ON collections FOR DELETE
  USING (auth.uid() = user_id);

-- Collection patterns: Users can manage patterns in their collections
CREATE POLICY "Users can view own collection patterns"
  ON collection_patterns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_patterns.collection_id
      AND collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own collection patterns"
  ON collection_patterns FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_patterns.collection_id
      AND collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own collection patterns"
  ON collection_patterns FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_patterns.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to increment usage count (used by the API)
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_mode TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO usage (user_id, date, generation_count, explanation_count)
  VALUES (
    p_user_id,
    CURRENT_DATE,
    CASE WHEN p_mode = 'generate' THEN 1 ELSE 0 END,
    CASE WHEN p_mode = 'explain' THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    generation_count = usage.generation_count + CASE WHEN p_mode = 'generate' THEN 1 ELSE 0 END,
    explanation_count = usage.explanation_count + CASE WHEN p_mode = 'explain' THEN 1 ELSE 0 END;
END;
$$;

-- Function to handle new user signup (creates profile)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, plan)
  VALUES (NEW.id, NEW.email, 'free')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS collections_updated_at ON collections;
CREATE TRIGGER collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- GRANT SERVICE ROLE ACCESS
-- Allows the service role to bypass RLS for webhook operations
-- ============================================
GRANT ALL ON profiles TO service_role;
GRANT ALL ON usage TO service_role;
GRANT ALL ON patterns TO service_role;
GRANT ALL ON collections TO service_role;
GRANT ALL ON collection_patterns TO service_role;
