import { HeadsTailsGame } from "@/components/heads-tails-game";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-16 sm:py-24">
      <header className="mb-10 max-w-lg text-center">
        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          The Gamer
        </p>
        <h1 className="text-balance font-heading text-3xl font-semibold tracking-tight text-foregroung sm:text-4xl">
          Heads &amp; Tails
        </h1>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foregroung">
          Call it in the air. One flip, one winner.
        </p>
      </header>
      <HeadsTailsGame />
    </div>
  );
}
