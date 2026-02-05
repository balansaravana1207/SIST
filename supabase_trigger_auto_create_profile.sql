-- =====================================================
-- Automatic Profile Creation Trigger for Supabase Auth
-- =====================================================
-- This trigger automatically creates a profile when a user signs up
-- It reads metadata from auth.users and creates the profile record

-- Step 1: Create the trigger function
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

-- Step 2: Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verification: Check that trigger was created
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
