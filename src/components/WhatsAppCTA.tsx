'use client';

import React from 'react';
import { Property, BrokerProfile } from '@/types';
import { buildWhatsAppUrl, formatCurrency } from '@/lib/utils';
import { MessageCircle, ShieldCheck, Clock } from 'lucide-react';

interface WhatsAppCTAProps {
  property: Property;
  broker: BrokerProfile;
  variant?: 'inline' | 'sticky';
}

export default function WhatsAppCTA({ property, broker, variant = 'inline' }: WhatsAppCTAProps) {
  const defaultMessage = `Olá ${broker.name}! Gostei muito do imóvel "${property.title}" (Ref: ${property.code}) no valor de ${formatCurrency(property.price)} e gostaria de agendar uma visita!`;
  const whatsappUrl = buildWhatsAppUrl(broker.phone, defaultMessage);

  if (variant === 'sticky') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 md:hidden shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Valor de venda</div>
            <div className="text-lg font-black text-slate-900">{formatCurrency(property.price)}</div>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-6">
      {/* Broker Profile Card */}
      <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
        <div className="relative">
          <img
            src={broker.avatarUrl}
            alt={broker.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="font-extrabold text-slate-900 text-lg">{broker.name}</h4>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            CRECI: {broker.creci}
          </span>
          <p className="text-xs text-slate-500 mt-1">{broker.city}, {broker.state}</p>
        </div>
      </div>

      <div className="space-y-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>Atendimento rápido e direto com o corretor responsável.</span>
        </div>
      </div>

      {/* Main WhatsApp CTA */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-95 text-base"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span>Falar no WhatsApp Agora</span>
      </a>
    </div>
  );
}
