import React from 'react';
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
