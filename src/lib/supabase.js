import { createClient } from '@supabase/supabase-js';

// Colocamos chaves falsas de fallback caso o .env.local não seja lido
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://teste123.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'chave-falsa-para-nao-quebrar-a-tela';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);