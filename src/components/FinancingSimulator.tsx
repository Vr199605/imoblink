'use client';

import React, { useState } from 'react';
import { calculateFinancing } from '@/lib/finance';
import { formatCurrency } from '@/lib/utils';
import { Calculator, TrendingDown } from 'lucide-react';

interface FinancingSimulatorProps {
  propertyPrice: number;
}

export default function FinancingSimulator({ propertyPrice }: FinancingSimulatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [termYears, setTermYears] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(10.5);

  const downPaymentValue = (propertyPrice * downPaymentPercent) / 100;
  const simulation = calculateFinancing(
    propertyPrice,
    downPaymentValue,
    termYears * 12,
    interestRate
  );

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-700/50">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg md:text-xl text-white">Simulador de Financiamento</h3>
            <p className="text-xs text-slate-400">Estimativa baseada nas taxas médias dos principais bancos</p>
          </div>
        </div>
        <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold border border-brand-500/20">
          Caixa • Itaú • Santander • Bradesco
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Controls */}
        <div className="space-y-5">
          {/* Valor de Entrada */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300 font-medium">Entrada ({downPaymentPercent}%)</span>
              <span className="font-bold text-brand-400">{formatCurrency(downPaymentValue)}</span>
            </div>
            <div className="flex gap-2 mb-2">
              {[10, 20, 30, 40, 50].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setDownPaymentPercent(pct)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    downPaymentPercent === pct
                      ? 'bg-brand-500 border-brand-400 text-slate-950 shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
          </div>

          {/* Prazo */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300 font-medium">Prazo de Pagamento</span>
              <span className="font-bold text-white">{termYears} anos ({termYears * 12} meses)</span>
            </div>
            <div className="flex gap-2">
              {[15, 20, 25, 30, 35].map((years) => (
                <button
                  key={years}
                  onClick={() => setTermYears(years)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    termYears === years
                      ? 'bg-brand-500 border-brand-400 text-slate-950 shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {years}a
                </button>
              ))}
            </div>
          </div>

          {/* Taxa de Juros Anual */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300 font-medium">Taxa de Juros Anual Estimada</span>
              <span className="font-bold text-white">{interestRate}% a.a.</span>
            </div>
            <input
              type="range"
              min="8.5"
              max="13.5"
              step="0.25"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>8.5% (MCMV / SFH)</span>
              <span>10.5% (Média Mercado)</span>
              <span>13.5% (SFI)</span>
            </div>
          </div>
        </div>

        {/* Results Cards */}
        <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/80 space-y-4">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
            Comparativo de Parcelas
          </div>

          {/* SAC Result */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-brand-500/30 relative overflow-hidden">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wide flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" /> Tabela SAC (Decrescente)
              </span>
              <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded font-bold">
                Mais Usada
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-white">
                {formatCurrency(simulation.firstInstallmentSAC)}
              </span>
              <span className="text-xs text-slate-400">1ª parcela</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Última parcela estimada em <span className="text-emerald-400 font-semibold">{formatCurrency(simulation.lastInstallmentSAC)}</span>
            </div>
          </div>

          {/* PRICE Result */}
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/60">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
              Tabela PRICE (Parcelas Fixas)
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-bold text-white">
                {formatCurrency(simulation.monthlyInstallmentPrice)}
              </span>
              <span className="text-xs text-slate-400">/mês fixo</span>
            </div>
          </div>

          {/* Renda Mínima Recomendada */}
          <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Renda bruta familiar sugerida:</span>
            <span className="font-bold text-emerald-400">
              {formatCurrency(simulation.minIncomeSuggested)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
