-- Add birthday column to profiles table

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS birthday DATE;

-- Optional: Add comment to the column
COMMENT ON COLUMN profiles.birthday IS 'User date of birth';

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 🏠 MONGOLIAN ADDRESS SYSTEM NOTE:
-- Your profiles table also has aimag, sum, and horoo columns for Mongolian addresses.
-- 
-- 🎯 KEY CONCEPT:
-- • Ulaanbaatar (capital): Uses aimag → sum (дүүрэг/district) → horoo (хороо/neighborhood) ✅
-- • Other Aimags (21 provinces): Uses aimag → sum (сум) → NO horoo ❌
--
-- 📚 For complete explanation, see: MONGOLIAN_ADDRESS_SYSTEM.md
--
-- Example data:
-- Ulaanbaatar resident:
--   aimag: 'Улаанбаатар хот'
--   sum: 'Сүхбаатар дүүрэг' (district)
--   horoo: '5-р хороо' (neighborhood - REQUIRED for UB)
--
-- Aimag resident:
--   aimag: 'Архангай аймаг'
--   sum: 'Цэцэрлэг сум' (sum/district)
--   horoo: NULL (not used for aimags)
