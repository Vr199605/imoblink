'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Building2, 
  MessageCircle, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Share2,
  Users
} from 'lucide-react';

const KIWIFY_CHECKOUT_URL = process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_URL || 'https://pay.kiwify.com.br/ZgR5Km3';

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
          <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Feito sob medida para Corretores Autônomos
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Pare de mandar 30 fotos soltas. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Venda imóveis com 1 link no WhatsApp.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
                Crie seu catálogo profissional, compartilhe hotsites de alto padrão com seus clientes e gere lâminas em PDF em 1 clique. Sem complicação.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href={KIWIFY_CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-base"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Garantir Acesso Vitalício</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  href="/c/carlos-silva"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-base"
                >
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span>Ver Catálogo Demonstrativo</span>
                </Link>
              </div>

              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Responsivo no Celular
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Botão WhatsApp c/ Mensagem Pronta
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fichas Comerciais em PDF
                </span>
              </div>
            </div>

            {/* Interactive Preview Mockup */}
            <div className="mt-14 max-w-5xl mx-auto rounded-3xl p-3 bg-slate-900/10 backdrop-blur-xl border border-slate-200/80 shadow-2xl">
              <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner">
                <div className="h-10 bg-slate-950 px-4 flex items-center gap-2 border-b border-slate-800">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <div className="mx-auto text-slate-400 font-mono text-xs truncate max-w-xs">
                    imoblink.app/c/carlos-silva
                  </div>
                </div>
                <div className="p-6 md:p-8 bg-slate-950 text-white">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
                        alt="Corretor"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-lg"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-xl text-white">Carlos Silva</h3>
                          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            CRECI 123.456-F
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Especialista em Alto Padrão • São Paulo - SP</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href="/c/carlos-silva"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Falar no WhatsApp</span>
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                      <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600"
                        alt="Apartamento"
                        className="w-full h-36 object-cover rounded-lg mb-3"
                      />
                      <div className="text-xs text-slate-400">Jardins, São Paulo</div>
                      <div className="font-bold text-sm text-white mt-0.5">Apartamento Alto Padrão</div>
                      <div className="text-emerald-400 font-extrabold text-base mt-1">R$ 1.850.000</div>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                      <img
                        src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=600"
                        alt="Casa"
                        className="w-full h-36 object-cover rounded-lg mb-3"
                      />
                      <div className="text-xs text-slate-400">Alphaville, Barueri</div>
                      <div className="font-bold text-sm text-white mt-0.5">Mansão Contemporânea</div>
                      <div className="text-emerald-400 font-extrabold text-base mt-1">R$ 3.400.000</div>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                      <img
                        src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600"
                        alt="Studio"
                        className="w-full h-36 object-cover rounded-lg mb-3"
                      />
                      <div className="text-xs text-slate-400">Itaim Bibi, São Paulo</div>
                      <div className="font-bold text-sm text-white mt-0.5">Studio Design Mobiliado</div>
                      <div className="text-emerald-400 font-extrabold text-base mt-1">R$ 590.000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Steps Section */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Como funciona na prática?
              </h2>
              <p className="text-slate-600 mt-3 text-base">
                Em apenas 3 passos você transforma a forma como atende seus clientes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 relative">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg mb-6 shadow-md">
                  1
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">Cadastre seu Imóvel</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Adicione fotos, valor, bairro, especificações (quartos, vagas, m²) e diferenciais em menos de 2 minutos pelo próprio celular.
                </p>
              </div>

              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 relative">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg mb-6 shadow-md shadow-emerald-500/20">
                  2
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">Envie o Link no WhatsApp</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Envie 1 link elegante ou texto pronto formatado com emojis. O cliente abre no celular e visualiza todas as fotos organizadas.
                </p>
              </div>

              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 relative">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg mb-6 shadow-md">
                  3
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">Feche Negócios Rápidos</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  O cliente clica no botão do WhatsApp já com a mensagem preenchida ou você gera na hora uma lâmina em PDF para apresentação.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                Vantagens Competitivas
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4">
                Por que corretores fecham mais vendas com o ImobLink?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-lg text-white">Velocidade Instantânea</h4>
                <p className="text-sm text-slate-400">
                  Páginas otimizadas que abrem em menos de 1 segundo em qualquer conexão 4G ou 5G.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-lg text-white">Ficha em PDF em 1 Clique</h4>
                <p className="text-sm text-slate-400">
                  Gere apresentações comerciais com padrão de agência com foto, valor, CRECI e contato.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-lg text-white">Simulador de Financiamento</h4>
                <p className="text-sm text-slate-400">
                  Mostre a estimativa de parcelas na frente do cliente comprador e tire o medo de comprar.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-lg text-white">Autoridade e Selo CRECI</h4>
                <p className="text-sm text-slate-400">
                  Destaque seu número de registro profissional e passe a credibilidade que compradores exigem.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-lg text-white">Disparo Rápido com Emojis</h4>
                <p className="text-sm text-slate-400">
                  Textos formatados automaticamente prontos para colar em grupos de WhatsApp e listas de transmissão.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-lg text-white">Sem Comissões Ocultas</h4>
                <p className="text-sm text-slate-400">
                  Todo o lucro da corretagem é 100% seu. Você paga apenas o plano fixo da ferramenta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Bottom Banner */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Comece a apresentar seus imóveis como um corretor de elite hoje.
            </h2>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              Acesse o painel agora, configure seus dados e crie seu primeiro catálogo em menos de 5 minutos.
            </p>
            <div className="pt-4">
              <a
                href={KIWIFY_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl shadow-2xl text-base transition-all hover:scale-105 active:scale-95"
              >
                <span>Garantir Acesso Vitalício na Kiwify</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
