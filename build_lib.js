const fs = require('fs');
const path = require('path');

const typesContent = `export type PropertyType = 
  | 'apartamento' 
  | 'casa' 
  | 'cobertura' 
  | 'terreno' 
  | 'comercial' 
  | 'chacara';

export type PropertyPurpose = 'venda' | 'aluguel';

export type PropertyStatus = 'disponivel' | 'reservado' | 'vendido';

export interface Property {
  id: string;
  slug: string;
  brokerSlug: string;
  title: string;
  description: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  status: PropertyStatus;
  price: number;
  condoFee?: number;
  iptu?: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  garageSpots: number;
  areaM2: number;
  neighborhood: string;
  city: string;
  state: string;
  addressApprox?: string;
  tags: string[]; // ex: ['Piscina', 'Varanda Gourmet', 'Vista Mar', 'Aceita Permuta']
  images: string[];
  featured?: boolean;
  code: string; // Ex: IB-102
  createdAt: string;
  viewsCount?: number;
}

export interface BrokerProfile {
  id: string;
  slug: string; // ex: 'carlos-silva'
  name: string;
  creci: string;
  phone: string; // Format: 5511999999999
  email: string;
  avatarUrl: string;
  bio: string;
  instagram?: string;
  city: string;
  state: string;
  viewsTotal?: number;
  leadsTotal?: number;
}

export interface FinancingSimulationResult {
  propertyPrice: number;
  downPayment: number;
  financedAmount: number;
  termMonths: number;
  interestRateAnnual: number;
  firstInstallmentSAC: number;
  lastInstallmentSAC: number;
  monthlyInstallmentPrice: number;
  totalInterestSAC: number;
  totalInterestPrice: number;
  minIncomeSuggested: number;
}
`;

const utilsContent = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\\D/g, '');
  if (cleaned.length === 11) {
    return \`(\${cleaned.slice(0, 2)}) \${cleaned.slice(2, 7)}-\${cleaned.slice(7)}\`;
  }
  if (cleaned.length === 13 && cleaned.startsWith('55')) {
    return \`(\${cleaned.slice(2, 4)}) \${cleaned.slice(4, 9)}-\${cleaned.slice(9)}\`;
  }
  return phone;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function buildWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/\\D/g, '');
  const finalPhone = cleanPhone.startsWith('55') ? cleanPhone : \`55\${cleanPhone}\`;
  return \`https://wa.me/\${finalPhone}?text=\${encodeURIComponent(text)}\`;
}
`;

const financeContent = `import { FinancingSimulationResult } from "@/types";

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
`;

const mockDataContent = `import { BrokerProfile, Property } from "@/types";

export const defaultBroker: BrokerProfile = {
  id: "broker-1",
  slug: "carlos-silva",
  name: "Carlos Silva",
  creci: "123.456-F",
  phone: "5511998765432",
  email: "carlos.corretor@imoblink.com.br",
  avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
  bio: "Especialista em imóveis de alto padrão e oportunidades de investimento na Zona Sul e Oeste de São Paulo. Mais de 10 anos conectando famílias ao seu novo lar.",
  instagram: "@carlossilva.imoveis",
  city: "São Paulo",
  state: "SP",
  viewsTotal: 1480,
  leadsTotal: 64
};

export const defaultProperties: Property[] = [
  {
    id: "prop-1",
    slug: "apartamento-luxo-jardins-3-suites",
    brokerSlug: "carlos-silva",
    title: "Apartamento de Alto Padrão nos Jardins",
    description: "Espetacular apartamento totalmente reformado com acabamento impecável. Living amplo integrado à varanda com vista aberta, cozinha gourmet planejada, 3 suítes espaçosas sendo a master com closet e hidromassagem. Condomínio com lazer completo e segurança 24h.",
    type: "apartamento",
    purpose: "venda",
    status: "disponivel",
    price: 1850000,
    condoFee: 1950,
    iptu: 680,
    bedrooms: 3,
    suites: 3,
    bathrooms: 4,
    garageSpots: 3,
    areaM2: 178,
    neighborhood: "Jardins",
    city: "São Paulo",
    state: "SP",
    addressApprox: "Próximo à Rua Oscar Freire",
    tags: ["Varanda Gourmet", "Piscina Aquecida", "Academia Moderna", "Ar Condicionado", "3 Vagas"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1200"
    ],
    featured: true,
    code: "IB-101",
    createdAt: "2026-08-25T10:00:00Z",
    viewsCount: 420
  },
  {
    id: "prop-2",
    slug: "casa-moderna-condominio-alphaville",
    brokerSlug: "carlos-silva",
    title: "Casa Contemporânea em Condomínio Fechado",
    description: "Mansão moderna com arquitetura biofílica, pé direito duplo, ambientes integrados, área gourmet completa com churrasqueira e piscina com borda infinita. Energia solar instalada e automação residencial completa.",
    type: "casa",
    purpose: "venda",
    status: "disponivel",
    price: 3400000,
    condoFee: 1400,
    iptu: 950,
    bedrooms: 4,
    suites: 4,
    bathrooms: 6,
    garageSpots: 4,
    areaM2: 420,
    neighborhood: "Alphaville",
    city: "Barueri",
    state: "SP",
    addressApprox: "Residencial Alphaville Zero",
    tags: ["Piscina com Borda Infinita", "Energia Solar", "Churrasqueira Gourmet", "Pé Direito Duplo", "Segurança Armada 24h"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200"
    ],
    featured: true,
    code: "IB-102",
    createdAt: "2026-08-28T14:30:00Z",
    viewsCount: 580
  },
  {
    id: "prop-3",
    slug: "studio-mobiliado-itaim-bibi",
    brokerSlug: "carlos-silva",
    title: "Studio Design 100% Mobiliado e Decorado",
    description: "Oportunidade perfeita para moradia ou renda com aluguel por temporada (Airbnb). Pronto para morar, marcenaria sob medida, eletrodomésticos em inox, fechadura eletrônica e varanda envidraçada.",
    type: "apartamento",
    purpose: "venda",
    status: "disponivel",
    price: 590000,
    condoFee: 650,
    iptu: 180,
    bedrooms: 1,
    suites: 1,
    bathrooms: 1,
    garageSpots: 1,
    areaM2: 38,
    neighborhood: "Itaim Bibi",
    city: "São Paulo",
    state: "SP",
    addressApprox: "A 2 quadras da Av. Faria Lima",
    tags: ["Mobiliado", "Ideal para Airbnb", "Rooftop com Piscina", "Coworking", "Fechadura Digital"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200"
    ],
    featured: false,
    code: "IB-103",
    createdAt: "2026-08-30T09:15:00Z",
    viewsCount: 310
  },
  {
    id: "prop-4",
    slug: "cobertura-duplex-pinheiros-vista-panoramica",
    brokerSlug: "carlos-silva",
    title: "Cobertura Duplex com Piscina Privativa",
    description: "Cobertura cinematográfica em Pinheiros com vista panorâmica de 360º da cidade. Deck de madeira com piscina aquecida e espaço gourmet no piso superior. 3 suítes amplas e acabamento nobre em mármore.",
    type: "cobertura",
    purpose: "venda",
    status: "disponivel",
    price: 2950000,
    condoFee: 2800,
    iptu: 1100,
    bedrooms: 3,
    suites: 3,
    bathrooms: 5,
    garageSpots: 3,
    areaM2: 245,
    neighborhood: "Pinheiros",
    city: "São Paulo",
    state: "SP",
    addressApprox: "Rua dos Pinheiros",
    tags: ["Piscina Privativa", "Vista 360 Graus", "Deck de Madeira", "Churrasqueira", "Elevador com Biometria"],
    images: [
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200"
    ],
    featured: true,
    code: "IB-104",
    createdAt: "2026-08-31T11:00:00Z",
    viewsCount: 170
  }
];
`;

const storageContent = `import { BrokerProfile, Property } from "@/types";
import { defaultBroker, defaultProperties } from "./mock-data";

const STORAGE_KEYS = {
  BROKER: "imoblink_broker_profile",
  PROPERTIES: "imoblink_properties"
};

export function getBrokerProfile(): BrokerProfile {
  if (typeof window === "undefined") return defaultBroker;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BROKER);
    return data ? JSON.parse(data) : defaultBroker;
  } catch (e) {
    return defaultBroker;
  }
}

export function saveBrokerProfile(profile: BrokerProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.BROKER, JSON.stringify(profile));
}

export function getProperties(): Property[] {
  if (typeof window === "undefined") return defaultProperties;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(defaultProperties));
      return defaultProperties;
    }
    return JSON.parse(data);
  } catch (e) {
    return defaultProperties;
  }
}

export function saveProperty(property: Property): void {
  if (typeof window === "undefined") return;
  const list = getProperties();
  const index = list.findIndex(p => p.id === property.id);
  if (index >= 0) {
    list[index] = property;
  } else {
    list.unshift(property);
  }
  localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(list));
}

export function deleteProperty(id: string): void {
  if (typeof window === "undefined") return;
  const list = getProperties().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(list));
}

export function getPropertyBySlug(slug: string): Property | undefined {
  const list = getProperties();
  return list.find(p => p.slug === slug || p.id === slug);
}

export function incrementPropertyView(id: string): void {
  if (typeof window === "undefined") return;
  const list = getProperties();
  const prop = list.find(p => p.id === id);
  if (prop) {
    prop.viewsCount = (prop.viewsCount || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(list));
  }
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'types', 'index.ts'), typesContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'utils.ts'), utilsContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'finance.ts'), financeContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'mock-data.ts'), mockDataContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'storage.ts'), storageContent, 'utf8');

console.log('Lib & Types files written successfully.');
