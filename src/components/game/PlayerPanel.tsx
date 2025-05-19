
"use client";

import type { Player } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Landmark, DollarSign, TrendingUp, ShieldCheck, BarChartHorizontalBig } from 'lucide-react';
import { formatCurrency } from '@/lib/game-utils';

interface PlayerPanelProps {
  player: Player;
}

export default function PlayerPanel({ player }: PlayerPanelProps) {
  return (
    <Card className="shadow-xl break-inside-avoid">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={player.avatarUrl} alt={player.name} data-ai-hint={player.avatarHint} />
          <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl text-primary">{player.name}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-sm">
            <Landmark className="h-4 w-4" /> {player.clubName}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md shadow-sm">
          <div className="flex items-center gap-2 text-foreground">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="font-medium">Cash</span>
          </div>
          <span className="font-semibold text-lg">{formatCurrency(player.cash)}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md shadow-sm">
          <div className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-medium">Net Worth</span>
          </div>
          <span className="font-semibold text-lg">{formatCurrency(player.netWorth)}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md shadow-sm">
          <div className="flex items-center gap-2 text-foreground">
            <BarChartHorizontalBig className="h-5 w-5 text-primary" />
            <span className="font-medium">Cumulative NPV</span>
          </div>
          <span className="font-semibold text-lg">{formatCurrency(player.cumulativeNpvEarned)}</span>
        </div>
         <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md shadow-sm">
          <div className="flex items-center gap-2 text-foreground">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-medium">Status</span>
          </div>
          <span className="font-semibold text-sm text-green-400">Active</span>
        </div>
      </CardContent>
    </Card>
  );
}
