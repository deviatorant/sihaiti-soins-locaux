// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tfacovfcrjjlzkycmied.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmYWNvdmZjcmpqbHpreWNtaWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MzA4NzEsImV4cCI6MjA1OTMwNjg3MX0.Atx6yAl6foZ3wi8QR-VNEisytZ8M6EjDIeT0nSEVnnU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);