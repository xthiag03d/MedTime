import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const SUPABASE_URL = "https://jesptucpdhliwkrmkmwu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implc3B0dWNwZGhsaXdrcm1rbXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1Mjk0OTQsImV4cCI6MjA1NDEwNTQ5NH0.GwCPN6r2NcjQFZG1vS1-aGtrAWXvLJI9Im6ZemaAhSk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
