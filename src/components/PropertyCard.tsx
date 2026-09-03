'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Property, BrokerProfile } from '@/types';
import { formatCurrency, buildWhatsAppUrl } from '@/lib/utils';
import { incrementPropertyLead } from '@/lib/storage';
import { Bed, Bath, Square, Car, MapPin, Share2, MessageCircle } from 'lucide-react';
import ShareModal from './ShareModal';

interface PropertyCardProps {
  property: Property;
  broker: BrokerProfile;
}

export default function PropertyCard({ property, broker }: PropertyCardProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const mainImage = property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800';

  const defaultMessage = `Olá ${broker.name}! Vi o imóvel "${property.title}" (Ref: ${property.code}) no seu catálogo e gostaria de mais informações e fotos.`;
  const whatsappUrl = buildWhatsAppUrl(broker.phone, defaultMessage);

  return (
    <>
      <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <Link href={`/c/${broker.slug}/${property.slug}`}>
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
          
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {property.status === 'vendido' ? (
              <span className="px-2.5 py-1 text-xs font-black rounded-lg bg-amber-400 text-slate-950 shadow-md uppercase tracking-wider flex items-center gap-1">
                🏆 VENDIDO
              </span>
            ) : property.status === 'reservado' ? (
              <span className="px-2.5 py-1 text-xs font-black rounded-lg bg-amber-600 text-white shadow-md uppercase tracking-wider">
                RESERVADO
              </span>
            ) : (
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900/80 backdrop-blur-md text-white shadow-sm uppercase tracking-wide">
                {property.type}
              </span>
            )}

            {property.featured && property.status === 'disponivel' && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600/90 backdrop-blur-md text-white shadow-sm flex items-center gap-1">
                ★ Destaque
              </span>
            )}

            {property.videoUrl && (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-rose-600 text-white shadow-sm flex items-center gap-1">
                ▶ Vídeo
              </span>
            )}
          </div>

          {property.status === 'vendido' && (
            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[0.5px] pointer-events-none" />
          )}

          <div className="absolute top-3 right-3 flex gap-1.5 z-10">
            <button
              onClick={() => setIsShareOpen(true)}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-emerald-600 hover:bg-white flex items-center justify-center shadow-md transition-transform active:scale-95"
              title="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-black/60 text-white backdrop-blur-sm">
              Ref: {property.code}
            </span>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{property.neighborhood}, {property.city} - {property.state}</span>
            </div>

            <Link href={`/c/${broker.slug}/${property.slug}`}>
              <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-emerald-600 transition-colors line-clamp-1 mb-2">
                {property.title}
              </h3>
            </Link>

            <div className="text-2xl font-black text-slate-900 mb-4">
              {formatCurrency(property.price)}
              {property.condoFee ? (
                <span className="text-xs font-normal text-slate-500 ml-2">
                  Cond. {formatCurrency(property.condoFee)}
                </span>
              ) : null}
            </div>

            <div className="grid grid-cols-4 gap-2 py-3 border-y border-slate-100 text-slate-600 text-xs font-medium">
              <div className="flex flex-col items-center justify-center text-center">
                <Bed className="w-4 h-4 text-slate-400 mb-1" />
                <span>{property.bedrooms} {property.bedrooms === 1 ? 'Quarto' : 'Qts'}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Bath className="w-4 h-4 text-slate-400 mb-1" />
                <span>{property.bathrooms} {property.bathrooms === 1 ? 'Banho' : 'Banhos'}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Car className="w-4 h-4 text-slate-400 mb-1" />
                <span>{property.garageSpots} {property.garageSpots === 1 ? 'Vaga' : 'Vagas'}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Square className="w-4 h-4 text-slate-400 mb-1" />
                <span>{property.areaM2} m²</span>
              </div>
            </div>

            {property.tags && property.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {property.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))}
                {property.tags.length > 3 && (
                  <span className="text-[11px] text-slate-400 self-center">
                    +{property.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex gap-2">
            <Link
              href={`/c/${broker.slug}/${property.slug}`}
              className="flex-1 text-center py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Ver Detalhes
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => incrementPropertyLead(property.id)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        property={property}
        broker={broker}
      />
    </>
  );
}
