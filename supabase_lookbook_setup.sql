-- ============================================================
-- Banleo Lookbook — Supabase Setup
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create the lookbook_items table
CREATE TABLE IF NOT EXISTS public.lookbook_items (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text NOT NULL,
  description text,
  image       text NOT NULL,
  products    text[] DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.lookbook_items ENABLE ROW LEVEL SECURITY;

-- 3. Public can read all lookbook items
CREATE POLICY "Anyone can read lookbook items"
  ON public.lookbook_items FOR SELECT
  USING (true);

-- 4. Only admins can insert / update / delete
CREATE POLICY "Admins can manage lookbook items"
  ON public.lookbook_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================
-- Storage Bucket (run via Supabase Dashboard or via API)
-- Create a bucket named "lookbook" with public access
-- Dashboard → Storage → New Bucket → Name: lookbook → Public: YES
-- ============================================================
