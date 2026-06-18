"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(var(--primary),0.3)] group-hover:shadow-[0_0_20px_rgba(var(--primary),0.6)] transition-all">
            <Image
              src="/images/logo1.jpg"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
          </div>
          <span className="font-bold tracking-tight">Gaming Nobreak</span>
        </Link>

        {/* Menu Desktop */}
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

        {/* Menu Mobile */}
        <div className="md:hidden flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[80vw] sm:w-[350px] mt-2 py-2"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(var(--primary),0.3)]">
                    <Image
                      src="/images/logo1.jpg"
                      alt="Logo"
                      width={32}
                      height={32}
                      className="rounded-lg"
                    />
                  </div>
                  <span className="font-bold tracking-tight">
                    Gaming Nobreak
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-6 mt-10 px-2">
                <Link
                  href="/"
                  className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors border-b border-border/50 pb-2"
                >
                  Início
                </Link>
                <Link
                  href="/ranking"
                  className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors border-b border-border/50 pb-2"
                >
                  Ranking
                </Link>
                <Link
                  href="/calendario"
                  className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors border-b border-border/50 pb-2"
                >
                  Calendário
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
