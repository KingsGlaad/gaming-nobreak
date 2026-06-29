"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function TiersSection() {
  return (
    <section className="max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="bg-card/20 border border-primary/20 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-primary/50 transition-all duration-700 hover:shadow-[0_0_50px_-10px_rgba(var(--primary),0.3)]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-yellow/10 blur-[80px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-gradient-yellow/20 group-hover:scale-150" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-primary/20 group-hover:scale-150" />

        <div className="space-y-12 relative z-10 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary pb-2">
              Suba de Nível e Mostre sua Força
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Sua jornada é dividida em níveis (Tiers). Comece como iniciante
              e alcance os níveis mais altos mostrando constância e dedicação.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
            <motion.div
              whileHover={{ y: -15, scale: 1.05 }}
              className="flex flex-col items-center gap-4 group/tier"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image
                  src="/tier-bronze.png"
                  alt="Nível Bronze"
                  fill
                  className="object-contain drop-shadow-xl group-hover/tier:drop-shadow-[0_0_25px_rgba(184,115,51,0.6)] transition-all duration-300"
                />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl text-[#cd7f32]">Bronze</h3>
                <p className="text-sm text-muted-foreground">O Começo</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -15, scale: 1.05 }}
              className="flex flex-col items-center gap-4 group/tier mt-0 md:mt-8"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image
                  src="/tier-silver.png"
                  alt="Nível Prata"
                  fill
                  className="object-contain drop-shadow-xl group-hover/tier:drop-shadow-[0_0_25px_rgba(192,192,192,0.6)] transition-all duration-300"
                />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl text-slate-300">Prata</h3>
                <p className="text-sm text-muted-foreground">Engajados</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -15, scale: 1.05 }}
              className="flex flex-col items-center gap-4 group/tier mt-0 md:mt-16"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image
                  src="/tier-gold.png"
                  alt="Nível Ouro"
                  fill
                  className="object-contain drop-shadow-xl group-hover/tier:drop-shadow-[0_0_25px_var(--color-gradient-yellow)] transition-all duration-300"
                />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl text-gradient-yellow">
                  Ouro
                </h3>
                <p className="text-sm text-muted-foreground">O Destaque</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -15, scale: 1.05 }}
              className="flex flex-col items-center gap-4 group/tier mt-0 md:mt-24"
            >
              <div className="relative w-36 h-36 md:w-48 md:h-48 -mt-2">
                <Image
                  src="/tier-diamond.png"
                  alt="Nível Diamante"
                  fill
                  className="object-contain drop-shadow-[0_0_30px_rgba(var(--primary),0.8)] group-hover/tier:drop-shadow-[0_0_50px_rgba(var(--primary),1)] transition-all duration-300 animate-[pulse_4s_infinite]"
                />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-2xl text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-300">
                  Nobreak
                </h3>
                <p className="text-sm text-primary font-medium">A Elite</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
