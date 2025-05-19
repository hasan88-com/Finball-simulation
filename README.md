# Finball Investment Game

This is a NextJS application for the Finball Investment Game, built in Firebase Studio.

To get started, take a look at `src/app/page.tsx`.

## Game Overview

Finball is a 3-player multiplayer simulation where players compete as football club managers. The core gameplay revolves around making smart capital investment decisions using Net Present Value (NPV). Players react to random market events and navigate financial challenges to lead their club to victory. The player with the highest cumulative NPV after a set number of rounds wins.

## Features

*   **Multiplayer Simulation**: Supports 3 players.
*   **NPV-Based Decisions**: Core mechanic involves choosing investments based on their NPV.
*   **Dice Roll Mechanics**: Dice rolls influence project availability and can trigger special events like project trade-offs.
*   **Project Trading & Bidding**: Players can trade project rights, with other players bidding for them.
*   **Market Events**: Random events can impact player finances (cash and net worth).
*   **Round-Based Gameplay**: The game progresses in rounds, with a defined end.
*   **Dynamic UI**: Built with Next.js, React, ShadCN UI, and Tailwind CSS.

## Tech Stack

*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **UI Components**: ShadCN UI
*   **Styling**: Tailwind CSS
*   **AI (Optional/Future)**: Genkit
