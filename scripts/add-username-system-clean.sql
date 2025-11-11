-- Add username system to user_profiles table
-- This allows users to have unique handles like @wazarat

-- Add username column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;

-- Add constraint to ensure username is lowercase and alphanumeric + underscores
ALTER TABLE user_profiles 
ADD CONSTRAINT username_format 
CHECK (username ~ '^[a-z0-9_]+$' AND length(username) >= 3 AND length(username) <= 50);

-- Create index for fast username lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- Update existing admin user with username
UPDATE user_profiles 
SET username = 'wazarat' 
WHERE email = 'waz@canhav.com' OR email = 'wazarat@canhav.com';

-- Create function to generate username from email if not provided
CREATE OR REPLACE FUNCTION generate_username_from_email(email_input TEXT)
RETURNS TEXT AS $$
DECLARE
    base_username TEXT;
    final_username TEXT;
    counter INTEGER := 1;
BEGIN
    -- Extract username part from email and clean it
    base_username := lower(regexp_replace(split_part(email_input, '@', 1), '[^a-z0-9_]', '', 'g'));
    
    -- Ensure minimum length
    IF length(base_username) < 3 THEN
        base_username := base_username || '_user';
    END IF;
    
    -- Ensure maximum length
    IF length(base_username) > 50 THEN
        base_username := left(base_username, 50);
    END IF;
    
    final_username := base_username;
    
    -- Check if username exists and add number if needed
    WHILE EXISTS (SELECT 1 FROM user_profiles WHERE username = final_username) LOOP
        final_username := base_username || '_' || counter;
        counter := counter + 1;
        
        -- Prevent infinite loop
        IF counter > 999 THEN
            final_username := base_username || '_' || extract(epoch from now())::integer;
            EXIT;
        END IF;
    END LOOP;
    
    RETURN final_username;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate username for new users if not provided
CREATE OR REPLACE FUNCTION auto_generate_username()
RETURNS TRIGGER AS $$
BEGIN
    -- Only generate username if not provided
    IF NEW.username IS NULL OR NEW.username = '' THEN
        NEW.username := generate_username_from_email(NEW.email);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_auto_generate_username ON user_profiles;
CREATE TRIGGER trigger_auto_generate_username
    BEFORE INSERT ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_username();

-- Update any existing users without usernames
UPDATE user_profiles 
SET username = generate_username_from_email(email)
WHERE username IS NULL OR username = '';

-- Verification queries
SELECT 'Username system setup complete' as status;
SELECT email, username, full_name FROM user_profiles ORDER BY created_at;
