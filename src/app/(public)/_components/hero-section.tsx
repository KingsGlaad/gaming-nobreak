"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Season } from "@/generated/prisma/client";

interface HeroSectionProps {
  season: Season | null;
}

export function HeroSection({ season }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 w-full">
      {/* Imagem de background em tela cheia */}
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
        <Image
          src="/hero-bg.png"
          alt="Gaming Hero Background"
          fill
          className="object-cover opacity-30 md:opacity-50 mix-blend-screen"
          priority
        />
        {/* Overlays de gradiente para transição suave */}
        <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
      </div>

      {season && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-lg font-bold mb-6 backdrop-blur-md"
        >
          <Award className="w-4 h-4 animate-pulse" />
          {season.name}
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tight relative z-10"
      >
        Transforme sua Jornada <br className="hidden md:block" /> em uma{" "}
        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-purple-400 to-gradient-yellow drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">
          Aventura Épica!
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-xl text-muted-foreground max-w-2xl mx-auto mt-8 relative z-10"
      >
        O Gaming Nobreak é a gamificação da nossa juventude. Participe,
        desenvolva-se, alcance novas conquistas e suba no ranking!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col sm:flex-row justify-center gap-4 pt-10 relative z-10"
      >
        <Link href="/ranking">
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-secondary/50 hover:bg-secondary/10 text-foreground backdrop-blur-sm transition-all h-14 px-8 text-lg rounded-full hover:scale-105 group"
          >
            <Trophy className="mr-2 h-5 w-5 group-hover:text-gradient-yellow transition-colors" />
            Ver Ranking
          </Button>
        </Link>
        <Link href="/registro">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground transition-all h-14 px-8 text-lg rounded-full hover:scale-105 shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)]"
          >
            Começar Agora
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
