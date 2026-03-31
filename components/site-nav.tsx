import Link from "next/link";
type SiteNavProps = {
    eyebrow?: string;
    title?: string;
};
export function SiteNav({ eyebrow, title }: SiteNavProps) {
    return (
        <header className="border-b border-border bg-background/80 px-4 py-4 backdrop-blur-sm sm:px-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href="/"
                    className="text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                    All games
                </Link>
                {(eyebrow || title) && (
                    <div className="text-left sm:text-right">
                        {eyebrow && (
                            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foregroung">
                                {eyebrow}
                            </p>
                        )}
                        {title && (
                            <p className="font-heading text-sm font-semibold text-foreground">
                                {title}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </header>
    );     
}