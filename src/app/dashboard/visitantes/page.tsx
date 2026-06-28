import { Metadata } from "next";
import { getVisitantes } from "@/lib/services/visitantes";
import { getJovens } from "@/lib/services/jovens";
import { VisitantesClient } from "./visitantes-client";

export const metadata: Metadata = {
  title: "Visitantes | Dashboard Gaming Nobreak",
  description: "Gerenciamento de visitantes.",
};

export default async function VisitantesPage() {
  const visitantes = await getVisitantes();
  const jovens = await getJovens();

  return <VisitantesClient initialData={visitantes} jovens={jovens} />;
}
