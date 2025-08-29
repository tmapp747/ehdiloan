-- Add QR code image fields to users table for payment management
ALTER TABLE users ADD COLUMN IF NOT EXISTS gcash_qr_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS maya_qr_url TEXT;

-- Update RLS policies to allow users to update their own QR codes
CREATE POLICY "Users can update their own QR codes" ON users
  FOR UPDATE USING (auth.uid() = id);
