'use client';

import React, { useState } from 'react';
import { Property, BrokerProfile } from '@/types';
import { X, Copy, Check, MessageCircle, Share2, QrCode, Download, Printer } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  broker: BrokerProfile;
}

export default function ShareModal({ isOpen, onClose, property, broker }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'qrcode'>('whatsapp');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/c/${broker.slug}/${property.slug}`
    : `https://imoblink.app/c/${broker.slug}/${property.slug}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(currentUrl)}&margin=10`;

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

  const handleDownloadQrCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode-${property.code || property.slug}.png`;
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
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

        {/* Abas de Navegação */}
        <div className="flex p-1 bg-slate-100 rounded-2xl my-4">
          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp & Link</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qrcode')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'qrcode'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>QR Code para Placas</span>
          </button>
        </div>

        {activeTab === 'whatsapp' ? (
          <div className="space-y-4 my-2">
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
                  className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Texto Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={5}
                value={formattedWhatsAppText}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-3 font-mono leading-relaxed select-all focus:outline-none"
              />
            </div>

            {/* Send direct to WhatsApp */}
            <button
              onClick={shareViaWhatsApp}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 text-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Disparar no WhatsApp</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 my-2 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block mx-auto shadow-inner">
              <img
                src={qrCodeUrl}
                alt="QR Code do Imóvel"
                className="w-48 h-48 mx-auto rounded-xl shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <div className="font-extrabold text-sm text-slate-900">{property.title}</div>
              <div className="text-xs text-slate-500">
                {property.neighborhood}, {property.city} • R$ {property.price.toLocaleString('pt-BR')}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Ao apontar a câmera do celular, o cliente abre a página deste imóvel com fotos e seu WhatsApp!
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadQrCode}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-md transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Imagem QR</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-md transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Placa</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
