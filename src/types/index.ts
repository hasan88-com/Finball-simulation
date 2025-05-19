export interface Player {
  id: string;
  name: string;
  clubName: string;
  cash: number;
  netWorth: number;
  avatarUrl: string;
  avatarHint: string;
}

export interface InvestmentOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  expectedAnnualCashFlow: number;
  durationYears: number;
  discountRate: number;
  imageUrl: string;
  imageHint: string;
}

export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  impactDescription: string;
  variant: 'default' | 'destructive';
}
