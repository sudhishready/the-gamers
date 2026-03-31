import type { Metadata } from "next";
import { MatchTheCardsGame } from "@/components/match-the-cards-game";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
    title: "Match the cards",
    description: "Meomory game: flip cards and match every pair.",
};

export default function MatchTheCardsPage() {
    return (
        <div className="flex flex-1 flex-col">
            <SiteNav eyebrow=" The Gamers Hub" title="Match the Cards" />
            <div className="flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
                <p className="mb-8 max-w-md text-center text-sm text-muted-foreground">
                    Sixteen titles, eight pairs. Turn over two at a time and remember where
                    each symbol hides.
                </p>
                <MatchTheCardsGame />
            </div>
        </div>
    );
    
    
}