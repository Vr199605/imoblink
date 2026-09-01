'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Sparkles, User, LogOut, LogIn } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { getBrokerProfile } from '@/lib/storage';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [brokerSlug, setBrokerSlug] = useState('carlos-silva');

  useEffect(() => {
    const profile = getBrokerProfile();
    if (profile && profile.slug) {
      setBrokerSlug(profile.slug);
    }

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setIsLoggedIn(Boolean(session));
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsLoggedIn(Boolean(session));
      });

      return () => subscription.unsubscribe();
    } else {
      // Em modo local, consideramos logado se houver perfil
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Imob<span className="text-emerald-600">Link</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              Pro
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href={`/c/${brokerSlug}`}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ver Cat�logo P�blico</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            <User className="w-3.5 h-3.5" />
            <span>Meu Painel</span>
          </Link>

          <Link
            href="/cadastro"
            className="hidden md:flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl transition-all shadow-sm"
          >
            <span>Criar Conta</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
