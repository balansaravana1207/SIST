-- =====================================================
-- COMPLETE DATABASE SETUP FOR PROFILES
-- =====================================================
-- Run this script in your Supabase SQL Editor to fix profile creation
-- This will ensure names from signup are saved to the database

-- Step 1: Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'student',
  email TEXT,
  roll_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;

-- Step 4: Create RLS policies
-- Policy 1: Users can read their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Policy 3: Authenticated users can view all profiles
CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Policy 4: Allow authenticated users to insert profiles
CREATE POLICY "Enable insert for authenticated users"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (true);

-- Step 5: Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table using data from the new auth user
  INSERT INTO public.profiles (id, full_name, role, email, created_at)
  VALUES (
    NEW.id,                                              -- User ID from auth.users
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''), -- Extract full_name from metadata
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'), -- Extract role, default to 'student'
    NEW.email,                                           -- Email from auth.users
    NOW()                                                -- Current timestamp
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicate profile creation
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 7: Verification
-- Check that trigger was created
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check existing profiles
SELECT id, full_name, role, email, created_at 
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- =====================================================
-- MANUAL FIX FOR EXISTING USERS (if needed)
-- =====================================================
-- If you already have a user account that doesn't have a profile,
-- run this query to create it manually (replace the values):

-- INSERT INTO public.profiles (id, full_name, role, email)
-- SELECT 
--   id, 
--   raw_user_meta_data->>'full_name' as full_name,
--   COALESCE(raw_user_meta_data->>'role', 'student') as role,
--   email
-- FROM auth.users
-- WHERE id NOT IN (SELECT id FROM public.profiles);

-- After running this, new signups will automatically create profiles!
