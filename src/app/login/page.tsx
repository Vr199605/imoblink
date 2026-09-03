'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Building2, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        router.push('/dashboard');
      } else {
        // Modo Demonstração / Local
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao realizar login. Verifique seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50/70 py-12 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Acesse seu Painel
            </h1>
            <p className="text-xs text-slate-500">
              Gerencie seus imóveis, visualize métricas e envie links no WhatsApp
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Modo de Teste / Demonstração Ativo:</span>
                <p className="text-amber-700 mt-0.5">
                  Você pode digitar qualquer e-mail e senha para entrar no painel imediatamente.
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  E-mail do Corretor
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

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Senha
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95 text-sm mt-2"
              >
                <span>{loading ? 'Entrando...' : 'Entrar no Painel'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center space-y-2 text-xs text-slate-500">
              <div>
                Comprou na Kiwify e quer ativar seu acesso?{' '}
                <Link href="/cadastro" className="font-bold text-emerald-600 hover:underline">
                  Ativar Minha Conta
                </Link>
              </div>
              <div>
                Ainda não tem acesso?{' '}
                <a
                  href={process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_URL || 'https://pay.kiwify.com.br/ZgR5Km3'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-slate-800 hover:text-emerald-600 underline"
                >
                  Garantir Acesso Vitalício
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
