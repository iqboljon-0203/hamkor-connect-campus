import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vhkcokbkksbfqtctjjkt.supabase.co"; // Bu yerga o‘zingizning Supabase URL ni yozing
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoa2Nva2Jra3NiZnF0Y3Rqamt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NjI1MDksImV4cCI6MjA2MzEzODUwOX0._u6ZDxtqsC8M8RpwiOgozYeUhO4eN6sJWkWLkzbwa3k"; // Bu yerga o‘zingizning anon key ni yozing

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
