
"use client";

import { useState, useEffect } from 'react';
import type { Player, InvestmentOption, MarketEvent as MarketEventType } from '@/types';
import PlayerPanel from '@/components/game/PlayerPanel';
import InvestmentCard from '@/components/game/InvestmentCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Zap, Megaphone, Trophy, ShieldQuestion, Briefcase, Dice5, UserCircle, SkipForward } from 'lucide-react';

const initialPlayers: Player[] = [
  { id: 'player1', name: 'Alex Manager', clubName: 'Quantum FC', cash: 1000000, netWorth: 1500000, avatarUrl: 'https://placehold.co/128x128.png', avatarHint: 'male manager' },
  { id: 'player2', name: 'Beatriz Investor', clubName: 'Momentum United', cash: 1000000, netWorth: 1500000, avatarUrl: 'https://placehold.co/128x128.png', avatarHint: 'female investor' },
  { id: 'player3', name: 'Carlos Strategist', clubName: 'Dynamo Capital', cash: 1000000, netWorth: 1500000, avatarUrl: 'https://placehold.co/128x128.png', avatarHint: 'male strategist' },
];

const COMMON_DISCOUNT_RATE = 0.10; // All projects will use this discount rate
const COMMON_DURATION_YEARS = 7; // All projects will have this duration

const initialInvestments: InvestmentOption[] = [
  { id: 'inv1', name: 'Youth Academy Upgrade', description: 'Boost talent development for long-term gains.', cost: 534210, expectedAnnualCashFlow: 120000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'football academy' }, // Target NPV: +50,000
  { id: 'inv2', name: 'Stadium Expansion', description: 'Increase matchday revenue with more seats.', cost: 1117105, expectedAnnualCashFlow: 250000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'stadium crowd' }, // Target NPV: +100,000
  { id: 'inv3', name: 'Digital Fan Platform', description: 'Monetize global fanbase through new tech.', cost: 320789, expectedAnnualCashFlow: 70000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'digital technology' }, // Target NPV: +20,000
  { id: 'inv4', name: 'Merchandise Line Overhaul', description: 'Refresh club shop & online store for higher sales.', cost: 199737, expectedAnnualCashFlow: 40000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'sports merchandise' }, // Target NPV: -5,000
  { id: 'inv5', name: 'Scouting Network Expansion', description: 'Discover hidden talents globally.', cost: 408158, expectedAnnualCashFlow: 90000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'global scouts' }, // Target NPV: +30,000
  { id: 'inv6', name: 'Community Outreach Program', description: 'Enhance brand image and local support.', cost: 165395, expectedAnnualCashFlow: 35000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'community sports' }, // Target NPV: +5,000
  { id: 'inv7', name: 'Player Fitness & Science Center', description: 'Optimize player performance and reduce injuries.', cost: 708947, expectedAnnualCashFlow: 160000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'sports science' }, // Target NPV: +70,000
  { id: 'inv8', name: 'Hospitality Suite Renovation', description: 'Increase premium revenue on matchdays.', cost: 399474, expectedAnnualCashFlow: 80000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'luxury suite' }, // Target NPV: -10,000
  { id: 'inv9', name: 'International Pre-Season Tour', description: 'Expand global brand presence and merchandise sales.', cost: 592895, expectedAnnualCashFlow: 130000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'global tour' }, // Target NPV: +40,000
  { id: 'inv10', name: 'E-sports Team Launch', description: 'Tap into the booming e-sports market.', cost: 252763, expectedAnnualCashFlow: 55000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'esports team' }, // Target NPV: +15,000
  { id: 'inv11', name: 'Club Museum & Fan Experience Center', description: 'Create a new revenue stream from tourism and history.', cost: 732263, expectedAnnualCashFlow: 150000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'club museum' }, // Target NPV: -2,000
  { id: 'inv12', name: 'Sustainable Energy Initiative for Stadium', description: 'Reduce operational costs and improve green credentials.', cost: 364474, expectedAnnualCashFlow: 80000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'solar stadium' }, // Target NPV: +25,000
];


const sampleMarketEvents: MarketEventType[] = [
  { id: 'event1', title: 'Economic Boom!', description: 'Increased sponsorship revenue for all clubs.', impactDescription: '+10% cash for all players', variant: 'default' },
  { id: 'event2', title: 'Transfer Market Frenzy', description: 'Player valuations skyrocket unexpectedly.', impactDescription: 'Net worth of player assets may increase', variant: 'default' },
  { id: 'event3', title: 'Major Sponsor Pulls Out', description: 'One club loses a key sponsorship deal.', impactDescription: '-$200,000 cash for a random player', variant: 'destructive' },
  { id: 'event4', title: 'Regulatory Changes', description: 'New league rules impact club finances.', impactDescription: 'Clubs may face new operational costs', variant: 'destructive' },
];

export default function GamePage() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [investments, setInvestments] = useState<InvestmentOption[]>(initialInvestments);
  const [currentMarketEvent, setCurrentMarketEvent] = useState<MarketEventType | null>(null);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const { toast } = useToast();

  const [clientHasMounted, setClientHasMounted] = useState(false);
  useEffect(() => {
    setClientHasMounted(true);
  }, []);

  const handleInvestment = (investment: InvestmentOption, npv: number) => {
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      const player = updatedPlayers[currentPlayerIndex];

      if (player.cash >= investment.cost) {
        player.cash -= investment.cost;
        player.netWorth += npv > 0 ? npv : 0; // Only add positive NPV to net worth
        
        toast({
          title: `Investment Successful for ${player.name}!`,
          description: `${player.name} invested in ${investment.name}. Cash: ${player.cash.toLocaleString()}, Net Worth: ${player.netWorth.toLocaleString()}`,
        });
      } else {
        toast({
          title: 'Insufficient Funds',
          description: `${player.name} does not have enough cash for ${investment.name}.`,
          variant: 'destructive',
        });
      }
      return updatedPlayers;
    });
  };

  const triggerRandomMarketEvent = () => {
    if (!clientHasMounted) return;
    const randomIndex = Math.floor(Math.random() * sampleMarketEvents.length);
    const event = sampleMarketEvents[randomIndex];
    setCurrentMarketEvent(event);
    toast({
      title: `Market Event: ${event.title}`,
      description: event.description,
      variant: event.variant,
      duration: 5000,
    });
  };

  const handleDiceRoll = () => {
    if (!clientHasMounted) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceResult(roll);
    toast({
      title: `${players[currentPlayerIndex].name} Rolled!`,
      description: `They rolled a ${roll}. Project ${roll} is now available.`,
    });
  };

  const handleNextPlayer = () => {
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    setDiceResult(null); 
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    toast({
      title: "Next Player's Turn",
      description: `It's now ${players[nextPlayerIndex].name}'s turn. Roll the dice!`,
    });
  };
  
  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 p-4 bg-card shadow-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Fintech Football</h1>
          </div>
          <div className="flex items-center gap-4">
            {clientHasMounted && currentPlayer && (
                <span className="text-foreground text-sm font-medium flex items-center">
                  <UserCircle className="mr-2 h-5 w-5 text-primary" />
                  Current Player: <strong className="ml-1 text-primary text-base">{currentPlayer.name}</strong>
                </span>
            )}
            {diceResult !== null && clientHasMounted && (
              <span className="text-foreground text-sm">
                Rolled: <strong className="text-primary text-lg">{diceResult}</strong>
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleDiceRoll} disabled={!clientHasMounted || diceResult !== null}>
              <Dice5 className="mr-2 h-4 w-4" /> Roll Dice
            </Button>
             <Button variant="outline" size="sm" onClick={handleNextPlayer} disabled={!clientHasMounted}>
              <SkipForward className="mr-2 h-4 w-4" /> Next Player
            </Button>
            <Button variant="secondary" size="sm" onClick={triggerRandomMarketEvent} disabled={!clientHasMounted}>
              <Zap className="mr-2 h-4 w-4" /> Market Shock
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
            {players.map(player => (
              <PlayerPanel key={player.id} player={player} />
            ))}
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Briefcase className="h-7 w-7 text-accent" />
                  Investment Opportunities (for {currentPlayer?.name})
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investments.map((inv, idx) => {
                  const isSelectedByDice = diceResult !== null && idx === diceResult - 1;
                  return (
                    <InvestmentCard 
                      key={inv.id} 
                      investment={inv} 
                      onInvest={(investment, npv) => handleInvestment(investment, npv)} 
                      isCurrentPlayer={true} 
                      isSelectedByDice={isSelectedByDice}
                    />
                  );
                })}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Megaphone className="h-7 w-7 text-accent" />
                  Market Pulse
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!currentMarketEvent && clientHasMounted && (
                  <div className="text-center py-6 text-muted-foreground">
                    <ShieldQuestion className="h-12 w-12 mx-auto mb-2" />
                    <p>No major market events currently. Stay vigilant!</p>
                    <Button onClick={triggerRandomMarketEvent} className="mt-4" disabled={!clientHasMounted}>Check for Events</Button>
                  </div>
                )}
                {currentMarketEvent && clientHasMounted && (
                  <div className={`mt-4 p-4 rounded-md shadow ${currentMarketEvent.variant === 'destructive' ? 'bg-destructive/20 border-destructive border' : 'bg-secondary/70'}`}>
                    <h4 className={`font-semibold text-lg ${currentMarketEvent.variant === 'destructive' ? 'text-destructive-foreground' : 'text-primary'}`}>{currentMarketEvent.title}</h4>
                    <p className="text-sm mt-1">{currentMarketEvent.description}</p>
                    <p className="text-xs mt-2 text-muted-foreground">Impact: {currentMarketEvent.impactDescription}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="p-4 bg-card text-center text-sm text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} Fintech Football Inc. All rights reserved.
      </footer>
    </div>
  );
}

    