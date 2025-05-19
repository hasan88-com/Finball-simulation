
"use client";

import { useState, useEffect } from 'react';
import type { Player, InvestmentOption, MarketEvent as MarketEventType } from '@/types';
import PlayerPanel from '@/components/game/PlayerPanel';
import InvestmentCard from '@/components/game/InvestmentCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Zap, Megaphone, Trophy, ShieldQuestion, ShieldCheck, Briefcase, Dice5, UserCircle, SkipForward, Repeat, Award, Gavel, Handshake, Banknote, Landmark, Play, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCurrency } from '@/lib/game-utils';

type GameStage = 'welcome' | 'playerSetup' | 'playing';

const initialPlayerSetupNames = ['Alex Manager', 'Beatriz Investor', 'Carlos Strategist'];

const initialPlayerState = (playerNames: string[]): Player[] => [
  { id: 'player1', name: playerNames[0] || 'Player 1', clubName: `${playerNames[0] || 'Player 1'}'s XI`, cash: 1000000, netWorth: 1500000, avatarUrl: 'https://placehold.co/128x128.png', avatarHint: 'male manager', cumulativeNpvEarned: 0 },
  { id: 'player2', name: playerNames[1] || 'Player 2', clubName: `${playerNames[1] || 'Player 2'}'s XI`, cash: 1000000, netWorth: 1500000, avatarUrl: 'https://placehold.co/128x128.png', avatarHint: 'female investor', cumulativeNpvEarned: 0 },
  { id: 'player3', name: playerNames[2] || 'Player 3', clubName: `${playerNames[2] || 'Player 3'}'s XI`, cash: 1000000, netWorth: 1500000, avatarUrl: 'https://placehold.co/128x128.png', avatarHint: 'male strategist', cumulativeNpvEarned: 0 },
];

const COMMON_DISCOUNT_RATE = 0.10;
const COMMON_DURATION_YEARS = 7;

const initialInvestments: InvestmentOption[] = [
  // Positive NPV
  { id: 'inv1', name: 'Youth Academy Upgrade', description: 'Boost talent development.', cost: 435895, expectedAnnualCashFlow: 120000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'football academy' }, // NPV ~+150k
  { id: 'inv2', name: 'Stadium Expansion', description: 'Increase matchday revenue.', cost: 971053, expectedAnnualCashFlow: 250000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'stadium crowd' }, // NPV ~+250k
  { id: 'inv3', name: 'Digital Fan Platform', description: 'Monetize global fanbase.', cost: 290789, expectedAnnualCashFlow: 70000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'digital technology' }, // NPV ~+50k
  { id: 'inv4', name: 'Scouting Network Expansion', description: 'Discover hidden talents.', cost: 340000, expectedAnnualCashFlow: 90000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'global scouts' }, // NPV ~+98k
  { id: 'inv5', name: 'Community Outreach Program', description: 'Enhance brand image.', cost: 145395, expectedAnnualCashFlow: 35000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'community sports' }, // NPV ~+25k
  { id: 'inv6', name: 'Player Fitness Center', description: 'Optimize performance.', cost: 628947, expectedAnnualCashFlow: 160000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'sports science' }, // NPV ~+150k
  
  // New Positive NPV Projects (to make it 9 positive)
  { id: 'inv7', name: 'International Pre-Season Tour', description: 'Expand global brand presence and merchandise sales.', cost: 502895, expectedAnnualCashFlow: 130000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'global tour' }, // NPV ~+130k
  { id: 'inv8', name: 'E-sports Team Launch', description: 'Tap into the rapidly growing e-sports market.', cost: 212763, expectedAnnualCashFlow: 55000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'esports team' }, // NPV ~+55k
  { id: 'inv9', name: 'Sustainable Energy Initiative for Stadium', description: 'Reduce operational costs with green energy.', cost: 314474, expectedAnnualCashFlow: 80000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'solar stadium' }, // NPV ~+75k

  // Negative NPV Projects (3 projects, NPV between -2k and -10k)
  { id: 'inv10', name: 'Merchandise Line Overhaul (Risky)', description: 'Complete refresh of club shop items, high uncertainty.', cost: 199737, expectedAnnualCashFlow: 40000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'sports merchandise' }, // Target NPV ~-5k (Actual NPV: -5000.87)
  { id: 'inv11', name: 'Luxury Hospitality Suite Renovation (High Cost)', description: 'Renovate VIP suites, uncertain demand at new price point.', cost: 399474, expectedAnnualCashFlow: 80000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'luxury suite' }, // Target NPV ~-10k (Actual NPV: -10001.73)
  { id: 'inv12', name: 'Club Museum (Low Expected Footfall)', description: 'Establish a club museum, niche appeal, potentially low visitor numbers.', cost: 737105, expectedAnnualCashFlow: 150000, durationYears: COMMON_DURATION_YEARS, discountRate: COMMON_DISCOUNT_RATE, imageUrl: 'https://placehold.co/600x400.png', imageHint: 'club museum' }, // Target NPV ~-7k (Actual NPV: -7001.21)
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
    impact: { cashChange: 150000, netWorthPercentageChange: 0.05 }, 
    getImpactPlayerMessage: (playerName, cash, nw) =>
      `${playerName}'s club benefits from a player sale windfall! Cash +${formatCurrency(cash)}, Net Worth +${formatCurrency(nw)}.`,
    variant: 'default',
  },
  {
    id: 'event_stadium_repair',
    title: 'Urgent Stadium Repairs',
    description: 'Unexpected structural issues require immediate and costly stadium repairs.',
    impact: { cashChange: -120000, netWorthChange: -60000 }, 
    getImpactPlayerMessage: (playerName, cash, nw) =>
      `${playerName}'s club faces urgent stadium repair costs. Cash ${formatCurrency(cash)}, Net Worth ${formatCurrency(nw)}.`,
    variant: 'destructive',
  },
  {
    id: 'event_market_value_increase',
    title: 'League Popularity Soars!',
    description: 'The whole league enjoys increased popularity, boosting club valuations.',
    impact: { netWorthPercentageChange: 0.10 }, 
    getImpactPlayerMessage: (playerName, cash, nw) =>
      `League popularity boosts ${playerName}'s club valuation! Net Worth +${formatCurrency(nw)}.`,
    variant: 'default',
  }
];

const MAX_ROUNDS = 3;

interface CurrentEventDisplay {
  title: string;
  description: string; 
  impactMessage: string; 
  variant: 'default' | 'destructive';
}

export default function FinballGamePage() {
  const [gameStage, setGameStage] = useState<GameStage>('welcome');
  const [playerSetupNames, setPlayerSetupNames] = useState<string[]>(initialPlayerSetupNames);

  const [players, setPlayers] = useState<Player[]>([]);
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
  const [bankTotalAssets, setBankTotalAssets] = useState<number>(0);

  const [clientHasMounted, setClientHasMounted] = useState(false);

  // Dice roll & trade state
  const [hasRolledSixOnce, setHasRolledSixOnce] = useState<boolean>(false);
  const [isSecondRoll, setIsSecondRoll] = useState<boolean>(false);
  const [tradeOffActive, setTradeOffActive] = useState<boolean>(false);
  const [projectForTrade, setProjectForTrade] = useState<InvestmentOption | null>(null);
  const [bids, setBids] = useState<Record<string, number>>({}); // playerId: amount
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);
  const [tradeWinnerId, setTradeWinnerId] = useState<string | null>(null);

  useEffect(() => {
    setClientHasMounted(true);
  }, []);

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerSetupNames];
    newNames[index] = name;
    setPlayerSetupNames(newNames);
  };

  const startGame = () => {
    setPlayers(initialPlayerState(playerSetupNames));
    setCurrentEventForDisplay(null);
    setDiceResult(null);
    setCurrentPlayerIndex(0);
    setCurrentRound(1);
    setGameEnded(false);
    setWinner(null);
    setShockAvailableThisRound(true);
    setBankTotalAssets(0);
    setHasRolledSixOnce(false);
    setIsSecondRoll(false);
    setTradeOffActive(false);
    setProjectForTrade(null);
    setBids({});
    setTradeMessage(null);
    setTradeWinnerId(null);
    setGameStage('playing');
    toast({
      title: "Game Started!",
      description: `Welcome, Managers! Round 1 begins with ${playerSetupNames[0]}.`,
    });
  };

  const resetGame = () => {
    setPlayerSetupNames(initialPlayerSetupNames); // Reset names for next setup
    setGameStage('welcome');
    // Reset all other game-specific states to ensure a clean slate for `startGame`
    setPlayers([]);
    setCurrentEventForDisplay(null);
    setDiceResult(null);
    setCurrentPlayerIndex(0);
    setCurrentRound(1);
    setGameEnded(false);
    setWinner(null);
    setShockAvailableThisRound(true);
    setBankTotalAssets(0);
    setHasRolledSixOnce(false);
    setIsSecondRoll(false);
    setTradeOffActive(false);
    setProjectForTrade(null);
    setBids({});
    setTradeMessage(null);
    setTradeWinnerId(null);
    toast({
      title: "Game Reset",
      description: "Welcome back to Finball!",
    });
  };


  const handleInvestment = (investment: InvestmentOption, npv: number) => {
    if (gameEnded) return;
    const investingPlayerId = tradeWinnerId || players[currentPlayerIndex].id;

    setPlayers(prevPlayers => {
      const updatedPlayers = prevPlayers.map(p => {
        if (p.id === investingPlayerId) {
          const player = { ...p };
          if (player.cash >= investment.cost) {
            player.cash -= investment.cost;
            if (npv > 0) {
              player.netWorth += npv;
              player.cumulativeNpvEarned += npv;
            }
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
    if (tradeWinnerId) {
        setTradeWinnerId(null);
        setDiceResult(null); 
        setProjectForTrade(null);
    }
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
    actualCashChange = Math.round(actualCashChange);
    actualNetWorthChange = Math.round(actualNetWorthChange);

    setPlayers(prevPlayers => 
      prevPlayers.map((p, index) => {
        if (index === randomPlayerIndex) {
          return {
            ...p,
            cash: Math.max(0, p.cash + actualCashChange), 
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
      description: `${event.description} ${impactMessage}`, 
      variant: event.variant,
      duration: 7000,
    });
    setShockAvailableThisRound(false);
  };


  const handleDiceRoll = () => {
    if (gameEnded || !clientHasMounted || (diceResult !== null && !isSecondRoll) || tradeOffActive) return;
    
    const roll = Math.floor(Math.random() * 6) + 1;
    const currentPlayerName = players[currentPlayerIndex].name;

    if (isSecondRoll) { 
      setIsSecondRoll(false);
      setHasRolledSixOnce(false); 
      if (roll === 6) {
        toast({
          title: `${currentPlayerName} Rolled Again!`,
          description: `Rolled a 6, then another 6! Unlucky, no project action this turn.`,
          variant: 'destructive'
        });
        setDiceResult(null); 
      } else {
        setDiceResult(roll);
        const projectToTrade = investments[roll - 1];
        setProjectForTrade(projectToTrade);
        setTradeOffActive(true);
        toast({
          title: `${currentPlayerName} Rolled Again!`,
          description: `Rolled a 6, then a ${roll}! You can trade project: ${projectToTrade.name}.`,
        });
        setTradeMessage(`You can offer "${projectToTrade.name}" for trade. Other players can bid.`);
      }
    } else { 
      if (roll === 6) {
        setHasRolledSixOnce(true);
        setIsSecondRoll(true);
        toast({
          title: `${currentPlayerName} Rolled a 6!`,
          description: `You get to roll again!`,
        });
      } else {
        setDiceResult(roll);
        toast({
          title: `${currentPlayerName} Rolled!`,
          description: `They rolled a ${roll}. Project ${roll} is now available.`,
        });
      }
    }
  };

  const handleInitiateTrade = () => {
    if (!projectForTrade || !tradeOffActive) return;
    setTradeMessage(`Bidding is open for ${projectForTrade.name}! Cost: ${formatCurrency(projectForTrade.cost)}. ${players[currentPlayerIndex].name} is selling.`);
    setBids(players.reduce((acc, p) => {
        if (p.id !== players[currentPlayerIndex].id) {
            acc[p.id] = 0;
        }
        return acc;
    }, {} as Record<string, number>));
  };

  const handleBidChange = (bidderId: string, amount: string) => {
    const numericAmount = parseInt(amount, 10);
    if (!isNaN(numericAmount) && numericAmount >= 0) {
      setBids(prev => ({ ...prev, [bidderId]: numericAmount }));
    } else if (amount === "") {
      setBids(prev => ({ ...prev, [bidderId]: 0 }));
    }
  };

  const handleResolveTrade = () => {
    if (!projectForTrade || !tradeOffActive) return;

    let highestBidAmount = 0;
    let winningBidderId: string | null = null;

    for (const playerId in bids) {
      if (bids[playerId] > highestBidAmount) {
        highestBidAmount = bids[playerId];
        winningBidderId = playerId;
      } else if (bids[playerId] === highestBidAmount && bids[playerId] > 0) {
        // Tie-breaking: player earlier in the `players` array wins (excluding current player)
        const potentialWinner = players.find(p => p.id === playerId);
        const currentWinnerInTie = players.find(p => p.id === winningBidderId);
         // Ensure potentialWinner is not the seller
        if (potentialWinner && potentialWinner.id !== players[currentPlayerIndex].id) {
            if (!currentWinnerInTie || players.indexOf(potentialWinner) < players.indexOf(currentWinnerInTie)) {
                winningBidderId = playerId;
            }
        }
      }
    }
    
    const sellerId = players[currentPlayerIndex].id;
    let tradeSuccessful = false;

    if (winningBidderId && highestBidAmount > 0) {
      const winningBidder = players.find(p => p.id === winningBidderId);
      if (winningBidder && winningBidder.cash >= highestBidAmount) {
        const sellerReceives = Math.round(highestBidAmount * 0.8);
        const bankReceives = highestBidAmount - sellerReceives; 

        setPlayers(prevPlayers => prevPlayers.map(p => {
          if (p.id === sellerId) {
            return { ...p, cash: p.cash + sellerReceives };
          }
          if (p.id === winningBidderId) { // This check should be safe due to above
            return { ...p, cash: p.cash - highestBidAmount };
          }
          return p;
        }));
        
        setBankTotalAssets(prevBankAssets => prevBankAssets + bankReceives);
        setTradeWinnerId(winningBidderId); 
        tradeSuccessful = true;
        toast({
          title: "Trade Successful!",
          description: `${players.find(p => p.id === sellerId)?.name} sold the rights for ${projectForTrade.name} to ${players.find(p => p.id === winningBidderId)?.name} for ${formatCurrency(highestBidAmount)}. Seller received ${formatCurrency(sellerReceives)}. Bank received ${formatCurrency(bankReceives)}. ${players.find(p => p.id === winningBidderId)?.name} can now invest.`,
          duration: 9000
        });

      } else { // Winning bidder cannot afford
         toast({
            title: "Bid Failed",
            description: `${winningBidder?.name || 'Bidder'} does not have enough cash (${formatCurrency(highestBidAmount)}) for their bid. Trade cancelled.`,
            variant: "destructive"
          });
      }
    }
    
    if (!tradeSuccessful) { // No valid bids or highest bidder couldn't afford
      toast({
        title: "Trade Unsuccessful",
        description: `No valid, affordable bids were placed for ${projectForTrade.name}.`,
      });
      setDiceResult(null); 
      setProjectForTrade(null);
    }

    setTradeOffActive(false);
    setTradeMessage(null);
    setBids({});
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
  };

  const handleNextPlayer = () => {
    if (gameEnded || !clientHasMounted || (diceResult === null && !isSecondRoll && !tradeWinnerId && !hasRolledSixOnce) || tradeOffActive) {
        if (!gameEnded && !tradeOffActive && (diceResult === null && !isSecondRoll && !tradeWinnerId && !hasRolledSixOnce)) {
             toast({
                title: "Roll Dice First!",
                description: `${players[currentPlayerIndex].name}, please roll the dice or resolve trade before proceeding.`,
                variant: "destructive"
            });
        }
        return;
    }
    
    let nextPlayer = (currentPlayerIndex + 1);
    setDiceResult(null); 
    setHasRolledSixOnce(false);
    setIsSecondRoll(false);
    setTradeOffActive(false);
    setProjectForTrade(null);
    setBids({});
    setTradeMessage(null);
    setTradeWinnerId(null);
    setCurrentEventForDisplay(null); // Clear previous market event display

    if (nextPlayer >= players.length) { 
      nextPlayer = 0;
      const nextRound = currentRound + 1;
      
      if (nextRound > MAX_ROUNDS) {
        endGame();
        return; 
      }
      setCurrentRound(nextRound);
      setShockAvailableThisRound(true); 
      toast({
        title: `Round ${nextRound} (Year ${nextRound}) Starting!`,
        description: `It's now ${players[nextPlayer].name}'s turn. Roll the dice! A new Market Shock can be triggered.`,
      });
    } else {
       toast({
        title: "Next Player's Turn",
        description: `It's now ${players[nextPlayer].name}'s turn. Roll the dice! (Round ${currentRound} / Year ${currentRound})`,
      });
    }
    
    setCurrentPlayerIndex(nextPlayer);
  };
  
  if (gameStage === 'welcome') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Trophy className="h-24 w-24 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold text-primary">Welcome to Finball!</CardTitle>
            <CardDescription className="text-lg text-muted-foreground pt-2">
              The Ultimate Football Club Investment Simulation Game.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">
              Manage your club, make smart investments using NPV, and navigate market shocks to lead your team to financial glory!
            </p>
            <Button size="lg" onClick={() => setGameStage('playerSetup')} className="w-full">
              <Play className="mr-2 h-5 w-5" /> Play Game
            </Button>
          </CardContent>
        </Card>
         <footer className="absolute bottom-4 text-sm text-muted-foreground">
            © 2025 Finball Inc. All rights reserved.
        </footer>
      </div>
    );
  }

  if (gameStage === 'playerSetup') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8">
        <Card className="w-full max-w-lg shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Users className="h-20 w-20 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Setup Your Managers</CardTitle>
            <CardDescription className="text-md text-muted-foreground pt-2">
              Enter the names for the three competing club managers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {playerSetupNames.map((name, index) => (
              <div key={index} className="space-y-1">
                <Label htmlFor={`player${index + 1}-name`} className="text-sm font-medium">
                  Manager {index + 1} Name:
                </Label>
                <Input
                  id={`player${index + 1}-name`}
                  type="text"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`Enter name for Manager ${index + 1}`}
                  className="text-base"
                />
              </div>
            ))}
            <Button size="lg" onClick={startGame} className="w-full mt-4">
              Start Game
            </Button>
          </CardContent>
        </Card>
         <footer className="absolute bottom-4 text-sm text-muted-foreground">
            © 2025 Finball Inc. All rights reserved.
        </footer>
      </div>
    );
  }

  // gameStage === 'playing'
  const currentPlayer = players[currentPlayerIndex];
  const otherPlayers = players.filter((_, index) => index !== currentPlayerIndex);

  const canRollDice = clientHasMounted && !gameEnded && (diceResult === null || isSecondRoll) && !tradeOffActive && !tradeWinnerId;
  const canProceedToNextPlayer = clientHasMounted && !gameEnded && (diceResult !== null || hasRolledSixOnce === false && isSecondRoll === false || tradeWinnerId !== null) && !tradeOffActive && !isSecondRoll;


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 p-4 bg-card shadow-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Finball</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
             {clientHasMounted && !gameEnded && (
                <span className="text-foreground text-xs md:text-sm font-medium flex items-center">
                  Round: <strong className="ml-1 text-primary text-sm md:text-base">{currentRound}</strong> / {MAX_ROUNDS} (Year {currentRound})
                </span>
            )}
            {clientHasMounted && currentPlayer && !gameEnded && (
                <span className="text-foreground text-xs md:text-sm font-medium flex items-center">
                  <UserCircle className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Player: <strong className="ml-1 text-primary text-sm md:text-base">{currentPlayer.name}</strong>
                </span>
            )}
             {clientHasMounted && !gameEnded && (
                <span className="text-foreground text-xs md:text-sm font-medium flex items-center">
                  <Landmark className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Bank: <strong className="ml-1 text-primary text-sm md:text-base">{formatCurrency(bankTotalAssets)}</strong>
                </span>
            )}
            {diceResult !== null && clientHasMounted && !gameEnded && !tradeOffActive && !tradeWinnerId && (
              <span className="text-foreground text-xs md:text-sm">
                Rolled: <strong className="text-primary text-base md:text-lg">{diceResult}</strong> (Project {diceResult})
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleDiceRoll} disabled={!canRollDice}>
              <Dice5 className="mr-2 h-4 w-4" /> {isSecondRoll ? 'Roll Again' : 'Roll Dice'}
            </Button>
             <Button variant="outline" size="sm" onClick={handleNextPlayer} disabled={!canProceedToNextPlayer}>
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
          <Card className="mb-6 border-2 border-primary bg-primary/10 shadow-xl">
            <CardHeader className="items-center text-center">
                <Award className="h-20 w-20 text-primary animate-pulse" />
                <CardTitle className="text-3xl font-bold text-primary">Game Over!</CardTitle>
                <CardDescription className="text-xl text-primary-foreground/90">
                    Congratulations, {winner.name}!
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-lg">
              <p>
                {winner.name} is the Champion Investor with a Cumulative NPV of <strong className="text-primary">{formatCurrency(winner.cumulativeNpvEarned)}</strong> and a final Net Worth of <strong className="text-primary">{formatCurrency(winner.netWorth)}</strong>.
              </p>
              <Button onClick={resetGame} className="mt-6" size="lg">
                <Repeat className="mr-2 h-5 w-5" /> Play Again
              </Button>
            </CardContent>
          </Card>
        )}

        {!gameEnded && tradeOffActive && projectForTrade && clientHasMounted && (
          <Card className="mb-6 shadow-lg border-accent">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-accent">
                <Handshake className="h-6 w-6" /> Project Trade-Off: {projectForTrade.name}
              </CardTitle>
              <CardDescription>{tradeMessage}</CardDescription>
            </CardHeader>
            <CardContent>
              {tradeMessage?.startsWith("Bidding is open") ? (
                <div className="space-y-4">
                  {otherPlayers.map(p => (
                    <div key={p.id} className="flex items-center gap-3">
                      <span className="font-medium">{p.name}'s Bid:</span>
                      <Input 
                        type="number"
                        placeholder="Enter bid amount"
                        value={bids[p.id]?.toString() || ""}
                        onChange={(e) => handleBidChange(p.id, e.target.value)}
                        className="w-48"
                        min="0"
                      />
                       <span className="text-sm text-muted-foreground">(Cash: {formatCurrency(p.cash)})</span>
                    </div>
                  ))}
                  <Button onClick={handleResolveTrade} className="mt-2 bg-accent hover:bg-accent/90">
                    <Gavel className="mr-2 h-4 w-4" /> Finalize Bids & Resolve Trade
                  </Button>
                </div>
              ) : (
                <Button onClick={handleInitiateTrade} className="bg-accent hover:bg-accent/90">
                  <Banknote className="mr-2 h-4 w-4" /> Offer Project for Bidding
                </Button>
              )}
            </CardContent>
          </Card>
        )}


        {!gameEnded && (
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
                    Investment Opportunities {clientHasMounted && currentPlayer && !gameEnded ? 
                      (tradeWinnerId ? `(for ${players.find(p=>p.id === tradeWinnerId)?.name} - Traded Project)` : `(for ${currentPlayer.name})`) 
                      : ''}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {investments.map((inv, idx) => {
                    const projectIndexMatchesDice = diceResult !== null && idx === diceResult - 1;
                    let isEffectivelySelectedByDice = false;
                    // Determine who is the current interactor for this card
                    let currentInteractorId = null;
                    if (tradeWinnerId && projectForTrade?.id === inv.id) {
                        currentInteractorId = tradeWinnerId;
                    } else if (currentPlayer) {
                        currentInteractorId = currentPlayer.id;
                    }
                    
                    // A project is selected by dice if the dice roll matches its index AND (it's not a trade-off OR it is the project being traded AND a winner exists)
                    if (projectIndexMatchesDice) {
                        if (tradeOffActive) { // If trade-off is active, only the project being traded can be 'selected' by its dice number for the winner
                            if (projectForTrade?.id === inv.id && tradeWinnerId) {
                                isEffectivelySelectedByDice = true;
                            }
                        } else if (tradeWinnerId && projectForTrade?.id === inv.id) { // If a trade just concluded for this project
                           isEffectivelySelectedByDice = true;
                        }
                         else if (!tradeOffActive && !tradeWinnerId) { // Standard dice roll, no trade involved
                            isEffectivelySelectedByDice = true;
                        }
                    }


                    return (
                      <InvestmentCard 
                        key={inv.id} 
                        investment={inv} 
                        onInvest={(investment, npv) => handleInvestment(investment, npv)} 
                        isCurrentPlayerTurn={!gameEnded && !!currentInteractorId && (tradeWinnerId ? currentInteractorId === tradeWinnerId : currentInteractorId === currentPlayer?.id)}
                        isSelectedByDice={isEffectivelySelectedByDice && !gameEnded}
                        isGameEnded={gameEnded}
                        isTradeOffActive={tradeOffActive && projectForTrade?.id === inv.id} // only the project being traded is affected by tradeOffActive UI
                        isBeingTraded={tradeOffActive && projectForTrade?.id === inv.id}
                        investingPlayerId={tradeWinnerId || currentPlayer?.id} // Player who is eligible to invest (current or trade winner)
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
                     <Alert>
                      <ShieldQuestion className="h-4 w-4" />
                      <AlertTitle>All Quiet on the Market Front!</AlertTitle>
                      <AlertDescription>
                        No major market events currently. Stay vigilant! You can trigger a market shock once per round.
                      </AlertDescription>
                    </Alert>
                  )}
                  {currentEventForDisplay && clientHasMounted && !gameEnded && (
                     <Alert variant={currentEventForDisplay.variant === 'destructive' ? 'destructive' : 'default'}>
                      {currentEventForDisplay.variant === 'destructive' ? <Zap className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                      <AlertTitle>{currentEventForDisplay.title}</AlertTitle>
                      <AlertDescription>
                        {currentEventForDisplay.description} <br />
                        <strong>Impact:</strong> {currentEventForDisplay.impactMessage}
                      </AlertDescription>
                    </Alert>
                  )}
                   {gameEnded && clientHasMounted && !winner && ( 
                    <Alert>
                      <ShieldCheck className="h-4 w-4" />
                      <AlertTitle>Game Concluded</AlertTitle>
                      <AlertDescription>
                        The game has finished. Calculating final scores...
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="p-4 bg-card text-center text-sm text-muted-foreground border-t border-border">
        © 2025 Finball Inc. All rights reserved. 
        {gameStage === 'playing' && !gameEnded && ` (Round ${currentRound <= MAX_ROUNDS ? currentRound : MAX_ROUNDS} = Year ${currentRound <= MAX_ROUNDS ? currentRound : MAX_ROUNDS})`}
      </footer>
    </div>
  );
}

