import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbezhmttphcmqiwatenk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZXpobXR0cGhjbXFpd2F0ZW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NzE1NjQsImV4cCI6MjA5NTU0NzU2NH0.7ZIusLn2JxDIJ__KqX_K_SQgkXv1KlE0UugsQaWVwGk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);