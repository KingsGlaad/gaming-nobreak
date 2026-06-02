import { Metadata } from "next"
import { getJovens } from "@/lib/services/jovens"
import { JovensClient } from "./jovens-client"

export const metadata: Metadata = {
  title: "Gerenciamento de Jovens | Dashboard Gaming Nobreak",
  description: "Gerencie perfis, pontuações, conquistas e níveis de todos os jovens participantes.",
}

export default async function JovensPage() {
  const jovens = await getJovens()
  
  return <JovensClient initialData={jovens} />
}
