
export interface Player {
  id: string;
  name: string;
  clubName: string;
  cash: number;
  netWorth: number;
  avatarUrl: string;
  avatarHint: string;
  cumulativeNpvEarned: number;
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

export interface MarketEventImpact {
  cashChange?: number; // Absolute change in cash
  netWorthChange?: number; // Absolute change in net worth
  cashPercentageChange?: number; // e.g., 0.1 for +10%, -0.05 for -5% applied to current cash
  netWorthPercentageChange?: number; // e.g., 0.05 for +5%, -0.10 for -10% applied to current net worth
}

export interface MarketEvent {
  id: string;
  title: string;
  description: string; // General description of what happened
  impact: MarketEventImpact;
  // Generates a specific message about the impact on the player
  getImpactPlayerMessage: (
    playerName: string,
    actualCashChange: number,
    actualNetWorthChange: number
  ) => string;
  variant: 'default' | 'destructive';
}
