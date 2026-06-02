import {
  getCurrentSeason,
  getTopRanking,
  getUpcomingEvents,
  getAchivements,
} from "@/lib/services/public";

// Importações dos novos componentes separados
import { HeroSection } from "./_components/hero-section";
import { HowItWorks } from "./_components/how-it-works";
import { TiersSection } from "./_components/tiers-section";
import { AchievementsSection } from "./_components/achievements-section";
import { HighlightsAndSchedule } from "./_components/highlights-and-schedule";

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
