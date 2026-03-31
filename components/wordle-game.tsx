"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  betterFeedback,
  evaluateGuess,
  type LetterFeedback,
} from "@/lib/wordle";
import { pickRandomWord, WORDLE_WORD_SET } from "@/lib/wordle-words";
import { cn } from "@/lib/utils";

const ROWS = 6;
const LEN = 5;

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
] as const;

type GuessRow = {
  guess: string;
  feedback: LetterFeedback[];
};

type GameStatus = "playing" | "won" | "lost";

function cellClasses(
  feedback: LetterFeedback | undefined,
  mode: "future" | "typing" | "done",
): string {
  if (mode === "future") {
    return "border-border/60 bg-transparent";
  }
  if (mode === "typing") {
    return "border-border bg-muted/25 text-foreground";
  }
  if (!feedback) {
    return "border-border bg-muted/30 text-foreground";
  }
  switch (feedback) {
    case "correct":
      return "border-emerald-500 bg-emerald-600/55 text-white";
    case "present":
      return "border-amber-500 bg-amber-600/45 text-foreground";
    default:
      return "border-muted-foreground/35 bg-muted/80 text-muted-foreground";
  }
}

function keyClasses(status: LetterFeedback | undefined): string {
  if (!status) {
    return "bg-muted/50 text-foreground hover:bg-muted/80";
  }
  switch (status) {
    case "correct":
      return "border-emerald-600 bg-emerald-600/70 text-white hover:bg-emerald-600/85";
    case "present":
      return "border-amber-600 bg-amber-600/55 text-foreground hover:bg-amber-600/70";
    default:
      return "border-muted-foreground/30 bg-muted text-muted-foreground hover:bg-muted/90";
  }
}

export function WordleGame() {
  const [target, setTarget] = useState<string | null>(null);
  const [rows, setRows] = useState<GuessRow[]>([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState<GameStatus>("playing");
  const [toast, setToast] = useState<string | null>(null);
  const [shakeRow, setShakeRow] = useState(false);

  useEffect(() => {
    setTarget(pickRandomWord());
  }, []);

  const keyHints = useMemo(() => {
    const m: Record<string, LetterFeedback> = {};
    for (const row of rows) {
      for (let i = 0; i < LEN; i++) {
        const L = row.guess[i]!;
        m[L] = betterFeedback(m[L], row.feedback[i]!);
      }
    }
    return m;
  }, [rows]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2000);
  }, []);

  const submit = useCallback(() => {
    if (!target || status !== "playing") return;
    if (current.length !== LEN) {
      showToast("Not enough letters");
      setShakeRow(true);
      window.setTimeout(() => setShakeRow(false), 450);
      return;
    }
    const word = current.toUpperCase();
    if (!WORDLE_WORD_SET.has(word)) {
      showToast("Not in word list");
      setShakeRow(true);
      window.setTimeout(() => setShakeRow(false), 450);
      return;
    }

    const feedback = evaluateGuess(word, target);
    const nextRows = [...rows, { guess: word, feedback }];
    setRows(nextRows);
    setCurrent("");

    const win = feedback.every((f) => f === "correct");
    if (win) {
      setStatus("won");
      return;
    }
    if (nextRows.length >= ROWS) {
      setStatus("lost");
    }
  }, [current, rows, showToast, status, target]);

  const addLetter = useCallback(
    (ch: string) => {
      if (status !== "playing" || !target) return;
      if (current.length >= LEN) return;
      setCurrent((c) => c + ch);
    },
    [current.length, status, target],
  );

  const backspace = useCallback(() => {
    if (status !== "playing") return;
    setCurrent((c) => c.slice(0, -1));
  }, [status]);

  const newGame = useCallback(() => {
    setTarget(pickRandomWord());
    setRows([]);
    setCurrent("");
    setStatus("playing");
    setToast(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (status !== "playing" || !target) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      if (k === "Enter") {
        e.preventDefault();
        submit();
        return;
      }
      if (k === "Backspace") {
        e.preventDefault();
        backspace();
        return;
      }
      if (/^[a-zA-Z]$/.test(k)) {
        e.preventDefault();
        addLetter(k.toUpperCase());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [addLetter, backspace, status, submit, target]);

  const activeRow = rows.length;

  if (!target) {
    return (
      <p className="text-center text-sm text-muted-foreground">Loading…</p>
    );
  }

  return (
    <div className="flex w-full max-w-[min(100%,22rem)] flex-col items-center gap-6">
      {toast && (
        <p
          className="rounded-md border border-border bg-card px-3 py-1.5 text-center text-xs font-medium text-foreground shadow-sm"
          role="status"
        >
          {toast}
        </p>
      )}

      <div
        className={cn(
          "grid w-full gap-1.5",
          shakeRow && "animate-wordle-shake",
        )}
      >
        {Array.from({ length: ROWS }, (_, r) => (
          <div
            key={r}
            className="grid grid-cols-5 gap-1.5"
            aria-label={r === activeRow ? "Current guess" : `Row ${r + 1}`}
          >
            {Array.from({ length: LEN }, (_, c) => {
              const isFuture =
                r > activeRow || (r === activeRow && status !== "playing");
              const isDone = r < rows.length;

              if (isFuture) {
                return (
                  <div
                    key={c}
                    className={cn(
                      "flex aspect-square max-h-14 min-h-12 items-center justify-center rounded-sm border text-lg font-semibold uppercase sm:text-xl",
                      cellClasses(undefined, "future"),
                    )}
                  >
                    {"\u00a0"}
                  </div>
                );
              }

              if (isDone) {
                const letter = rows[r]!.guess[c]!;
                const feedback = rows[r]!.feedback[c];
                return (
                  <div
                    key={c}
                    className={cn(
                      "flex aspect-square max-h-14 min-h-12 items-center justify-center rounded-sm border text-lg font-semibold uppercase sm:text-xl",
                      cellClasses(feedback, "done"),
                    )}
                  >
                    {letter}
                  </div>
                );
              }

              const letter = current[c] ?? "";
              const hasLetter = letter !== "";
              return (
                <div
                  key={c}
                  className={cn(
                    "flex aspect-square max-h-14 min-h-12 items-center justify-center rounded-sm border text-lg font-semibold uppercase sm:text-xl",
                    cellClasses(undefined, hasLetter ? "typing" : "future"),
                  )}
                >
                  {hasLetter ? letter : "\u00a0"}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {(status === "won" || status === "lost") && (
        <div className="space-y-2 text-center">
          {status === "won" && (
            <p className="text-sm font-medium text-emerald-400" role="status">
              Solved in {rows.length} {rows.length === 1 ? "try" : "tries"}.
            </p>
          )}
          {status === "lost" && (
            <p className="text-sm text-rose-400" role="status">
              The word was{" "}
              <span className="font-semibold text-foreground">{target}</span>.
            </p>
          )}
          <Button type="button" variant="secondary" size="lg" onClick={newGame}>
            New game
          </Button>
        </div>
      )}

      <div className="flex w-full max-w-xl flex-col gap-1.5">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((key) => {
              const wide = key === "Enter" || key === "Backspace";
              const hint = key.length === 1 ? keyHints[key] : undefined;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={status !== "playing"}
                  className={cn(
                    "rounded-sm border px-1 py-2 text-[10px] font-semibold uppercase tracking-wide transition-colors sm:text-xs",
                    wide
                      ? "min-w-[2.75rem] px-2 sm:min-w-[3.25rem]"
                      : "min-w-[1.65rem] sm:min-w-[2rem]",
                    keyClasses(hint),
                    status !== "playing" && "opacity-60",
                  )}
                  onClick={() => {
                    if (key === "Enter") submit();
                    else if (key === "Backspace") backspace();
                    else addLetter(key);
                  }}
                >
                  {key === "Backspace" ? "⌫" : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
