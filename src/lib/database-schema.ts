/**
 * WhisperCapital Supabase Database Schema
 * 
 * This file defines the database schema for the WhisperCapital investment management module.
 * It includes tables for users, investments, positions, alerts, preferences, and social media sources.
 */

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Investment {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  category: 'Aktie' | 'ETF' | 'Krypto' | 'Rohstoff' | 'Fonds';
  created_at: string;
  updated_at: string;
  current_price?: number;
  currency?: string;
  total_quantity?: number;
  total_value?: number;
  total_cost?: number;
  total_gain_loss?: number;
  total_gain_loss_percentage?: number;
  daily_change?: number;
  daily_change_percentage?: number;
}

export interface Position {
  id: string;
  investment_id: string;
  user_id: string;
  purchase_price: number;
  quantity: number;
  purchase_date: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  purchase_fees?: number;
}

export interface Alert {
  id: string;
  user_id: string;
  investment_id: string;
  symbol: string;
  condition: 'above' | 'below';
  price: number;
  created_at: string;
  updated_at: string;
  triggered: boolean;
  triggered_at?: string;
  notification_sent: boolean;
  notification_type?: 'in-app' | 'email' | 'telegram';
}

export interface Preference {
  id: string;
  user_id: string;
  currency: string;
  language: string;
  theme: 'dark' | 'light';
  created_at: string;
  updated_at: string;
  notification_preferences?: {
    in_app: boolean;
    email: boolean;
    telegram: boolean;
  };
}

export interface SocialMediaSource {
  id: string;
  user_id: string;
  platform: 'twitter' | 'reddit' | 'telegram' | 'youtube';
  source_id: string;
  source_name: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  category?: string;
}

/**
 * SQL Statements for creating the database schema in Supabase
 */

export const createUsersTrigger = `
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.preferences (user_id, currency, language, theme)
  VALUES (NEW.id, 'EUR', 'de', 'dark');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;

export const createInvestmentsTable = `
CREATE TABLE public.investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Aktie', 'ETF', 'Krypto', 'Rohstoff', 'Fonds')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_price DECIMAL(18, 6),
  currency TEXT DEFAULT 'EUR',
  total_quantity DECIMAL(18, 6),
  total_value DECIMAL(18, 6),
  total_cost DECIMAL(18, 6),
  total_gain_loss DECIMAL(18, 6),
  total_gain_loss_percentage DECIMAL(8, 2),
  daily_change DECIMAL(18, 6),
  daily_change_percentage DECIMAL(8, 2)
);

-- Create policy to restrict access to user's own investments
CREATE POLICY "Users can only access their own investments" 
  ON public.investments 
  FOR ALL 
  USING (auth.uid() = user_id);
`;

export const createPositionsTable = `
CREATE TABLE public.positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investment_id UUID NOT NULL REFERENCES public.investments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  purchase_price DECIMAL(18, 6) NOT NULL,
  quantity DECIMAL(18, 6) NOT NULL,
  purchase_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  purchase_fees DECIMAL(18, 6) DEFAULT 0
);

-- Create policy to restrict access to user's own positions
CREATE POLICY "Users can only access their own positions" 
  ON public.positions 
  FOR ALL 
  USING (auth.uid() = user_id);
`;

export const createAlertsTable = `
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  investment_id UUID REFERENCES public.investments(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('above', 'below')),
  price DECIMAL(18, 6) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  triggered BOOLEAN NOT NULL DEFAULT FALSE,
  triggered_at TIMESTAMPTZ,
  notification_sent BOOLEAN NOT NULL DEFAULT FALSE,
  notification_type TEXT DEFAULT 'in-app' CHECK (notification_type IN ('in-app', 'email', 'telegram'))
);

-- Create policy to restrict access to user's own alerts
CREATE POLICY "Users can only access their own alerts" 
  ON public.alerts 
  FOR ALL 
  USING (auth.uid() = user_id);
`;

export const createPreferencesTable = `
CREATE TABLE public.preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  currency TEXT NOT NULL DEFAULT 'EUR',
  language TEXT NOT NULL DEFAULT 'de',
  theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notification_preferences JSONB DEFAULT '{"in_app": true, "email": false, "telegram": false}'
);

-- Create policy to restrict access to user's own preferences
CREATE POLICY "Users can only access their own preferences" 
  ON public.preferences 
  FOR ALL 
  USING (auth.uid() = user_id);
`;

export const createSocialMediaSourcesTable = `
CREATE TABLE public.social_media_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'reddit', 'telegram', 'youtube')),
  source_id TEXT NOT NULL,
  source_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  category TEXT
);

-- Create policy to restrict access to user's own social media sources
CREATE POLICY "Users can only access their own social media sources" 
  ON public.social_media_sources 
  FOR ALL 
  USING (auth.uid() = user_id);
`;
