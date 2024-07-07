// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qhylgzilnrzmnhycqixx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeWxnemlsbnJ6bW5oeWNxaXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAyODU0NDgsImV4cCI6MjAzNTg2MTQ0OH0.ZM2SMgNh_2gGhwgcOdnlf_GnQzra6MljcT4niGsqwzA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);