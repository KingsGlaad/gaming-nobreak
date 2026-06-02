import { Metadata } from "next"
import { getTemporadas } from "@/lib/services/temporadas"
import { TemporadasClient } from "./temporadas-client"

export const metadata: Metadata = {
  title: "Temporadas | Dashboard Gaming Nobreak",
  description: "Crie, edite e gerencie as temporadas ativas de engajamento dos jovens.",
}

export default async function TemporadasPage() {
  const temporadas = await getTemporadas()
  
  return <TemporadasClient initialData={temporadas} />
}
