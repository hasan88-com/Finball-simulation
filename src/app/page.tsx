
"use client";

import { useState, useEffect } from 'react';
import type { Player, InvestmentOption, MarketEvent as MarketEventType, MarketEventImpact } from '@/types';
import PlayerPanel from '@/components/game/PlayerPanel';
import InvestmentCard from '@/components/game/InvestmentCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Zap, Megaphone, Trophy, ShieldQuestion, ShieldCheck, Briefcase, Dice5, UserCircle, SkipForward, Repeat, Award } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCurrency } from '@/lib/game-utils';

const initialPlayerState = (): Player[] => [
  { id: 'player1', name: 'Alex Manager', clubName: 'Quantum FC', cash: 1000000, netWorth: 1500000, avatarUrl: 'https://placehold.co/128x128.png', avatarHint: 'male manager', cumulativeNpvEarned: 0 },
  { id: 'player2', name: 'Beatriz Investor', clubName: 'Momentum United', cash: 1000000, netWorth: 1500000, avatarUrl: 'https://placehold.co/128x128.png', avatarHint: 'female investor', cumulativeNpvEarned: 0 },
  { id: 'player3', name: 'Carlos Strategist', clubName: 'Dynamo Capital', cash: 1000000, netWorth: 1500000, avatarUrl: 'https://placehold.co/128x128.png', avatarHint: 'male strategist', cumulativeNpvEarned: 0 },
];

const COMMON_DISCOUNT_RATE = 0.10;
const COMMON_DURATION_YEARS = 7;

// Target NPVs are illustrative. Costs adjusted to meet target NPV ranges with fixed duration/discount rate.
const initialInvestments: InvestmentOption[] = [
  // Positive NPV (aiming for diverse positive values)
  { id: 'inv1', name: 'Youth Academy Upgrade', description: 'Boost talent development.', cost: 435895, expectedAnnualCashFlow: 120000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'football academy' }, // NPV ~+150k
  { id: 'inv2', name: 'Stadium Expansion', description: 'Increase matchday revenue.', cost: 971053, expectedAnnualCashFlow: 250000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'stadium crowd' }, // NPV ~+250k
  { id: 'inv3', name: 'Digital Fan Platform', description: 'Monetize global fanbase.', cost: 290789, expectedAnnualCashFlow: 70000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'digital technology' }, // NPV ~+50k
  { id: 'inv4', name: 'Scouting Network Expansion', description: 'Discover hidden talents.', cost: 340000, expectedAnnualCashFlow: 90000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'global scouts' }, // NPV ~+98k
  { id: 'inv5', name: 'Community Outreach Program', description: 'Enhance brand image.', cost: 145395, expectedAnnualCashFlow: 35000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'community sports' }, // NPV ~+25k
  { id: 'inv6', name: 'Player Fitness Center', description: 'Optimize performance.', cost: 628947, expectedAnnualCashFlow: 160000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'sports science' }, // NPV ~+150k
  { id: 'inv7', name: 'International Pre-Season Tour', description: 'Expand global brand.', cost: 502895, expectedAnnualCashFlow: 130000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'global tour' }, // NPV ~+130k
  { id: 'inv8', name: 'E-sports Team Launch', description: 'Tap into e-sports market.', cost: 212763, expectedAnnualCashFlow: 55000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'esports team' }, // NPV ~+55k
  { id: 'inv9', name: 'Sustainable Energy Initiative', description: 'Reduce stadium op costs.', cost: 314474, expectedAnnualCashFlow: 80000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'solar stadium' }, // NPV ~+75k
  
  // Negative NPV (aiming for -2k to -10k range)
  { id: 'inv10', name: 'Merchandise Line Overhaul', description: 'Refresh club shop (risky).', cost: 199737, expectedAnnualCashFlow: 40000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'sports merchandise' }, // NPV ~-5k
  { id: 'inv11', name: 'Hospitality Suite Renovation', description: 'Premium suites (high cost).', cost: 399474, expectedAnnualCashFlow: 80000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'luxury suite' }, // NPV ~-10k
  { id: 'inv12', name: 'Club Museum (Low Footfall)', description: 'New revenue stream (niche).', cost: 737105, expectedAnnualCashFlow: 150000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'club museum' }, // NPV ~-7k
];


const sampleMarketEvents: MarketEventType[] = [
  {
    id: 'event_tv_bonus',
    title: 'Unexpected TV Rights Bonus!',
    description: 'A surprise surge in TV viewership has led to an unexpected bonus distribution.',
    impact: { cashChange: 75000, netWorthChange: 25000 },
    getImpactPlayerMessage: (playerName, cash, nw) => 
      `${playerName} received an unexpected TV Rights bonus! Cash +${formatCurrency(cash)}, Net Worth +${formatCurrency(nw)}.`,
    variant: 'default',
  },
  {
    id: 'event_sponsor_loss',
    title: 'Key Sponsor Backs Out!',
    description: 'Due to unforeseen circumstances, a major club sponsor has withdrawn their support.',
    impact: { cashChange: -100000, netWorthChange: -50000 },
    getImpactPlayerMessage: (playerName, cash, nw) => 
      `${playerName}'s club lost a key sponsor! Cash ${formatCurrency(cash)}, Net Worth ${formatCurrency(nw)}.`,
    variant: 'destructive',
  },
  {
    id: 'event_player_sale_windfall',
    title: 'Player Sale Windfall',
    description: 'A star player sale brought in more cash than expected.',
    impact: { cashChange: 150000, netWorthPercentageChange: 0.05 }, // Net worth also slightly up due to perceived club value
    getImpactPlayerMessage: (playerName, cash, nw) =>
      `${playerName}'s club benefits from a player sale windfall! Cash +${formatCurrency(cash)}, Net Worth +${formatCurrency(nw)}.`,
    variant: 'default',
  },
  {
    id: 'event_stadium_repair',
    title: 'Urgent Stadium Repairs',
    description: 'Unexpected structural issues require immediate and costly stadium repairs.',
    impact: { cashChange: -120000, netWorthChange: -60000 }, // Repairs might slightly lower asset value if not capitalized fully
    getImpactPlayerMessage: (playerName, cash, nw) =>
      `${playerName}'s club faces urgent stadium repair costs. Cash ${formatCurrency(cash)}, Net Worth ${formatCurrency(nw)}.`,
    variant: 'destructive',
  },
  {
    id: 'event_market_value_increase',
    title: 'League Popularity Soars!',
    description: 'The whole league enjoys increased popularity, boosting club valuations.',
    impact: { netWorthPercentageChange: 0.10 }, // 10% increase in net worth
    getImpactPlayerMessage: (playerName, cash, nw) =>
      `League popularity boosts ${playerName}'s club valuation! Net Worth +${formatCurrency(nw)}.`,
    variant: 'default',
  }
];

const MAX_ROUNDS = 3;

interface CurrentEventDisplay {
  title: string;
  description: string; // General event description
  impactMessage: string; // Specific message for the affected player
  variant: 'default' | 'destructive';
}


export default function GamePage() {
  const [players, setPlayers] = useState<Player[]>(initialPlayerState());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [investments, setInvestments] = useState<InvestmentOption[]>(initialInvestments);
  const [currentEventForDisplay, setCurrentEventForDisplay] = useState<CurrentEventDisplay | null>(null);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const { toast } = useToast();

  const [currentRound, setCurrentRound] = useState<number>(1);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [shockAvailableThisRound, setShockAvailableThisRound] = useState<boolean>(true);

  const [clientHasMounted, setClientHasMounted] = useState(false);
  useEffect(() => {
    setClientHasMounted(true);
  }, []);

  const resetGame = () => {
    setPlayers(initialPlayerState());
    setCurrentEventForDisplay(null);
    setDiceResult(null);
    setCurrentPlayerIndex(0);
    setCurrentRound(1);
    setGameEnded(false);
    setWinner(null);
    setShockAvailableThisRound(true);
    toast({
      title: "Game Reset",
      description: "A new game has started!",
    });
  };


  const handleInvestment = (investment: InvestmentOption, npv: number) => {
    if (gameEnded) return;
    setPlayers(prevPlayers => {
      const updatedPlayers = prevPlayers.map((p, index) => {
        if (index === currentPlayerIndex) {
          const player = { ...p };
          if (player.cash >= investment.cost) {
            player.cash -= investment.cost;
            // Net worth increases by the NPV if it's positive.
            // This reflects the value added to the club beyond the initial cost.
            if (npv > 0) {
              player.netWorth += npv;
              player.cumulativeNpvEarned += npv;
            }
            // If NPV is negative, cash is spent, net worth isn't directly reduced by NPV here,
            // but the loss of cash (an asset) implicitly reduces net worth.
            // The initial investment cost directly reduces cash.
            
            toast({
              title: `Investment Successful for ${player.name}!`,
              description: `${player.name} invested in ${investment.name}. Cost: ${formatCurrency(investment.cost)}, NPV: ${formatCurrency(npv)}. Cash: ${formatCurrency(player.cash)}, Net Worth: ${formatCurrency(player.netWorth)}, Cum. NPV: ${formatCurrency(player.cumulativeNpvEarned)}`,
            });
          } else {
            toast({
              title: 'Insufficient Funds',
              description: `${player.name} does not have enough cash for ${investment.name}.`,
              variant: 'destructive',
            });
          }
          return player;
        }
        return p;
      });
      return updatedPlayers;
    });
  };

 const triggerRandomMarketEvent = () => {
    if (gameEnded || !clientHasMounted || !shockAvailableThisRound) return;

    const randomEventIndex = Math.floor(Math.random() * sampleMarketEvents.length);
    const event = sampleMarketEvents[randomEventIndex];

    const randomPlayerIndex = Math.floor(Math.random() * players.length);
    const targetPlayer = players[randomPlayerIndex];

    let actualCashChange = event.impact.cashChange || 0;
    let actualNetWorthChange = event.impact.netWorthChange || 0;

    if (event.impact.cashPercentageChange) {
      actualCashChange += targetPlayer.cash * event.impact.cashPercentageChange;
    }
    if (event.impact.netWorthPercentageChange) {
      actualNetWorthChange += targetPlayer.netWorth * event.impact.netWorthPercentageChange;
    }
    // Ensure changes are integers for simplicity in display and state
    actualCashChange = Math.round(actualCashChange);
    actualNetWorthChange = Math.round(actualNetWorthChange);


    setPlayers(prevPlayers => 
      prevPlayers.map((p, index) => {
        if (index === randomPlayerIndex) {
          return {
            ...p,
            cash: Math.max(0, p.cash + actualCashChange), // Prevent negative cash from event
            netWorth: p.netWorth + actualNetWorthChange,
          };
        }
        return p;
      })
    );
    
    const impactMessage = event.getImpactPlayerMessage(targetPlayer.name, actualCashChange, actualNetWorthChange);

    setCurrentEventForDisplay({
      title: event.title,
      description: event.description,
      impactMessage: impactMessage,
      variant: event.variant,
    });
    
    toast({
      title: `Market Event: ${event.title}!`,
      description: `${event.description} ${impactMessage}`, // Include player specific message in toast too
      variant: event.variant,
      duration: 7000,
    });
    setShockAvailableThisRound(false);
  };


  const handleDiceRoll = () => {
    if (gameEnded || !clientHasMounted || diceResult !== null) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceResult(roll);
    toast({
      title: `${players[currentPlayerIndex].name} Rolled!`,
      description: `They rolled a ${roll}. Project ${roll} is now available.`,
    });
  };

  const endGame = () => {
    setGameEnded(true);
    const sortedPlayers = [...players].sort((a, b) => {
      if (b.cumulativeNpvEarned !== a.cumulativeNpvEarned) {
        return b.cumulativeNpvEarned - a.cumulativeNpvEarned;
      }
      return b.netWorth - a.netWorth;
    });
    const gameWinner = sortedPlayers[0];
    setWinner(gameWinner);
    toast({
      title: "🏆 Game Over! 🏆",
      description: `${gameWinner.name} wins with a cumulative NPV of ${formatCurrency(gameWinner.cumulativeNpvEarned)} and Net Worth of ${formatCurrency(gameWinner.netWorth)}!`,
      duration: 10000,
    });
  };

  const handleNextPlayer = () => {
    if (gameEnded || !clientHasMounted || diceResult === null) {
        if (diceResult === null && !gameEnded) {
            toast({
                title: "Roll Dice First!",
                description: `${players[currentPlayerIndex].name}, please roll the dice to select a project before proceeding.`,
                variant: "destructive"
            });
        }
        return;
    }
    
    let nextPlayer = (currentPlayerIndex + 1);
    if (nextPlayer >= players.length) { // End of a round
      nextPlayer = 0;
      const nextRound = currentRound + 1;
      if (nextRound > MAX_ROUNDS) {
        endGame();
        return; // Stop further turn processing
      }
      setCurrentRound(nextRound);
      setShockAvailableThisRound(true); // Re-enable shock for the new round
      toast({
        title: `Round ${nextRound} Starting!`,
        description: `It's now ${players[nextPlayer].name}'s turn. Roll the dice! A new Market Shock can be triggered.`,
      });
    } else {
       toast({
        title: "Next Player's Turn",
        description: `It's now ${players[nextPlayer].name}'s turn. Roll the dice!`,
      });
    }
    
    setCurrentPlayerIndex(nextPlayer);
    setDiceResult(null); 
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
          <div className="flex items-center gap-2 md:gap-4">
             {clientHasMounted && !gameEnded && (
                <span className="text-foreground text-xs md:text-sm font-medium flex items-center">
                  Round: <strong className="ml-1 text-primary text-sm md:text-base">{currentRound}</strong> / {MAX_ROUNDS}
                </span>
            )}
            {clientHasMounted && currentPlayer && !gameEnded && (
                <span className="text-foreground text-xs md:text-sm font-medium flex items-center">
                  <UserCircle className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Player: <strong className="ml-1 text-primary text-sm md:text-base">{currentPlayer.name}</strong>
                </span>
            )}
            {diceResult !== null && clientHasMounted && !gameEnded && (
              <span className="text-foreground text-xs md:text-sm">
                Rolled: <strong className="text-primary text-base md:text-lg">{diceResult}</strong>
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleDiceRoll} disabled={!clientHasMounted || diceResult !== null || gameEnded}>
              <Dice5 className="mr-2 h-4 w-4" /> Roll Dice
            </Button>
             <Button variant="outline" size="sm" onClick={handleNextPlayer} disabled={!clientHasMounted || gameEnded || diceResult === null}>
              <SkipForward className="mr-2 h-4 w-4" /> Next
            </Button>
            <Button variant="secondary" size="sm" onClick={triggerRandomMarketEvent} disabled={!clientHasMounted || gameEnded || !shockAvailableThisRound}>
              <Zap className="mr-2 h-4 w-4" /> Shock
            </Button>
            {gameEnded && (
               <Button variant="default" size="sm" onClick={resetGame} disabled={!clientHasMounted}>
                <Repeat className="mr-2 h-4 w-4" /> Play Again
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6">
        {gameEnded && winner && clientHasMounted && (
          <Alert variant="default" className="mb-6 border-primary bg-primary/10">
            <Award className="h-5 w-5 text-primary" />
            <AlertTitle className="text-2xl text-primary">Game Over! Congratulations, {winner.name}!</AlertTitle>
            <AlertDescription className="text-lg">
              {winner.name} is the Champion Investor with a Cumulative NPV of <strong className="text-primary">{formatCurrency(winner.cumulativeNpvEarned)}</strong> and a final Net Worth of <strong className="text-primary">{formatCurrency(winner.netWorth)}</strong>.
            </AlertDescription>
          </Alert>
        )}

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
                  Investment Opportunities {clientHasMounted && currentPlayer && !gameEnded ? `(for ${currentPlayer.name})` : ''}
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
                      isCurrentPlayerTurn={!gameEnded} 
                      isSelectedByDice={isSelectedByDice && !gameEnded}
                      isGameEnded={gameEnded}
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
                {!currentEventForDisplay && clientHasMounted && !gameEnded && (
                  <div className="text-center py-6 text-muted-foreground">
                    <ShieldQuestion className="h-12 w-12 mx-auto mb-2" />
                    <p>No major market events currently. Stay vigilant!</p>
                    <Button 
                      onClick={triggerRandomMarketEvent} 
                      className="mt-4" 
                      disabled={!clientHasMounted || gameEnded || !shockAvailableThisRound}
                    >
                      Trigger Market Event
                    </Button>
                  </div>
                )}
                {currentEventForDisplay && clientHasMounted && !gameEnded && (
                  <div className={`mt-4 p-4 rounded-md shadow ${currentEventForDisplay.variant === 'destructive' ? 'bg-destructive/20 border-destructive border' : 'bg-secondary/70'}`}>
                    <h4 className={`font-semibold text-lg ${currentEventForDisplay.variant === 'destructive' ? 'text-destructive-foreground' : 'text-primary'}`}>{currentEventForDisplay.title}</h4>
                    <p className="text-sm mt-1">{currentEventForDisplay.description}</p>
                    <p className="text-sm mt-2 font-medium">{currentEventForDisplay.impactMessage}</p>
                  </div>
                )}
                 {gameEnded && clientHasMounted && (
                  <div className="text-center py-6 text-muted-foreground">
                    <ShieldCheck className="h-12 w-12 mx-auto mb-2 text-primary" />
                    <p>The game has concluded. Click "Play Again" to start a new match!</p>
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
