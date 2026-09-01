'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Sparkles, User, PlusCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Imob<span className="text-brand-600">Link</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-800 border border-brand-200">
              Pro
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/c/carlos-silva"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            <Sparkles className="w-4 h-4 text-brand-600" />
            Ver Exemplo de Catálogo
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            <User className="w-4 h-4" />
            <span>Painel do Corretor</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
