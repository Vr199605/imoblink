'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { Property, BrokerProfile } from '@/types';
import { getBrokerProfile, getProperties } from '@/lib/storage';
import { formatPhoneNumber, buildWhatsAppUrl } from '@/lib/utils';
import { 
  Building2, 
  ShieldCheck, 
  MessageCircle, 
  Instagram, 
  MapPin, 
  Phone, 
  Search, 
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

export default function BrokerPublicCatalogPage() {
  const params = useParams();
  const corretorSlug = params?.corretor as string;

  const [broker, setBroker] = useState<BrokerProfile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'disponiveis' | 'vendidos'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(10000000);

  useEffect(() => {
    const b = getBrokerProfile();
    const props = getProperties();
    setBroker(b);
    setProperties(props);
  }, [corretorSlug]);

  if (!broker) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Carregando catálogo...
      </div>
    );
  }

  const directWhatsAppUrl = buildWhatsAppUrl(
    broker.phone,
    `Olá ${broker.name}! Acessei seu catálogo digital e gostaria de tirar algumas dúvidas sobre imóveis disponíveis na sua carteira.`
  );

  const getThemeClasses = (themeColor?: string) => {
    switch (themeColor) {
      case 'blue':
        return {
          border: 'border-blue-500',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30',
          accent: 'text-blue-400'
        };
      case 'amber':
        return {
          border: 'border-amber-500',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30',
          accent: 'text-amber-400'
        };
      case 'slate':
        return {
          border: 'border-slate-600',
          badge: 'bg-slate-700/50 text-slate-200 border-slate-600',
          btn: 'bg-slate-950 hover:bg-slate-900 shadow-slate-950/30',
          accent: 'text-slate-300'
        };
      case 'rose':
        return {
          border: 'border-rose-600',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          btn: 'bg-rose-700 hover:bg-rose-800 shadow-rose-700/30',
          accent: 'text-rose-400'
        };
      default:
        return {
          border: 'border-emerald-500',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30',
          accent: 'text-emerald-400'
        };
    }
  };

  const theme = getThemeClasses(broker.themeColor);

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || p.type === selectedType;
    const matchesPurpose = selectedPurpose === 'all' || p.purpose === selectedPurpose;
    const matchesPrice = p.price <= maxPrice;
    const matchesStatus = 
      selectedStatus === 'all' || 
      (selectedStatus === 'disponiveis' && (p.status === 'disponivel' || p.status === 'reservado')) ||
      (selectedStatus === 'vendidos' && p.status === 'vendido');

    return matchesSearch && matchesType && matchesPurpose && matchesPrice && matchesStatus;
  });

  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50/70 pb-20">
        {/* Broker Hero Header */}
        <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-10 pb-16 px-4 border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={broker.avatarUrl}
                  alt={broker.name}
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 ${theme.border} shadow-2xl`}
                />
                <div className={`absolute -bottom-2 -right-2 ${theme.btn.split(' ')[0]} text-white p-1.5 rounded-full shadow-lg`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {broker.name}
                  </h1>
                  <span className={`inline-flex items-center gap-1 text-xs font-bold ${theme.badge} px-3 py-1 rounded-full border`}>
                    <ShieldCheck className="w-3.5 h-3.5" /> CRECI: {broker.creci}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {broker.city} - {broker.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {formatPhoneNumber(broker.phone)}
                  </span>
                  {broker.instagram && (
                    <span className={`flex items-center gap-1 ${theme.accent}`}>
                      <Instagram className="w-3.5 h-3.5" />
                      {broker.instagram}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed pt-1">
                  {broker.bio}
                </p>
              </div>
            </div>

            {/* Direct Contact Button */}
            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-3.5 ${theme.btn} text-white text-xs font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-105 active:scale-95`}
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Falar com o Corretor</span>
              </a>
            </div>
          </div>
        </section>

        {/* Catalog Search & Filters Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/80 space-y-4">
            
            {/* Search Input and Filters */}
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por bairro, condomínio ou palavra-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Status Filter */}
              <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 self-start sm:self-auto">
                <button
                  onClick={() => setSelectedStatus('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSelectedStatus('disponiveis')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    selectedStatus === 'disponiveis' ? 'bg-white text-emerald-700 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🟢 Disponíveis</span>
                </button>
                <button
                  onClick={() => setSelectedStatus('vendidos')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    selectedStatus === 'vendidos' ? 'bg-white text-amber-700 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🏆 Vendidos</span>
                </button>
              </div>

              {/* Purpose Filter */}
              <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 self-start sm:self-auto">
                <button
                  onClick={() => setSelectedPurpose('all')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedPurpose === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSelectedPurpose('venda')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedPurpose === 'venda' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Venda
                </button>
                <button
                  onClick={() => setSelectedPurpose('aluguel')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedPurpose === 'aluguel' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Aluguel
                </button>
              </div>
            </div>

            {/* Type Tags */}
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {[
                { id: 'all', label: 'Todos os Imóveis' },
                { id: 'apartamento', label: 'Apartamentos' },
                { id: 'casa', label: 'Casas' },
                { id: 'cobertura', label: 'Coberturas' },
                { id: 'terreno', label: 'Terrenos' },
                { id: 'comercial', label: 'Comerciais' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedType(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                    selectedType === item.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Property Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Imóveis Disponíveis ({filteredProperties.length})
              </h2>
              <p className="text-xs text-slate-500">
                Selecione um imóvel para ver a galeria de fotos completa e falar direto com o corretor
              </p>
            </div>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-lg">Nenhum imóvel encontrado com estes filtros</h3>
              <p className="text-xs text-slate-400 mt-1">
                Tente limpar os termos da busca ou clique abaixo para ver todos os imóveis da carteira.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedPurpose('all');
                }}
                className="mt-4 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} broker={broker} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
