// Supabase Configuration
// استبدل الأكواد التالية ببيانات مشروعك الخاصة في Supabase (URL & Anon Key)
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase Client
const supabase = (typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL') 
    ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
    : null;

/**
 * SQL Scheme for Supabase Table setup:
 * 
 * create table players_leaderboard (
 *   id uuid default gen_random_uuid() primary key,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   player_name text not null,
 *   score integer default 0,
 *   archetype text
 * );
 */
