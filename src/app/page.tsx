
"use client";

import { useState, useEffect } from 'react';
import type { Player, InvestmentOption, MarketEvent as MarketEventType } from '@/types';
import PlayerPanel from '@/components/game/PlayerPanel';
import InvestmentCard from '@/components/game/InvestmentCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Zap, Megaphone, Trophy, ShieldQuestion, Briefcase, Dice5 } from 'lucide-react';

const initialPlayers: Player[] = [
  { id: 'player1', name: 'Alex Manager', clubName: 'Quantum FC', cash: 1500000, netWorth: 2500000, avatarUrl: 'https://placehold.co/128x128.png', avatarHint: 'male manager' },
  { id: 'player2', name: 'Beatriz Investor', clubName: 'Momentum United', cash: 1200000, netWorth: 2200000, avatarUrl: 'https://placehold.co/128x128.png', avatarHint: 'female investor' },
  { id: 'player3', name: 'Carlos Strategist', clubName: 'Dynamo Capital', cash: 1800000, netWorth: 2800000, avatarUrl: 'https://placehold.co/128x128.png', avatarHint: 'male strategist' },
];

const initialInvestments: InvestmentOption[] = [
  { id: 'inv1', name: 'Youth Academy Upgrade', description: 'Boost talent development for long-term gains.', cost: 500000, expectedAnnualCashFlow: 100000, durationYears: 7, discountRate: 0.12, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'football academy' },
  { id: 'inv2', name: 'Stadium Expansion', description: 'Increase matchday revenue with more seats.', cost: 1200000, expectedAnnualCashFlow: 200000, durationYears: 10, discountRate: 0.10, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'stadium crowd' },
  { id: 'inv3', name: 'Digital Fan Platform', description: 'Monetize global fanbase through new tech.', cost: 300000, expectedAnnualCashFlow: 70000, durationYears: 5, discountRate: 0.15, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'digital technology' },
  { id: 'inv4', name: 'Merchandise Line Overhaul', description: 'Refresh club shop & online store for higher sales.', cost: 200000, expectedAnnualCashFlow: 50000, durationYears: 4, discountRate: 0.13, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'sports merchandise' },
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
  const { toast } = useToast();

  // Ensure client-side only state for random generation
  const [clientHasMounted, setClientHasMounted] = useState(false);
  useEffect(() => {
    setClientHasMounted(true);
  }, []);


  const handleInvestment = (playerIndex: number, investment: InvestmentOption, npv: number) => {
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      const player = updatedPlayers[playerIndex];

      if (player.cash >= investment.cost) {
        player.cash -= investment.cost;
        // Simplified: Add NPV to net worth for game purposes, or a portion of it representing value creation.
        // In a real game, this would be more complex (assets increase by cost, future value contributes to net worth).
        player.netWorth += npv > 0 ? npv : 0; // Only add positive NPV to net worth.
        
        toast({
          title: `Investment Successful for ${player.name}!`,
          description: `${player.name} invested in ${investment.name}. Cash: ${player.cash}, Net Worth: ${player.netWorth}`,
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
    if (!clientHasMounted) return; // Prevent server-side random generation
    const randomIndex = Math.floor(Math.random() * sampleMarketEvents.length);
    const event = sampleMarketEvents[randomIndex];
    setCurrentMarketEvent(event);
    toast({
      title: `Market Event: ${event.title}`,
      description: event.description,
      variant: event.variant,
      duration: 5000,
    });
    // Here you would typically apply the event's effects to the game state
  };

  const handleDiceRoll = () => {
    if (!clientHasMounted) return; // Prevent server-side random generation
    const roll = Math.floor(Math.random() * 6) + 1; // Standard 6-sided die
    setDiceResult(roll);
    toast({
      title: "Dice Rolled!",
      description: `You rolled a ${roll}.`,
    });
    // Future: Connect this roll to game logic (e.g., triggering events, player turns)
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 p-4 bg-card shadow-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Fintech Football</h1>
          </div>
          <div className="flex items-center gap-3">
            {diceResult !== null && clientHasMounted && (
              <span className="text-foreground text-sm">
                Last Roll: <strong className="text-primary text-lg">{diceResult}</strong>
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleDiceRoll}>
              <Dice5 className="mr-2 h-4 w-4" /> Roll Dice
            </Button>
            <Button variant="outline" size="sm" onClick={triggerRandomMarketEvent}>
              <Zap className="mr-2 h-4 w-4" /> Market Shock
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Panels Section */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {players.map(player => (
              <PlayerPanel key={player.id} player={player} />
            ))}
          </div>

          {/* Investments and Events Section */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Briefcase className="h-7 w-7 text-accent" />
                  Investment Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investments.map((inv, index) => (
                  // For simplicity, let's assume Player 1 (index 0) is making the investment.
                  // In a real multiplayer game, you'd need to identify the active player.
                  <InvestmentCard key={inv.id} investment={inv} onInvest={(investment, npv) => handleInvestment(0, investment, npv)} />
                ))}
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
                    <Button onClick={triggerRandomMarketEvent} className="mt-4">Check for Events</Button>
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
