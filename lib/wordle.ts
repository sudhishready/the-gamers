export type LetterFeedback = "correct" | "present" | "absent";

export function evaluateGuess(guess: string, target: string): LetterFeedback[] {
    const g = guess.toUpperCase();
    const t = target.toUpperCase();
    const out: LetterFeedback[] = Array(5).fill("absent");
    const remaining = t.split("");
    
    for (let i = 0; i < 5; i++) {
        if (g[i] === t[i]) {
            out[i] = "correct";
            remaining[i] = "";
        }
    }

    for (let i = 0; i < 5; i++) {
        if (out[i] === "correct") continue;
        const j = remaining.findIndex((c) => c !== "" && c === g[i]);
        if (j !== -1) {
            out[i] = "present";
            remaining[j] = "";
            }
    } 

    return out;
}

const RANK: Record<LetterFeedback, number> = {
    correct: 3,
    present: 2,
    absent: 1,
};

export function betterFeedback(
    a: LetterFeedback | undefined,
    b: LetterFeedback
): LetterFeedback {
    if (!a) return b;
    return RANK[b] > RANK[a] ? b : a;
}