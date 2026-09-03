'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Property, BrokerProfile } from '@/types';
import { formatCurrency, formatPhoneNumber, generateSlug } from '@/lib/utils';
import { X, MapPin, AlertCircle, Loader2 } from 'lucide-react';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  broker: BrokerProfile;
}

export default function PdfExportModal({ isOpen, onClose, property, broker }: PdfExportModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  // Assim que o botão "Baixar Ficha em PDF" é clicado (isOpen vira true), o
  // PDF já é gerado e baixado direto — sem exibir nenhuma pré-visualização
  // antes. A ficha em si é renderizada fora da tela, só para servir de
  // "arte" para o html2canvas capturar.
  useEffect(() => {
    if (!isOpen) {
      startedRef.current = false;
      setError(null);
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;
    generateAndDownload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const generateAndDownload = async () => {
    if (!printAreaRef.current) return;

    setIsGenerating(true);
    setError(null);

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(printAreaRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `ficha-${generateSlug(property.code || property.title)}.pdf`;
      pdf.save(fileName);

      setIsGenerating(false);
      onClose();
    } catch (err) {
      console.error('Falha ao gerar PDF:', err);
      setIsGenerating(false);
      setError('Não foi possível gerar o arquivo PDF. Tente novamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Indicador de progresso / erro. Fica no canto da tela e nunca
          bloqueia a navegação — some sozinho assim que o download começa. */}
      {(isGenerating || error) && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 sm:max-w-sm no-print">
          {isGenerating && (
            <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span className="text-sm font-semibold">Gerando PDF da ficha...</span>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 bg-white border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-2xl">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="text-xs flex-1">{error}</span>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="text-red-400 hover:text-red-700 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Ficha renderizada fora da área visível da tela — usada apenas como
          fonte para gerar a imagem/PDF, nunca é exibida ao usuário. */}
      <div className="fixed top-0 left-[-9999px]" aria-hidden="true">
        <div
          ref={printAreaRef}
          className="w-[768px] border border-slate-200 rounded-2xl p-6 bg-white shadow-sm space-y-6 text-slate-800"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b-2 border-slate-900">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">
                Ficha de Apresentação Exclusiva
              </div>
              <h1 className="text-2xl font-black text-slate-900">{property.title}</h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{property.neighborhood}, {property.city} - {property.state} (Ref: {property.code})</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-semibold uppercase">Valor de Venda</div>
              <div className="text-2xl font-black text-emerald-700">
                {formatCurrency(property.price)}
              </div>
              {property.condoFee && (
                <div className="text-xs text-slate-500">Cond.: {formatCurrency(property.condoFee)}</div>
              )}
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-3 gap-2 h-56 overflow-hidden rounded-xl">
            <div className="col-span-2 h-full">
              <img
                src={property.images[0]}
                alt={property.title}
                crossOrigin="anonymous"
                className="w-full h-full object-cover rounded-l-xl"
              />
            </div>
            <div className="grid grid-rows-2 gap-2 h-full">
              <img
                src={property.images[1] || property.images[0]}
                alt="Foto 2"
                crossOrigin="anonymous"
                className="w-full h-full object-cover rounded-tr-xl"
              />
              <img
                src={property.images[2] || property.images[0]}
                alt="Foto 3"
                crossOrigin="anonymous"
                className="w-full h-full object-cover rounded-br-xl"
              />
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Área Útil</div>
              <div className="text-lg font-black text-slate-900">{property.areaM2} m²</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Quartos</div>
              <div className="text-lg font-black text-slate-900">{property.bedrooms} ({property.suites} suítes)</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Banheiros</div>
              <div className="text-lg font-black text-slate-900">{property.bathrooms}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Vagas</div>
              <div className="text-lg font-black text-slate-900">{property.garageSpots}</div>
            </div>
          </div>

          {/* Description & Tags */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Descrição do Imóvel</h4>
            <p className="text-xs text-slate-700 leading-relaxed">{property.description}</p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {property.tags.map((tag, i) => (
                <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Broker Info & QR Code */}
          <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src={broker.avatarUrl}
                alt={broker.name}
                crossOrigin="anonymous"
                className="w-12 h-12 rounded-xl object-cover border border-slate-300"
              />
              <div>
                <div className="font-extrabold text-sm text-slate-900">{broker.name}</div>
                <div className="text-xs font-semibold text-emerald-700">CRECI: {broker.creci}</div>
                <div className="text-xs text-slate-600">{formatPhoneNumber(broker.phone)} • {broker.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right text-[10px] text-slate-500">
                <div className="font-bold text-slate-800">Acesse no Celular</div>
                <span>Escaneie para mais fotos<br />e simulação completa</span>
              </div>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                  typeof window !== 'undefined'
                    ? `${window.location.origin}/c/${broker.slug}/${property.slug}`
                    : `https://imoblink.app/c/${broker.slug}/${property.slug}`
                )}`}
                alt="QR Code Imóvel"
                crossOrigin="anonymous"
                className="w-14 h-14 rounded-lg border border-slate-200 p-0.5 bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
