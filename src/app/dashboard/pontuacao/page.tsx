/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const sortedJovens = [...jovens].sort(
    (a, b) => (b.points || 0) - (a.points || 0),
  );

  const rankedJovens = sortedJovens.reduce((acc, jovem) => {
    const points = jovem.points || 0;
    const last = acc[acc.length - 1];
    const rank = last
      ? points === (last.points || 0)
        ? last.rank
        : last.rank + 1
      : 1;

    acc.push({ ...jovem, rank });
    return acc;
  }, [] as any[]);

  return <PontuacaoClient initialData={rankedJovens} />;
}
