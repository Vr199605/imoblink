'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Property, BrokerProfile } from '@/types';
import { getBrokerProfile, getProperties, deleteProperty, updatePropertyStatus } from '@/lib/storage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import { 
  Building2, 
  PlusCircle, 
  Eye, 
  Share2, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Settings, 
  TrendingUp, 
  Users,
  Search,
  Filter,
  MessageCircle,
  QrCode
} from 'lucide-react';
import ShareModal from '@/components/ShareModal';

export default function DashboardPage() {
  const router = useRouter();
  const [broker, setBroker] = useState<BrokerProfile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [copiedCatalog, setCopiedCatalog] = useState(false);
  const [activeShareProperty, setActiveShareProperty] = useState<Property | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const handleStatusChange = async (id: string, newStatus: Property['status']) => {
    await updatePropertyStatus(id, newStatus);
    setProperties((prev) => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  useEffect(() => {
    async function checkAuth() {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setBroker({
            id: profile.id,
            slug: profile.slug,
            name: profile.name,
            creci: profile.creci,
            phone: profile.phone,
            email: profile.email,
            avatarUrl: profile.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
            bio: profile.bio || '',
            city: profile.city || 'São Paulo',
            state: profile.state || 'SP'
          });

          const { data: props } = await supabase
            .from('properties')
            .select('*')
            .eq('broker_slug', profile.slug);

          if (props && props.length > 0) {
            setProperties(props.map(p => ({
              id: p.id,
              slug: p.slug,
              brokerSlug: p.broker_slug,
              title: p.title,
              description: p.description,
              type: p.type,
              purpose: p.purpose,
              status: p.status,
              price: Number(p.price),
              condoFee: Number(p.condo_fee || 0),
              iptu: Number(p.iptu || 0),
              bedrooms: p.bedrooms,
              suites: p.suites,
              bathrooms: p.bathrooms,
              garageSpots: p.garage_spots,
              areaM2: Number(p.area_m2),
              neighborhood: p.neighborhood,
              city: p.city,
              state: p.state,
              tags: p.tags || [],
              images: p.images || [],
              featured: p.featured,
              code: p.code,
              createdAt: p.created_at
            })));
          } else {
            setProperties(getProperties());
          }
        } else {
          setBroker(getBrokerProfile());
          setProperties(getProperties());
        }
      } else {
        setBroker(getBrokerProfile());
        setProperties(getProperties());
      }
      setLoadingAuth(false);
    }

    checkAuth();
  }, [router]);

  if (!broker) return null;

  const catalogUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/c/${broker.slug}`
    : `https://imoblink.app/c/${broker.slug}`;

  const copyCatalogLink = () => {
    navigator.clipboard.writeText(catalogUrl);
    setCopiedCatalog(true);
    setTimeout(() => setCopiedCatalog(false), 2000);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Tem certeza que deseja remover o imóvel "${title}"?`)) {
      deleteProperty(id);
      setProperties(getProperties());
    }
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || p.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalValue = properties.reduce((acc, p) => acc + p.price, 0);
  const totalViews = properties.reduce((acc, p) => acc + (p.viewsCount || 0), 0) + (broker.viewsTotal || 0);

  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50/50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Welcome & Quick Link Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <img
                  src={broker.avatarUrl}
                  alt={broker.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black text-white">{broker.name}</h1>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                      CRECI: {broker.creci}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {broker.city} - {broker.state} • Painel de Gestão Imobiliária
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard/perfil"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  <span>Editar Perfil</span>
                </Link>

                <button
                  onClick={copyCatalogLink}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all"
                >
                  {copiedCatalog ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCatalog ? 'Link Copiado!' : 'Copiar Meu Catálogo'}</span>
                </button>

                <Link
                  href={`/c/${broker.slug}`}
                  target="_blank"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ver Meu Catálogo Público</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold">Imóveis Ativos</div>
                <div className="text-2xl font-black text-slate-900">{properties.length}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold">Volume em Carteira</div>
                <div className="text-xl font-black text-slate-900">{formatCurrency(totalValue)}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold">Visualizações Totais</div>
                <div className="text-2xl font-black text-slate-900">{totalViews}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold">Leads no WhatsApp</div>
                <div className="text-2xl font-black text-slate-900">
                  {properties.reduce((acc, p) => acc + (p.leadsCount || 0), 0) + (broker.leadsTotal || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Property Management Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Meus Imóveis Cadastrados</h2>
                <p className="text-xs text-slate-500">Gerencie, edite e compartilhe seus imóveis</p>
              </div>

              <Link
                href="/dashboard/imoveis/novo"
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Cadastrar Novo Imóvel</span>
              </Link>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por título, bairro ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {['all', 'apartamento', 'casa', 'cobertura', 'terreno', 'comercial'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                      selectedType === t
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t === 'all' ? 'Todos' : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Property List Table / Cards */}
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 text-base">Nenhum imóvel encontrado</h4>
                <p className="text-xs text-slate-400 mt-1">Tente ajustar a busca ou cadastre seu primeiro imóvel.</p>
                <Link
                  href="/dashboard/imoveis/novo"
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  <PlusCircle className="w-4 h-4" /> Cadastrar Imóvel Agora
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
                  >
                    <div>
                      <div className="relative aspect-video bg-slate-100">
                        <img
                          src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
                          {prop.status === 'vendido' ? (
                            <span className="px-2 py-0.5 text-[10px] font-black rounded bg-amber-400 text-slate-950 uppercase tracking-wider shadow">
                              🏆 VENDIDO
                            </span>
                          ) : prop.status === 'reservado' ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-600 text-white uppercase shadow">
                              RESERVADO
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-black/70 text-white uppercase">
                              {prop.type}
                            </span>
                          )}
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-600 text-white shadow">
                            {prop.code}
                          </span>
                          {prop.videoUrl && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-600 text-white shadow">
                              ▶ Vídeo
                            </span>
                          )}
                        </div>

                        <div className="absolute top-2 right-2 flex gap-1 z-10">
                          <div className="bg-black/75 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                            <Eye className="w-3 h-3 text-slate-300" />
                            <span>{prop.viewsCount || 0}</span>
                          </div>
                          <div className="bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                            <MessageCircle className="w-3 h-3 fill-white" />
                            <span>{prop.leadsCount || 0}</span>
                          </div>
                        </div>

                        {prop.status === 'vendido' && (
                          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[0.5px]" />
                        )}
                      </div>

                      <div className="p-4">
                        <div className="text-xs text-slate-400 font-medium">
                          {prop.neighborhood}, {prop.city}
                        </div>
                        <h4 className="font-bold text-slate-900 text-base line-clamp-1 mt-0.5">
                          {prop.title}
                        </h4>
                        <div className="text-lg font-black text-slate-900 mt-2">
                          {formatCurrency(prop.price)}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {prop.areaM2}m² • {prop.bedrooms} qts ({prop.suites} stes) • {prop.garageSpots} vg
                        </div>

                        {/* Quick Status Selector */}
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status:</span>
                          <select
                            value={prop.status}
                            onChange={(e) => handleStatusChange(prop.id, e.target.value as any)}
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer transition-colors ${
                              prop.status === 'vendido'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : prop.status === 'reservado'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            <option value="disponivel">🟢 Disponível</option>
                            <option value="reservado">🟡 Reservado</option>
                            <option value="vendido">🏆 Vendido</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setActiveShareProperty(prop)}
                          className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                          title="Compartilhar & QR Code para Placa"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveShareProperty(prop)}
                          className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                          title="Gerar QR Code para Placa"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/c/${broker.slug}/${prop.slug}`}
                          target="_blank"
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Ver Página Pública"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/dashboard/imoveis/editar/${prop.id}`}
                          className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                          title="Editar Imóvel"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>

                      <button
                        onClick={() => handleDelete(prop.id, prop.title)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Remover Imóvel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {activeShareProperty && (
        <ShareModal
          isOpen={!!activeShareProperty}
          onClose={() => setActiveShareProperty(null)}
          property={activeShareProperty}
          broker={broker}
        />
      )}

      <Footer />
    </>
  );
}
