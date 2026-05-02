-- Add verification and authority fields to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS authority_level VARCHAR(50) DEFAULT 'Contributor';

-- Update some existing profiles as examples (Optional)
-- UPDATE profiles SET is_verified = TRUE, authority_level = 'Strategic Expert' WHERE initials = 'NI';
