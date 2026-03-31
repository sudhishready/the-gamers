import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { TicTacToeBotGame } from "@/components/tic-tac-toe-bot-game";

export const metadata: Metadata = {
  title: "Tic Tac Toe",
  description: "Play tic tac toe against a bot.",
};

export default function TicTacToePage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav eyebrow="The Gamers AI" title="Tic Tac Toe" />
      <div className="flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
        <p className="mb-8 max-w-md text-center text-sm text-muted-foreground">
          You are <span className="font-semibold text-foreground">X</span>.
          Click a square to place your mark. The bot plays{" "}
          <span className="font-semibold text-foreground">O</span>.
        </p>
        <TicTacToeBotGame />
      </div>
    </div>
  );
}
