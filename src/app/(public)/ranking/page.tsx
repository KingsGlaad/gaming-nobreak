import { Metadata } from "next";
import { getRanking } from "@/lib/services/public";
import { RankingList } from "./_components/ranking-list";

export const metadata: Metadata = {
  title: "Classificação Geral | Gaming Nobreak",
  description: "Acompanhe o ranking e a pontuação acumulada dos jovens na temporada atual.",
};

export default async function RankingPage() {
  const ranking = await getRanking();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <RankingList initialRanking={ranking} />
    </div>
  );
}
