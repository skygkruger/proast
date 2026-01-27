-- PRoast Database Schema for Supabase
-- Run this in your Supabase SQL editor to set up all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TEAMS TABLE (must be created before profiles)
-- For team subscriptions
-- ============================================
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PROFILES TABLE
-- Extends Supabase auth.users with app-specific data
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  stripe_customer_id TEXT,
  github_access_token TEXT,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  roasts_today INTEGER NOT NULL DEFAULT 0,
  last_roast_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key from teams.owner_id to profiles after profiles exists
ALTER TABLE public.teams
  ADD CONSTRAINT teams_owner_id_fkey
  FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ============================================
-- ROASTS TABLE
-- Stores roast history for authenticated users
-- ============================================
CREATE TABLE IF NOT EXISTS public.roasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  language TEXT DEFAULT 'unknown',
  severity TEXT NOT NULL CHECK (severity IN ('gentle', 'honest', 'brutal', 'savage')),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  grade TEXT NOT NULL,
  headline TEXT NOT NULL,
  issues JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT NOT NULL,
  card_url TEXT,
  github_pr_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- USAGE TABLE
-- For tracking daily rate limits
-- ============================================
CREATE TABLE IF NOT EXISTS public.usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  roast_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_roasts_user_id ON public.roasts(user_id);
CREATE INDEX IF NOT EXISTS idx_roasts_created_at ON public.roasts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_roasts_is_public ON public.roasts(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_usage_user_date ON public.usage(user_id, date);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Teams policies
CREATE POLICY "Team members can view their team"
  ON public.teams FOR SELECT
  USING (
    id IN (SELECT team_id FROM public.profiles WHERE id = auth.uid())
    OR owner_id = auth.uid()
  );

CREATE POLICY "Team owners can update their team"
  ON public.teams FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create teams"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Roasts policies
CREATE POLICY "Users can view own roasts"
  ON public.roasts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view public roasts"
  ON public.roasts FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Users can insert own roasts"
  ON public.roasts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own roasts"
  ON public.roasts FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own roasts"
  ON public.roasts FOR DELETE
  USING (user_id = auth.uid());

-- Usage policies
CREATE POLICY "Users can view own usage"
  ON public.usage FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own usage"
  ON public.usage FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own usage"
  ON public.usage FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to increment usage count (used when upsert fails)
CREATE OR REPLACE FUNCTION increment_usage(p_user_id UUID, p_date DATE)
RETURNS VOID AS $$
BEGIN
  UPDATE public.usage
  SET roast_count = roast_count + 1
  WHERE user_id = p_user_id AND date = p_date;

  IF NOT FOUND THEN
    INSERT INTO public.usage (user_id, date, roast_count)
    VALUES (p_user_id, p_date, 1);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- GRANTS (for service role access)
-- ============================================
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.teams TO service_role;
GRANT ALL ON public.roasts TO service_role;
GRANT ALL ON public.usage TO service_role;
GRANT EXECUTE ON FUNCTION increment_usage TO service_role;
