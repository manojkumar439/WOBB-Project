/*
# Create saved_profiles table (single-tenant, no auth)

1. New Tables
- `saved_profiles`
- `id` (uuid, primary key)
- `user_id` (text, the original platform user_id)
- `username` (text, the influencer's username)
- `fullname` (text, the influencer's full name)
- `picture` (text, URL to profile picture)
- `platform` (text, social media platform: instagram/youtube/tiktok)
- `followers` (bigint, follower count)
- `is_verified` (boolean, verification status)
- `url` (text, link to profile)
- `added_at` (timestamptz, when added to list)

2. Security
- Enable RLS on `saved_profiles`.
- Allow anon + authenticated full CRUD access (single-tenant public data).

3. Notes
- Unique constraint on (user_id, platform) prevents duplicates
- Indexes on platform and username for fast lookups
*/

CREATE TABLE IF NOT EXISTS saved_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  username text NOT NULL,
  fullname text NOT NULL,
  picture text NOT NULL,
  platform text NOT NULL,
  followers bigint NOT NULL,
  is_verified boolean NOT NULL DEFAULT false,
  url text NOT NULL,
  added_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS saved_profiles_user_platform_idx 
  ON saved_profiles(user_id, platform);

CREATE INDEX IF NOT EXISTS saved_profiles_platform_idx 
  ON saved_profiles(platform);

CREATE INDEX IF NOT EXISTS saved_profiles_username_idx 
  ON saved_profiles(username);

ALTER TABLE saved_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_saved_profiles" ON saved_profiles;
CREATE POLICY "anon_select_saved_profiles" ON saved_profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_saved_profiles" ON saved_profiles;
CREATE POLICY "anon_insert_saved_profiles" ON saved_profiles FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_saved_profiles" ON saved_profiles;
CREATE POLICY "anon_update_saved_profiles" ON saved_profiles FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_saved_profiles" ON saved_profiles;
CREATE POLICY "anon_delete_saved_profiles" ON saved_profiles FOR DELETE
  TO anon, authenticated USING (true);