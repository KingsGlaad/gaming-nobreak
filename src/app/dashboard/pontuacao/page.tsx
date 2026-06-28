import { Metadata } from "next";
import { getJovens } from "@/lib/services/jovens";
import { PontuacaoClient } from "./pontuacao-client";

export const metadata: Metadata = {
  title: "Pontuação | Dashboard Gaming Nobreak",
  description: "Ranking e pontuação dos jovens.",
};

export default async function PontuacaoPage() {
  const jovens = await getJovens();

  // Ordena por pontos de forma decrescente para o ranking
  const sortedJovens = jovens.sort((a, b) => (b.points || 0) - (a.points || 0));

  return <PontuacaoClient initialData={sortedJovens} />;
}
