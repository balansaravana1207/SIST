-- SQL to fix your profiles table structure
-- Run this in Supabase SQL Editor if your table has incorrect columns

-- Option 1: If your table has 'name' but you want it to be 'full_name'
-- ALTER TABLE profiles RENAME COLUMN name TO full_name;

-- Option 2: If your table has 'full_name' but you want it to be 'name'
-- ALTER TABLE profiles RENAME COLUMN full_name TO name;

-- Option 3: Add missing email column if it doesn't exist
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Option 4: Recreate the profiles table with correct structure (WARNING: Deletes all data!)
-- DROP TABLE IF EXISTS profiles;
-- CREATE TABLE profiles (
--     id UUID REFERENCES auth.users(id) PRIMARY KEY,
--     email TEXT,
--     name TEXT,
--     role TEXT DEFAULT 'student',
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- Create a trigger to automatically create profile on user creation (optional)
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--     AFTER INSERT ON auth.users
--     FOR EACH ROW EXECUTE FUNCTION handle_new_user();
