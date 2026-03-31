import type { Metadata } from "next";
import { HeadsTailsGame } from "@/components/heads-tails-game";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
    title: "Heads & Tails",
    description: "Call heads or tails and flip the coin.",
};

export default function HeadsTailsPage() {
    return (
        <div className="flex flex-1 flex-col">
            <SiteNav eyebrow="The Gamers AI" title="Heads & Tails" />
            <div className="flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
                <p className="mb-8 max-w-md text-center text-sm text-muted-foreground">
                    Pick a side, flip the coin, and see if luck is on your side.
                </p>
                <HeadsTailsGame />
            </div>
        </div>
        
    );
}