'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Property } from '@/types';
import { getPropertyBySlug, saveProperty } from '@/lib/storage';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;

  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (propertyId) {
      const prop = getPropertyBySlug(propertyId);
      if (prop) {
        setProperty(prop);
      }
    }
  }, [propertyId]);

  if (!property) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto p-12 text-center text-slate-500">
          Carregando imóvel...
        </div>
        <Footer />
      </>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProperty(property);
    router.push('/dashboard');
  };

  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50/50 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar aos Imóveis</span>
            </Link>

            <h1 className="text-xl font-black text-slate-900">Editar Imóvel (Ref: {property.code})</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                Informações Básicas
              </h3>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Título do Imóvel
                </label>
                <input
                  type="text"
                  value={property.title}
                  onChange={(e) => setProperty({ ...property, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    value={property.price}
                    onChange={(e) => setProperty({ ...property, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-black text-emerald-700"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={property.neighborhood}
                    onChange={(e) => setProperty({ ...property, neighborhood: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Área (m²)
                  </label>
                  <input
                    type="number"
                    value={property.areaM2}
                    onChange={(e) => setProperty({ ...property, areaM2: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Status do Imóvel
                </label>
                <select
                  value={property.status}
                  onChange={(e) => setProperty({ ...property, status: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  <option value="disponivel">🟢 Disponível para Venda</option>
                  <option value="reservado">🟡 Reservado (Em Proposta)</option>
                  <option value="vendido">🏆 Vendido com Sucesso</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Link do Tour em Vídeo (YouTube / Reels)
                </label>
                <input
                  type="url"
                  value={property.videoUrl || ''}
                  onChange={(e) => setProperty({ ...property, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                Descrição
              </label>
              <textarea
                rows={4}
                value={property.description}
                onChange={(e) => setProperty({ ...property, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
