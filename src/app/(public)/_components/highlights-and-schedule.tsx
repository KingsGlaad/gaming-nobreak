"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CalendarDays, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ranking } from "@/types/ranking";
import { Activity } from "@/generated/prisma/client";

interface HighlightsAndScheduleProps {
  ranking: Ranking[];
  events: Activity[];
}

export function HighlightsAndSchedule({ ranking, events }: HighlightsAndScheduleProps) {
  return (
    <section className="max-w-5xl mx-auto pt-16 border-t border-border/50 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Card className="h-full border-primary/20 bg-card/40 backdrop-blur-sm hover:border-primary/50 transition-colors group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary group-hover:animate-[wiggle_1s_ease-in-out_infinite]" aria-hidden="true" />
                Destaques da Temporada
              </CardTitle>
              <CardDescription>
                Confira quem está liderando o ranking no momento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" role="list">
                {ranking.length > 0 ? (
                  (() => {
                    let currentRank = 0;
                    let previousPoints = -1;
                    return ranking.map((user, index) => {
                      if (user.points !== previousPoints) {
                        currentRank++;
                        previousPoints = user.points;
                      }
                      
                      return (
                        <div
                          role="listitem"
                          key={user.id}
                          className={`flex items-center gap-4 p-3 rounded-lg ${
                            currentRank === 1
                              ? "bg-primary/10 border border-primary/20 hover:bg-primary/20"
                              : "bg-secondary/10 border border-secondary/20 hover:bg-secondary/20"
                          } transition-colors`}
                        >
                          <div
                            className={`flex items-center justify-center h-8 w-8 rounded-full ${
                              currentRank === 1
                                ? "bg-gradient-yellow/20 text-gradient-yellow font-bold shadow-[0_0_10px_var(--color-gradient-yellow)]"
                                : "bg-gray-400/20 text-gray-400 font-bold"
                            }`}
                          >
                            {currentRank}
                          </div>
                          <div className="flex-1 font-medium">{user.name}</div>
                          <div
                            className={`${
                              currentRank === 1 ? "text-primary" : "text-secondary"
                            } font-bold`}
                          >
                            {user.points} pts
                          </div>
                        </div>
                      );
                    });
                  })()
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Nenhum ranking disponível ainda.
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  href="/ranking"
                  className="text-sm text-primary hover:underline flex items-center gap-1 font-medium group/link"
                  aria-label="Acessar página com o ranking completo"
                >
                  Ver ranking completo{" "}
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Card className="h-full border-border/50 bg-card/40 backdrop-blur-sm hover:border-secondary/50 transition-colors group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-secondary group-hover:scale-110 transition-transform" aria-hidden="true" />
                Próximos Eventos
              </CardTitle>
              <CardDescription>
                O que vai rolar nos próximos dias.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" role="list">
                {events.length > 0 ? (
                  events.map((event) => {
                    const dateObj = new Date(event.activity_date);
                    const formattedDate = dateObj
                      .toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "2-digit",
                        month: "2-digit",
                      })
                      .replace("-feira", "");
                    const formattedTime = dateObj.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <div
                        key={event.id}
                        role="listitem"
                        className="flex flex-col gap-1 p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 hover:border-secondary/30 transition-all"
                      >
                        <div className="font-medium">{event.title}</div>
                        <time dateTime={dateObj.toISOString()} className="text-xs text-muted-foreground capitalize">
                          {formattedDate}, {formattedTime} -{" "}
                          {event.description || "Evento"}
                        </time>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Nenhum evento próximo.
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <Link
                  href="/calendario"
                  className="text-sm text-secondary hover:underline flex items-center gap-1 font-medium group/link"
                  aria-label="Acessar o calendário completo de eventos"
                >
                  Ver calendário completo{" "}
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
