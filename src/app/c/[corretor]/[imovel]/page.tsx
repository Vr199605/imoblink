'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyGallery from '@/components/PropertyGallery';
import FinancingSimulator from '@/components/FinancingSimulator';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import PdfExportModal from '@/components/PdfExportModal';
import ShareModal from '@/components/ShareModal';
import { Property, BrokerProfile } from '@/types';
import { getBrokerProfile, getPropertyBySlug, incrementPropertyView } from '@/lib/storage';
import { formatCurrency } from '@/lib/utils';
import { 
  Bed, 
  Bath, 
  Square, 
  Car, 
  MapPin, 
  Share2, 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Eye,
  Info,
  Video,
  MessageCircle,
  Play
} from 'lucide-react';

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const corretorSlug = params?.corretor as string;
  const imovelSlug = params?.imovel as string;

  const [broker, setBroker] = useState<BrokerProfile | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    const b = getBrokerProfile();
    setBroker(b);

    if (imovelSlug) {
      const prop = getPropertyBySlug(imovelSlug);
      if (prop) {
        setProperty(prop);
        incrementPropertyView(prop.id);
      }
    }
  }, [corretorSlug, imovelSlug]);

  if (!broker || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Carregando detalhes do imóvel...
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50/70 pb-24 md:pb-16">
        
        {/* Top Breadcrumb & Actions Bar */}
        <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <Link
              href={`/c/${broker.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver todos os imóveis de {broker.name}</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShareOpen(true)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compartilhar</span>
              </button>

              <button
                onClick={() => setIsPdfOpen(true)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Baixar Ficha em PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
          
          {/* Title & Price Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {property.status === 'vendido' ? (
                  <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1.5">
                    🏆 VENDIDO COM SUCESSO
                  </span>
                ) : property.status === 'reservado' ? (
                  <span className="px-3 py-1 bg-amber-600 text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sm">
                    🔒 RESERVADO (PROPOSTA EM ANDAMENTO)
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg">
                    {property.type} • {property.purpose}
                  </span>
                )}

                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold rounded-lg">
                  Ref: {property.code}
                </span>

                {property.featured && property.status === 'disponivel' && (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg">
                    ★ Oportunidade Exclusiva
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {property.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{property.neighborhood}, {property.city} - {property.state}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{property.viewsCount || 0} visualizações</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <MessageCircle className="w-3.5 h-3.5 fill-emerald-600" />
                    <span>{property.leadsCount || 0} interessados</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="md:text-right bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl border md:border-0 border-slate-200">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Valor de Venda
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                {formatCurrency(property.price)}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1 flex md:justify-end gap-3">
                {property.condoFee && <span>Cond.: {formatCurrency(property.condoFee)}/m²s</span>}
                {property.iptu && <span>IPTU: {formatCurrency(property.iptu)}/ano</span>}
              </div>
            </div>
          </div>

          {/* Main Grid: Gallery & Details on Left, Sticky Sidebar on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (2 Cols) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Photo Gallery */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm">
                <PropertyGallery images={property.images} title={property.title} />
              </div>

              {/* Main Specifications Bar */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Especificações Principais
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                      <Square className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold">Área Útil</div>
                      <div className="text-base font-black text-slate-900">{property.areaM2} m²</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                      <Bed className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold">Quartos</div>
                      <div className="text-base font-black text-slate-900">{property.bedrooms} ({property.suites} stes)</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                      <Bath className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold">Banheiros</div>
                      <div className="text-base font-black text-slate-900">{property.bathrooms}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold">Vagas</div>
                      <div className="text-base font-black text-slate-900">{property.garageSpots}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tour em Vídeo do Imóvel */}
              {property.videoUrl && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <span>Tour em Vídeo do Imóvel</span>
                  </div>

                  {getYouTubeEmbedUrl(property.videoUrl) ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md bg-black">
                      <iframe
                        src={getYouTubeEmbedUrl(property.videoUrl)!}
                        title={`Tour em vídeo: ${property.title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                      <p className="text-xs text-slate-600">Assista ao tour em vídeo deste imóvel:</p>
                      <a
                        href={property.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Abrir Vídeo / Reels Externo</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-slate-900">Sobre o Imóvel</h3>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>

                {property.tags && property.tags.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Comodidades e Diferenciais
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {property.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Financing Simulator */}
              <FinancingSimulator propertyPrice={property.price} />
            </div>

            {/* Right Column: Sticky WhatsApp & Broker Box */}
            <div className="space-y-6">
              <div className="sticky top-32">
                <WhatsAppCTA property={property} broker={broker} />
                
                {/* Security and Trust Badge */}
                <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 flex items-start gap-3 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Corretor Credenciado e Verificado</div>
                    <p className="text-emerald-700 mt-0.5">
                      Negocie direto com o profissional responsável ({broker.name} - CRECI {broker.creci}).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky WhatsApp Bar */}
        <WhatsAppCTA property={property} broker={broker} variant="sticky" />
      </main>

      <PdfExportModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        property={property}
        broker={broker}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        property={property}
        broker={broker}
      />

      <Footer />
    </>
  );
}
