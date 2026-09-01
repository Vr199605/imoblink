import { FinancingSimulationResult } from "@/types";

export function calculateFinancing(
  propertyPrice: number,
  downPayment: number,
  termMonths: number = 360,
  annualInterestRate: number = 10.5
): FinancingSimulationResult {
  const financedAmount = Math.max(0, propertyPrice - downPayment);
  const monthlyRate = Math.pow(1 + annualInterestRate / 100, 1 / 12) - 1;

  // Cálculo Tabela SAC
  const amortizationSAC = financedAmount / termMonths;
  const firstInterestSAC = financedAmount * monthlyRate;
  const firstInstallmentSAC = amortizationSAC + firstInterestSAC;
  
  const lastInterestSAC = amortizationSAC * monthlyRate;
  const lastInstallmentSAC = amortizationSAC + lastInterestSAC;
  
  const totalPaidSAC = ((firstInstallmentSAC + lastInstallmentSAC) / 2) * termMonths;
  const totalInterestSAC = totalPaidSAC - financedAmount;

  // Cálculo Tabela PRICE
  let monthlyInstallmentPrice = 0;
  if (monthlyRate > 0) {
    monthlyInstallmentPrice = 
      (financedAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
  } else {
    monthlyInstallmentPrice = financedAmount / termMonths;
  }
  
  const totalPaidPrice = monthlyInstallmentPrice * termMonths;
  const totalInterestPrice = totalPaidPrice - financedAmount;

  // Renda mínima recomendada (parcela não deve exceder 30% da renda bruta familiar)
  const minIncomeSuggested = (Math.max(firstInstallmentSAC, monthlyInstallmentPrice) / 0.3);

  return {
    propertyPrice,
    downPayment,
    financedAmount,
    termMonths,
    interestRateAnnual: annualInterestRate,
    firstInstallmentSAC,
    lastInstallmentSAC,
    monthlyInstallmentPrice,
    totalInterestSAC,
    totalInterestPrice,
    minIncomeSuggested
  };
}
