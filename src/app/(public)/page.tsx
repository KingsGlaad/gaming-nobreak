"use client";

import { useEffect, useState } from "react";
import {
  getCurrentSeason,
  getTopRanking,
  getUpcomingEvents,
  getAchivements,
} from "@/lib/services/public";
import { Ranking } from "@/types/ranking";
import { Activity, Season, Achievement } from "@/generated/prisma/client";

// Importações dos novos componentes separados
import { HeroSection } from "./_components/hero-section";
import { HowItWorks } from "./_components/how-it-works";
import { TiersSection } from "./_components/tiers-section";
import { AchievementsSection } from "./_components/achievements-section";
import { HighlightsAndSchedule } from "./_components/highlights-and-schedule";

export default function Home() {
  const [ranking, setRanking] = useState<Ranking[]>([]);
  const [events, setEvents] = useState<Activity[]>([]);
  const [season, setSeason] = useState<Season | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    async function loadData() {
      const topRanking = await getTopRanking(2);
      const upcomingEvents = await getUpcomingEvents(2);
      const currentSeason = await getCurrentSeason();
      const dbAchievements = await getAchivements();
      
      setRanking(topRanking);
      setEvents(upcomingEvents);
      setSeason(currentSeason);
      setAchievements(dbAchievements);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* 1. HERO SECTION */}
      <HeroSection season={season} />

      {/* 2. COMO FUNCIONA */}
      <HowItWorks />

      {/* 3. NÍVEIS E SISTEMA DE RANQUEAMENTO */}
      <TiersSection />

      {/* 4. CONQUISTAS (BADGES) */}
      <AchievementsSection achievements={achievements} />

      {/* 5. DESTAQUES & AGENDA */}
      <HighlightsAndSchedule ranking={ranking} events={events} />
    </div>
  );
}
