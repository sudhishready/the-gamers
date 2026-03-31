import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { WordleGame } from "@/components/wordle-game";

export const metadata: Metadata = {
    title: "Wordle",
    description: "Guess the five-letter word in six tries.",
};

export default function WordlePage() {
    return (
        <div className="flex flex-1 flex-col">
            <SiteNav eyebrow="The Gamers" title="Wordle" />
            <div className="flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
                <p className="mb-8 max-w-md text-center text-sm text-muted-foreground">
                    Guess the word in six tries. Greens are exact; yellows are elsewhere
                    in the word.
                </p>
                <WordleGame />
            </div>
        </div>
    );
}