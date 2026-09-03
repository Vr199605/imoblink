'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { saveBrokerProfile } from '@/lib/storage';
import { generateSlug } from '@/lib/utils';
import { BrokerProfile } from '@/types';
import {
  Building2,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Phone,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Link2
} from 'lucide-react';

export default function CadastroPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creci, setCreci] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramEmail = params.get('email');
      const paramName = params.get('name');
      if (paramEmail) setEmail(paramEmail);
      if (paramName) {
        setName(paramName);
        setSlug(generateSlug(paramName));
      }
    }
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(val));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const finalSlug = slug.trim() || generateSlug(name);
    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isSupabaseConfigured && supabase) {
        // 1. Validar se o e-mail realizou a compra na Kiwify (tabela orders)
        const isOwner = cleanEmail === 'victormoreiraicnv@gmail.com';

        if (!isOwner) {
          const { data: orderMatches } = await supabase
            .from('orders')
            .select('*')
            .ilike('customer_email', cleanEmail)
            .limit(1);

          if (!orderMatches || orderMatches.length === 0) {
            setErrorMessage('Não encontramos uma compra aprovada para este e-mail. Por favor, utilize o mesmo e-mail informado na compra da Kiwify ou garanta seu acesso.');
            setLoading(false);
            return;
          }
        }

        // 2. Criar usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name,
              creci,
              phone,
              slug: finalSlug
            }
          }
        });

        if (authError) throw authError;

        // 3. Salvar Perfil na tabela profiles
        if (authData.user) {
          const { error: profileError } = await supabase.from('profiles').upsert([
            {
              id: authData.user.id,
              name,
              email: cleanEmail,
              creci,
              phone,
              slug: finalSlug,
              city: city || 'São Paulo',
              state: state || 'SP',
              avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
              bio: `Especialista em imóveis em ${city || 'São Paulo'}. Atendimento personalizado e exclusivo.`
            }
          ]);
          if (profileError) console.error('Profile creation error:', profileError);
        }

        // 4. Efetuar login imediatamente para criar a sessão ativa
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        router.push('/dashboard');
      } else {
        // Modo Local / Demo
        const newProfile: BrokerProfile = {
          id: `broker-${Date.now()}`,
          name,
          email,
          creci,
          phone,
          slug: finalSlug,
          city: city || 'São Paulo',
          state: state || 'SP',
          avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
          bio: `Especialista em imóveis em ${city || 'São Paulo'}. Atendimento personalizado e exclusivo.`,
          viewsTotal: 0,
          leadsTotal: 0
        };

        saveBrokerProfile(newProfile);
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50/70 py-12 flex items-center justify-center px-4">
        <div className="max-w-xl w-full space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Crie seu Catálogo Profissional
            </h1>
            <p className="text-xs text-slate-500">
              Comece a vender imóveis com seu link exclusivo no WhatsApp em 2 minutos
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Nome & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Seu Nome Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Ex: Carlos Silva"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    E-mail de Acesso
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Senha & CRECI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Senha de Acesso
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Número do CRECI
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={creci}
                      onChange={(e) => setCreci(e.target.value)}
                      placeholder="Ex: 123.456-F"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp & Cidade */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    WhatsApp (DDD + Número)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: 5511999999999"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Link Exclusivo (Slug) */}
              <div className="pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Seu Link Exclusivo do Catálogo
                </label>
                <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 overflow-hidden px-3 py-1 focus-within:ring-2 focus-within:ring-emerald-500">
                  <span className="text-xs text-slate-400 font-mono select-none">
                    imoblink.app/c/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    placeholder="seu-nome"
                    className="flex-1 bg-transparent text-xs text-emerald-700 font-mono font-bold py-2 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95 text-sm mt-4"
              >
                <span>{loading ? 'Criando Conta...' : 'Criar Meu Catálogo Grátis'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              Já possui uma conta?{' '}
              <Link href="/login" className="font-bold text-emerald-600 hover:underline">
                Fazer Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
