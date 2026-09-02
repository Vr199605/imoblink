-- ==============================================================================
-- KIWIFY — Tabela de compras + função de checagem de acesso pago
-- (já aplicado no projeto Supabase em produção; este arquivo fica no repo
-- só como registro/histórico do schema, igual ao supabase-schema.sql)
-- ==============================================================================

-- Registro de cada pedido recebido via webhook do Kiwify.
-- Só o backend (service role, usado pela rota /api/webhooks/kiwify) grava aqui.
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  status TEXT NOT NULL, -- 'approved' | 'refunded' | outro valor bruto do Kiwify
  order_id TEXT UNIQUE NOT NULL,
  product_id TEXT,
  product_name TEXT,
  customer_name TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_purchases_email_lower ON public.purchases (lower(email));
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases (status);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
-- Nenhuma política pública de SELECT/INSERT/UPDATE é criada de propósito:
-- só o service role (usado no backend do webhook) acessa esta tabela diretamente.
-- O front-end só pode checar status via a função abaixo (que não expõe os dados).

-- Função que diz se um e-mail tem pelo menos uma compra aprovada e ainda válida.
-- Roda com privilégios do dono da função (SECURITY DEFINER) para poder ler a
-- tabela mesmo com RLS ativo, mas só retorna um booleano — nunca expõe e-mail,
-- valor pago ou qualquer outro dado da compra.
CREATE OR REPLACE FUNCTION public.has_active_purchase(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.purchases
    WHERE lower(email) = lower(check_email)
      AND status = 'approved'
  );
$$;

REVOKE ALL ON FUNCTION public.has_active_purchase(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_active_purchase(TEXT) TO anon, authenticated;
