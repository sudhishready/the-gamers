"use client";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const SYMBOLS = ["🎮", "🎯", "🎲", "🕹️", "⚡", "🌟", "🔥", "💎"] as const;
type DeckCard = {
  id: number;
  pairId: number;
  symbol: string;
};
function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}
function buildDeck(): DeckCard[] {
  let id = 0;
  const pairs = SYMBOLS.flatMap((symbol, pairId) => [
    { id: id++, pairId, symbol },
    { id: id++, pairId, symbol },
  ]);
  return shuffle(pairs);
}
export function MatchTheCardsGame() {
  const [deck, setDeck] = useState<DeckCard[]>(() => buildDeck());
  const [faceUpIds, setFaceUpIds] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [lockBoard, setLockBoard] = useState(false);
  const [moves, setMoves] = useState(0);
  const isWon = matchedPairIds.size === SYMBOLS.length;
  const resetGame = useCallback(() => {
    setDeck(buildDeck());
    setFaceUpIds([]);
    setMatchedPairIds(new Set());
    setLockBoard(false);
    setMoves(0);
  }, []);
  const handleCardPress = useCallback(
    (card: DeckCard) => {
      if (lockBoard) return;
      if (matchedPairIds.has(card.pairId)) return;
      if (faceUpIds.includes(card.id)) return;
      if (faceUpIds.length === 2) return;
      const nextFace = [...faceUpIds, card.id];
      setFaceUpIds(nextFace);
      if (nextFace.length < 2) return;
      const [a, b] = nextFace.map((id) => deck.find((c) => c.id === id)!);
      setMoves((m) => m + 1);
      if (a.pairId === b.pairId) {
        setMatchedPairIds((prev) => new Set(prev).add(a.pairId));
        setFaceUpIds([]);
        return;
      }
      setLockBoard(true);
      window.setTimeout(() => {
        setFaceUpIds([]);
        setLockBoard(false);
      }, 750);
    },
    [deck, faceUpIds, lockBoard, matchedPairIds],
  );
  const grid = useMemo(
    () => (
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {deck.map((card) => {
          const matched = matchedPairIds.has(card.pairId);
          const faceUp = matched || faceUpIds.includes(card.id);
          return (
            <button
              key={card.id}
              type="button"
              disabled={matched || lockBoard}
              onClick={() => handleCardPress(card)}
              className={cn(
                "flex aspect-square min-h-[4.5rem] items-center justify-center rounded-md border text-2xl transition-all sm:min-h-[5.5rem] sm:text-3xl",
                "border-border bg-muted/40 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50",
                "disabled:cursor-default",
                !faceUp &&
                  "hover:bg-muted/70 active:translate-y-px [&:not(:disabled)]:cursor-pointer",
                faceUp && "bg-card text-card-foreground",
                matched && "border-emerald-500/40 bg-emerald-950/20",
              )}
              aria-pressed={faceUp}
              aria-label={
                faceUp
                  ? `Revealed ${card.symbol}`
                  : "Hidden card, select to reveal"
              }
            >
              <span
                className={cn(
                  "select-none transition-opacity",
                  faceUp ? "opacity-100" : "opacity-0",
                )}
                aria-hidden={!faceUp}
              >
                {card.symbol}
              </span>
              {!faceUp && (
                <span className="absolute text-xs font-medium text-muted-foreground">
                  ?
                </span>
              )}
            </button>
          );
        })}
      </div>
    ),
    [deck, faceUpIds, handleCardPress, lockBoard, matchedPairIds],
  );
  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>Moves {moves}</span>
        <span>
          Pairs {matchedPairIds.size}/{SYMBOLS.length}
        </span>
      </div>
      <div className="relative">{grid}</div>
      {isWon && (
        <p
          className="text-center text-sm font-medium text-emerald-400"
          role="status"
        >
          All pairs matched — nice memory.
        </p>
      )}
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={resetGame}
      >
        New game
      </Button>
    </div>
  );
}
