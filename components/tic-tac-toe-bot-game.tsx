"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mark = "X" | "O";
type Cell = Mark | null;

const LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board: Cell[]): Mark | null {
  for (const [a, b, c] of LINES) {
    const v = board[a];
    if (v && v === board[b] && v === board[c]) return v;
  }
  return null;
}

function isDraw(board: Cell[]): boolean {
  return !getWinner(board) && board.every((cell) => cell !== null);
}

function getAvailableMoves(board: Cell[]): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) moves.push(i);
  }
  return moves;
}

const minimaxMemo = new Map<string, number>();

function minimax(board: Cell[], depth: number, toMove: Mark): number {
  const memoKey = `${toMove}|${depth}|${board.map((c) => c ?? "-").join("")}`;
  const cached = minimaxMemo.get(memoKey);
  if (cached !== undefined) return cached;

  const winner = getWinner(board);
  if (winner === "O") {
    const v = 10 - depth;
    minimaxMemo.set(memoKey, v);
    return v;
  }
  if (winner === "X") {
    const v = depth - 10;
    minimaxMemo.set(memoKey, v);
    return v;
  }
  if (isDraw(board)) {
    minimaxMemo.set(memoKey, 0);
    return 0;
  }

  const moves = getAvailableMoves(board);

  if (toMove === "O") {
    let best = -Infinity;
    for (const move of moves) {
      const next = [...board];
      next[move] = "O";
      best = Math.max(best, minimax(next, depth + 1, "X"));
    }
    minimaxMemo.set(memoKey, best);
    return best;
  }

  let best = Infinity;
  for (const move of moves) {
    const next = [...board];
    next[move] = "X";
    best = Math.min(best, minimax(next, depth + 1, "O"));
  }
  minimaxMemo.set(memoKey, best);
  return best;
}

function findBestMove(board: Cell[]): number {
  const moves = getAvailableMoves(board);
  let bestScore = -Infinity;
  let bestMove = moves[0] ?? 0;

  for (const move of moves) {
    const next = [...board];
    next[move] = "O";
    const score = minimax(next, 0, "X");
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}

export function TicTacToeBotGame() {
  const [board, setBoard] = useState<Cell[]>(() => Array(9).fill(null));
  const [turn, setTurn] = useState<Mark>("X"); // Human is X
  const [isBotThinking, setIsBotThinking] = useState(false);

  const winner = useMemo(() => getWinner(board), [board]);
  const draw = useMemo(() => isDraw(board), [board]);
  const gameOver = winner !== null || draw;

  const statusText = useMemo(() => {
    if (winner === "X") return "You win!";
    if (winner === "O") return "Bot wins!";
    if (draw) return "It's a draw.";
    if (turn === "X") return "Your turn";
    return "Bot thinking…";
  }, [draw, turn, winner]);

  function reset() {
    setBoard(Array(9).fill(null));
    setTurn("X");
    setIsBotThinking(false);
  }

  function playAt(index: number) {
    if (gameOver) return;
    if (turn !== "X") return;
    if (isBotThinking) return;
    if (board[index] !== null) return;

    const next = [...board];
    next[index] = "X";
    setBoard(next);
    setTurn("O");
  }

  useEffect(() => {
    if (turn !== "O") return;
    if (gameOver) return;

    setIsBotThinking(true);
    const t = window.setTimeout(() => {
      setBoard((prev) => {
        const move = findBestMove(prev);
        const next = [...prev];
        next[move] = "O";
        return next;
      });
      setIsBotThinking(false);
      setTurn("X");
    }, 450);

    return () => window.clearTimeout(t);
  }, [gameOver, turn]);

  return (
    <div className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Tic Tac Toe
        </p>
        <p className="text-sm font-medium" aria-live="polite">
          {statusText}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => {
          const isDisabled =
            gameOver || turn !== "X" || isBotThinking || cell !== null;
          return (
            <button
              key={i}
              type="button"
              disabled={isDisabled}
              onClick={() => playAt(i)}
              className={cn(
                "flex aspect-square items-center justify-center rounded-md border text-3xl font-semibold transition-colors",
                "border-border bg-muted/20 text-foreground/90",
                "focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50",
                !isDisabled && "hover:bg-muted/40 active:translate-y-px",
              )}
              aria-label={
                cell
                  ? `Cell ${i + 1}, ${cell}`
                  : `Cell ${i + 1}, empty. Click to place X`
              }
            >
              {cell ?? ""}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={reset}
        >
          New game
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="flex-1"
          onClick={() => {
            setBoard(Array(9).fill(null));
            setTurn("X");
            setIsBotThinking(false);
          }}
          disabled={isBotThinking}
        >
          Clear board
        </Button>
      </div>
    </div>
  );
}
