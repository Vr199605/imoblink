export type PropertyType = 
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
  leadsCount?: number;
  videoUrl?: string;
}

export type ThemeColor = 'emerald' | 'blue' | 'amber' | 'slate' | 'rose';

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
  themeColor?: ThemeColor;
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
