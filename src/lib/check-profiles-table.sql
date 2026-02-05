-- Run this query in Supabase SQL Editor to check your profiles table structure

-- Show all columns in the profiles table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Show all rows in profiles table (to see current data)
SELECT * FROM profiles LIMIT 10;
