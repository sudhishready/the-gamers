"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Side = "heads" | "tails";

export function HeadsTailsGame() {
    const [guess, setGuess] = useState<Side | null>(null);
    const [result, setResult] = useState<Side | null>(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [wins, setWins] = useState(0);
    const [losses, setLosses] = useState(0);

    const canFlip = guess !== null && !isFlipping && result === null;
    const showOutcome = result !== null && !isFlipping;

    function flip() {
        if (!guess || isFlipping) return;
        setIsFlipping(true);
        setResult(null);
        window.setTimeout(() => {
            const landed: Side = Math.random() < 0.5 ? "heads" : "tails";
            setResult(landed);
            setIsFlipping(false);
            if (landed === guess) setWins((w) => w + 1);
            else setLosses((l) => l + 1);
        }, 700);
    }

    function playAgain() {
        setGuess(null);
        setResult(null);
    }

    return (
        <div className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
                <span>Wins {wins}</span>
                <span>Losses {losses}</span>
            </div>

            <div
                className={cn(
                    "flex min-h-[140px] flex-col items-center justify-center rounded-md border border-border bg-muted/30 px-4 py-8",
                    isFlipping && "animate-pulse",
                )}
                aria-live="polite"
            >
                {isFlipping && (
                    <span className="text-2xl font medium tracking-tight text-mute-foreground">
                        Flipping...
                    </span>
                )}
                {!isFlipping && result === null && (
                    <span className="text-sm text-muted-foreground">
                        Pick a side, then flip.
                    </span>
                )}
                {showOutcome && (
                    <div className="flex flex-col items-center gap-2 text-center">
                        <span className="text-3xl font-semibold">
                            {result === "heads" ? "Heads" : "Tails"}
                        </span>
                        <span
                            className={cn(
                                "text-sm font-medium",
                                result === guess ? "text-emerald-500" : "text-rose-500",
                            )}
                        >
                            {result === guess ? "You win 🎉" : "You lose 😢"}
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Your Call
                </p>
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        type="button"
                        variant={guess === "heads" ? "default" : "outline"}
                        size="lg"
                        className="w-full"
                        disabled={isFlipping || result !== null}
                        onClick={() => setGuess("heads")}
                    >
                        Heads
                    </Button>
                    <Button
                        type="button"
                        variant={guess === "tails" ? "default" : "outline"}
                        size="lg"
                        className="w-full"
                        disabled={isFlipping || result !== null}
                        onClick={() => setGuess("tails")}
                    >
                        Tails
                    </Button>
                </div>
            </div>
          
            <div className=" flex flex-col gap-2 sm:flex-row">
                <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    disabled={!canFlip}
                    onClick={flip}
                >
                    Flip coin
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    className="flex-1"
                    disabled={isFlipping}
                    onClick={playAgain}
                >
                    Reset
                </Button>
            </div>
        </div>
    );
}
      
