import {
  getCurrentSeason,
  getTopRanking,
  getUpcomingEvents,
  getAchivements,
} from "@/lib/services/public";

import dynamic from "next/dynamic";
import { HeroSection } from "./_components/hero-section";

const HowItWorks = dynamic(() => import("./_components/how-it-works").then(mod => mod.HowItWorks));
const TiersSection = dynamic(() => import("./_components/tiers-section").then(mod => mod.TiersSection));
const AchievementsSection = dynamic(() => import("./_components/achievements-section").then(mod => mod.AchievementsSection));
const HighlightsAndSchedule = dynamic(() => import("./_components/highlights-and-schedule").then(mod => mod.HighlightsAndSchedule));

export default async function Home() {
  const ranking = await getTopRanking(2);
  const events = await getUpcomingEvents(2);
  const season = await getCurrentSeason();
  const achievements = await getAchivements();

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
