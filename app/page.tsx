import Link from "next/link";

const games = [
  {
    href: "/games/heads-tails",
    title: "Heads & Tails",
    description: "Call the coin flip and track wins against chance.",
  },
  {
    href: "/games/match-the-cards",
    title: "Match the Cards",
    description: "Flip tiles and pair every symbol in as few moves as you can.",
  },
  {
    href: "/games/wordle",
    title: "Wordle",
    description: "Guess the five-letter word in six tries with color clues.",
  },
  {
    href: "/games/tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Play against a bot in classic 3x3 tic tac toe.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border px-4 py-12 text-center sm:px-6 sm:py-16">
        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          The Gamers AI
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Games
        </h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          Pick a game below. Each one lives on its own page.
        </p>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-10 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-2">
          {games.map((game) => (
            <li key={game.href}>
              <Link
                href={game.href}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm transition-colors hover:border-ring/60 hover:bg-muted/20"
              >
                <span className="font-heading text-base font-semibold tracking-tight group-hover:text-foreground">
                  {game.title}
                </span>
                <span className="mt-2 text-pretty text-xs leading-relaxed text-muted-foreground">
                  {game.description}
                </span>
                <span className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
                  Play →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
