const fs = require('fs');
const path = require('path');

const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }

  body {
    @apply bg-slate-50 text-slate-900 antialiased font-sans;
  }
}

/* Print styling for PDF generation */
@media print {
  body {
    background: white !important;
    color: black !important;
  }
  .no-print {
    display: none !important;
  }
  .print-only {
    display: block !important;
  }
}

.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
`;

const layoutContent = `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImobLink — Catálogo Digital & Fichas de Imóveis para Corretores",
  description: "Crie páginas de alta conversão para seus imóveis em 2 minutos e venda muito mais pelo WhatsApp.",
  openGraph: {
    title: "ImobLink — Catálogo Digital para Corretores Autônomos",
    description: "Páginas profissionais para imóveis, fichas em PDF e atendimento rápido no WhatsApp.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
`;

const headerContent = `'use client';

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
`;

const footerContent = `import React from 'react';
import Link from 'next/link';
import { Building2, Heart, ShieldCheck, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Imob<span className="text-brand-400">Link</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              A plataforma definitiva para corretores autônomos apresentarem imóveis com padrão de luxo, compartilharem links no WhatsApp e gerarem fichas em PDF em 1 clique.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Início</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">Painel do Corretor</Link>
              </li>
              <li>
                <Link href="/c/carlos-silva" className="hover:text-white transition-colors">Exemplo de Catálogo Público</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Diferenciais</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-brand-400" /> Rápido e Mobile-First</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-brand-400" /> Selo CRECI Verificado</li>
              <li className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-brand-400" /> PDF pronto para envio</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center sm:flex sm:justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ImobLink Tecnologia Imobiliária. Feito para corretores que vendem mais.</p>
          <p className="mt-2 sm:mt-0 flex items-center justify-center gap-1">
            Desenvolvido com <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para o mercado imobiliário
          </p>
        </div>
      </div>
    </footer>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'app', 'globals.css'), globalsCss, 'utf8');
fs.writeFileSync(path.join(__dirname, 'src', 'app', 'layout.tsx'), layoutContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'Header.tsx'), headerContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'Footer.tsx'), footerContent, 'utf8');

console.log('Globals, Layout, Header, Footer written.');
