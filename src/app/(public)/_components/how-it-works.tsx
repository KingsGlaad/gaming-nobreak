"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CalendarDays, Users, Flame } from "lucide-react";

export function HowItWorks() {
  return (
    <section className="max-w-5xl mx-auto space-y-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
          <Target className="text-gradient-yellow h-8 w-8 drop-shadow-[0_0_10px_var(--color-gradient-yellow)]" />{" "}
          Como Funciona?
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A cada ação no grupo de jovens, você acumula XP (pontos), sobe de
          nível e desbloqueia conquistas exclusivas.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full bg-card/40 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_15px_40px_-10px_rgba(var(--primary),0.4)] group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_15px_rgba(var(--primary),0.4)] transition-all">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>1. Participe</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground group-hover:text-foreground transition-colors">
              Marque presença nos cultos de jovens, células e eventos
              especiais. Quanto mais você participa, mais pontos ganha.
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full bg-card/40 backdrop-blur-sm border-gradient-yellow/20 hover:border-gradient-yellow/50 transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_15px_40px_-10px_var(--color-gradient-yellow)] group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-yellow/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-[0_0_15px_var(--color-gradient-yellow)] transition-all">
                <Users className="h-6 w-6 text-gradient-yellow" />
              </div>
              <CardTitle>2. Engaje</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground group-hover:text-foreground transition-colors">
              Traga visitantes, participe dos desafios propostos e interaja
              com a comunidade. Engajamento gera muito XP!
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="h-full bg-card/40 backdrop-blur-sm border-secondary/20 hover:border-secondary/50 transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_15px_40px_-10px_rgba(var(--secondary),0.4)] group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-[0_0_15px_rgba(var(--secondary),0.4)] transition-all">
                <Flame className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle>3. Evolua</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground group-hover:text-foreground transition-colors">
              Acumule pontos to subir de nível. Ao final da temporada, os
              melhores do ranking recebem recompensas exclusivas!
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
