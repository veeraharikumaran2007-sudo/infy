import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://zoxivayrmukszjxhohvs.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpveGl2YXlybXVrc3pqeGhvaHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3NzYzNTMsImV4cCI6MjEwOTM1MjM1M30.UERWACNwnQrux1uZHB1xwjfQTUFv_nyfx1nH2nvFanc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
