'use client';

import React, { useRef, useState } from 'react';
import { Property, BrokerProfile } from '@/types';
import { formatCurrency, formatPhoneNumber, generateSlug } from '@/lib/utils';
import { FileText, X, Printer, MapPin, Download, AlertCircle } from 'lucide-react';

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

  if (!isOpen) return null;

  // Gera e baixa um arquivo PDF de verdade (sem depender da caixa de diálogo
  // de impressão do navegador, que em alguns navegadores/apps abre uma nova
  // aba/pré-visualização sem opção de fechar).
  const handleDownloadPdf = async () => {
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
    } catch (err) {
      console.error('Falha ao gerar PDF:', err);
      setError('Não foi possível gerar o arquivo PDF. Você pode tentar imprimir a ficha como alternativa.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Ficha Comercial do Imóvel (PDF)</h3>
              <p className="text-xs text-slate-500">Pronta para baixar ou imprimir e enviar ao cliente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3 my-4 no-print">
          <button
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? 'Gerando PDF...' : 'Baixar Ficha em PDF'}</span>
          </button>
          <button
            onClick={handlePrint}
            disabled={isGenerating}
            className="sm:flex-none py-3 px-5 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>
        </div>

        {error && (
          <div className="no-print mb-4 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Printable PDF Sheet */}
        <div
          ref={printAreaRef}
          className="print-area border border-slate-200 rounded-2xl p-6 bg-white shadow-sm space-y-6 text-slate-800"
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

          {/* Footer Broker Info */}
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
            <div className="text-right text-[10px] text-slate-400">
              Imóvel sujeito a disponibilidade.<br />
              Gerado via ImobLink Pro.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
