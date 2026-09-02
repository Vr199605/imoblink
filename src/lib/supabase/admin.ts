import { createClient } from '@supabase/supabase-js';

// Cliente Supabase com a service role key — só deve ser usado em código de
// servidor (rotas /api/**), NUNCA importado por um componente 'use client'.
// Ele ignora o RLS, então é o único jeito de gravar pedidos vindos do
// webhook do Kiwify (que não tem sessão de usuário autenticado).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
