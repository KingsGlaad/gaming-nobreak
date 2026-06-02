import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_10px_rgba(var(--primary),0.3)] group-hover:shadow-[0_0_20px_rgba(var(--primary),0.6)] transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)] group-hover:scale-110 transition-transform"
            >
              <rect width="20" height="12" x="2" y="6" rx="2" />
              <path d="M12 12h.01" />
              <path d="M17 12h.01" />
              <path d="M7 12h.01" />
            </svg>
          </div>
          <span className="font-bold tracking-tight">Gaming Nobreak</span>
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Início
          </Link>
          <Link
            href="/ranking"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Ranking
          </Link>
          <Link
            href="/calendario"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Calendário
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button
              variant="outline"
              className="border-gradient-yellow/50 hover:bg-gradient-to-r hover:from-gradient-yellow hover:to-gradient-yellow-end text-primary hover:text-black transition-all shadow-[0_0_10px_var(--color-gradient-yellow)] hover:shadow-[0_0_20px_var(--color-gradient-yellow)]"
            >
              Entrar
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
