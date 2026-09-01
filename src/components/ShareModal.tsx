'use client';

import React, { useState } from 'react';
import { Property, BrokerProfile } from '@/types';
import { X, Copy, Check, MessageCircle, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  broker: BrokerProfile;
}

export default function ShareModal({ isOpen, onClose, property, broker }: ShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/c/${broker.slug}/${property.slug}`
    : `https://imoblink.app/c/${broker.slug}/${property.slug}`;

  const formattedWhatsAppText = `🏡 *OPORTUNIDADE: ${property.title.toUpperCase()}*

📍 ${property.neighborhood}, ${property.city} - ${property.state}
💰 *Valor:* R$ ${property.price.toLocaleString('pt-BR')}

📐 ${property.areaM2}m² | 🛏 ${property.bedrooms} Quartos (${property.suites} Suítes) | 🚗 ${property.garageSpots} Vagas

✨ *Destaques:*
${property.tags.map(t => `• ${t}`).join('\n')}

📸 *Fotos e Detalhes Completos:*
${currentUrl}

_Atendimento direto com ${broker.name} (CRECI: ${broker.creci})_`;

  const copyToClipboard = (text: string, type: 'link' | 'text') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const shareViaWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(formattedWhatsAppText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Compartilhar Imóvel</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 my-5">
          {/* Direct Link */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
              Link da Página do Imóvel
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 font-mono select-all focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(currentUrl, 'link')}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Formatted WhatsApp Message */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Texto Pronto com Emojis (WhatsApp)
              </label>
              <button
                onClick={() => copyToClipboard(formattedWhatsAppText, 'text')}
                className="text-xs font-semibold text-brand-700 hover:underline flex items-center gap-1"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-brand-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedText ? 'Texto Copiado!' : 'Copiar Texto'}
              </button>
            </div>
            <textarea
              readOnly
              rows={6}
              value={formattedWhatsAppText}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-3 font-mono leading-relaxed select-all focus:outline-none"
            />
          </div>

          {/* Send direct to WhatsApp */}
          <button
            onClick={shareViaWhatsApp}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Disparar no WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
