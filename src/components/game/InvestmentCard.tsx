
"use client";

import type { InvestmentOption } from '@/types';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculateNPV, formatCurrency } from '@/lib/game-utils';
import { Banknote, Briefcase, CalendarDays, BarChartBig, Percent, TrendingUp, TrendingDown } from 'lucide-react'; // Removed Users
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface InvestmentCardProps {
  investment: InvestmentOption;
  onInvest: (investment: InvestmentOption, npv: number) => void;
  isCurrentPlayerTurn: boolean; 
  isSelectedByDice: boolean; 
  isGameEnded: boolean;
  isTradeOffActive: boolean;
  isBeingTraded?: boolean;
  investingPlayerId?: string; 
}

export default function InvestmentCard({ 
  investment, 
  onInvest, 
  isCurrentPlayerTurn, 
  isSelectedByDice, 
  isGameEnded,
  isTradeOffActive,
  isBeingTraded,
  investingPlayerId,
}: InvestmentCardProps) {
  const [calculatedNpv, setCalculatedNpv] = useState<number | null>(null);
  const [showNpv, setShowNpv] = useState(false);
  const { toast } = useToast();
  
  const effectiveCanInteract = (isCurrentPlayerTurn && isSelectedByDice && !isGameEnded && !isTradeOffActive && !isBeingTraded) || 
                               (isCurrentPlayerTurn && isSelectedByDice && !isGameEnded && !!investingPlayerId && !isTradeOffActive && !isBeingTraded);


  useEffect(() => {
    if (!isSelectedByDice || isGameEnded || (isTradeOffActive && !isBeingTraded) || !isCurrentPlayerTurn) {
      setShowNpv(false);
      setCalculatedNpv(null);
    }
  }, [isSelectedByDice, isGameEnded, isTradeOffActive, isBeingTraded, isCurrentPlayerTurn, investingPlayerId]);


  const handleAnalyzeNpv = () => {
    if (!effectiveCanInteract) return;

    const npv = calculateNPV(
      investment.expectedAnnualCashFlow,
      investment.discountRate,
      investment.durationYears,
      investment.cost
    );
    setCalculatedNpv(npv);
    setShowNpv(true);
    toast({
      title: "NPV Analyzed",
      description: `NPV for ${investment.name} is ${formatCurrency(npv)}.`,
    });
  };

  const handleInvest = () => {
    if (!effectiveCanInteract) return;

    if (calculatedNpv === null) {
      toast({
        title: "Analysis Required",
        description: "Please analyze NPV before investing.",
        variant: "destructive",
      });
      return;
    }
    onInvest(investment, calculatedNpv);
    setShowNpv(false); 
    setCalculatedNpv(null);
  };

  const NpvDisplay = calculatedNpv !== null ? (
    <div className={`mt-3 p-3 rounded-md flex items-center gap-2 ${calculatedNpv >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
      {calculatedNpv >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
      <span className="font-semibold">NPV: {formatCurrency(calculatedNpv)}</span>
    </div>
  ) : null;
  

  return (
    <Card className={cn(
      "shadow-lg flex flex-col transition-all duration-300 ease-in-out",
      isGameEnded ? "opacity-50 cursor-not-allowed" : 
        (effectiveCanInteract ? "ring-2 ring-primary border-primary shadow-primary/30" : "opacity-75 hover:opacity-100"),
      (!isCurrentPlayerTurn || (isTradeOffActive && !isBeingTraded)) && !isGameEnded && !effectiveCanInteract && "opacity-60",
      isBeingTraded && "ring-2 ring-accent border-accent shadow-accent/30 opacity-90"
    )}>
      <CardHeader className="pb-3">
        <div className="relative w-full h-40 rounded-t-md overflow-hidden mb-3">
          <Image 
            src={investment.imageUrl} 
            alt={investment.name} 
            width={600}
            height={400}
            className="object-cover"
            data-ai-hint={investment.imageHint}
          />
        </div>
        <CardTitle className="text-xl flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          {investment.name}
        </CardTitle>
        <CardDescription>{investment.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 flex-grow">
        <div className="flex items-center gap-2 text-sm">
          <Banknote className="h-4 w-4 text-muted-foreground" />
          <strong>Cost:</strong> {formatCurrency(investment.cost)}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <BarChartBig className="h-4 w-4 text-muted-foreground" />
          <strong>Annual Cash Flow:</strong> {formatCurrency(investment.expectedAnnualCashFlow)}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <strong>Duration:</strong> {investment.durationYears} years
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Percent className="h-4 w-4 text-muted-foreground" />
          <strong>Discount Rate:</strong> {(investment.discountRate * 100).toFixed(1)}%
        </div>
        {showNpv && effectiveCanInteract && NpvDisplay}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
        <Button 
          onClick={handleAnalyzeNpv} 
          variant="outline" 
          className="w-full sm:w-auto" 
          disabled={!effectiveCanInteract || isGameEnded || isBeingTraded}
        >
          Analyze NPV
        </Button>
        <Button 
          onClick={handleInvest} 
          className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          disabled={!effectiveCanInteract || !showNpv || isGameEnded || isBeingTraded}
        >
          Invest
        </Button>
      </CardFooter>
    </Card>
  );
}
