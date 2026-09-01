-- ==============================================================================
-- IMOBLLINK - SCHEMA DE BANCO DE DADOS SUPABASE (POSTGRESQL COM ROW LEVEL SECURITY)
-- ==============================================================================

-- 1. Tabela de Perfis de Corretores (Vinculada ao auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  creci TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
  bio TEXT DEFAULT 'Corretor de im�veis credenciado.',
  instagram TEXT,
  city TEXT DEFAULT 'S�o Paulo',
  state TEXT DEFAULT 'SP',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Im�veis
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  broker_slug TEXT NOT NULL,
  slug TEXT NOT NULL,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL, -- apartamento, casa, cobertura, terreno, comercial, chacara
  purpose TEXT DEFAULT 'venda' NOT NULL, -- venda, aluguel
  status TEXT DEFAULT 'disponivel' NOT NULL, -- disponivel, reservado, vendido
  price NUMERIC NOT NULL,
  condo_fee NUMERIC DEFAULT 0,
  iptu NUMERIC DEFAULT 0,
  bedrooms INTEGER DEFAULT 1 NOT NULL,
  suites INTEGER DEFAULT 0 NOT NULL,
  bathrooms INTEGER DEFAULT 1 NOT NULL,
  garage_spots INTEGER DEFAULT 0 NOT NULL,
  area_m2 NUMERIC NOT NULL,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address_approx TEXT,
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar Seguran�a por Linha (Row Level Security - RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Pol�ticas de Acesso para Perfis
-- Qualquer pessoa na internet pode ler perfis p�blicos (para abrir o cat�logo do corretor)
CREATE POLICY "Perfis s�o p�blicos para leitura" 
  ON public.profiles FOR SELECT 
  USING (true);

-- O corretor autenticado s� pode criar ou atualizar seu pr�prio perfil
CREATE POLICY "Corretores podem criar e editar seu pr�prio perfil" 
  ON public.profiles FOR ALL 
  USING (auth.uid() = id);

-- Pol�ticas de Acesso para Im�veis
-- Qualquer pessoa na internet pode ler im�veis dispon�veis
CREATE POLICY "Im�veis s�o p�blicos para leitura" 
  ON public.properties FOR SELECT 
  USING (true);

-- O corretor s� pode cadastrar, editar ou deletar im�veis que pertencem a ele
CREATE POLICY "Corretores gerenciam apenas seus pr�prios im�veis" 
  ON public.properties FOR ALL 
  USING (auth.uid() = broker_id);

-- �ndices de Performance
CREATE INDEX IF NOT EXISTS idx_properties_broker_slug ON public.properties(broker_slug);
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON public.profiles(slug);
