"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Achievement } from "@/generated/prisma/client";

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export function AchievementsSection({
  achievements,
}: AchievementsSectionProps) {
  // Se não houver conquistas no banco de dados, podemos exibir as conquistas padrão (fallback) com emojis
  const displayAchievements =
    achievements.length > 0
      ? achievements
      : [
          {
            id: "1",
            name: "Estrela Guia",
            description: "Trouxe 5 visitantes",
            icon: "⭐",
            condition_value: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
            name: "On Fire",
            description: "4 cultos seguidos",
            icon: "🔥",
            condition_value: 150,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "3",
            name: "Célula Viva",
            description: "100% nas células",
            icon: "👥",
            condition_value: 200,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

  return (
    <section className="max-w-5xl mx-auto space-y-12 text-center pt-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
          <Award className="text-primary h-8 w-8 drop-shadow-[0_0_10px_rgba(var(--primary),0.6)] animate-pulse" aria-hidden="true" />{" "}
          Conquistas Exclusivas
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Além dos níveis, você pode desbloquear medalhas (Badges) ao realizar
          missões específicas durante a temporada.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 justify-items-center max-w-4xl mx-auto">
        {displayAchievements.map((ach, index) => (
          <motion.div
            key={ach.id}
            whileHover={{ scale: 1.1, y: -10 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col items-center gap-3 group cursor-help"
          >
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 border-2 text-4xl
              ${
                ach.icon === "🔥" || ach.icon === "flame"
                  ? "bg-gradient-yellow/10 border-gradient-yellow/30 group-hover:bg-gradient-yellow/20 group-hover:shadow-[0_0_30px_var(--color-gradient-yellow)]"
                  : ach.icon === "👥" || ach.icon === "users"
                    ? "bg-secondary/10 border-secondary/30 group-hover:bg-secondary/20 group-hover:shadow-[0_0_30px_rgba(var(--secondary),0.6)]"
                    : "bg-primary/10 border-primary/30 group-hover:bg-primary/20 group-hover:shadow-[0_0_30px_rgba(var(--primary),0.6)]"
              }`}
            >
              {ach.icon}
            </div>
            <div className="text-center">
              <div className="font-bold">{ach.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {ach.description}
              </div>
              {ach.condition_value && (
                <div className="text-[10px] text-primary font-semibold mt-0.5">
                  +{ach.condition_value} XP
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
