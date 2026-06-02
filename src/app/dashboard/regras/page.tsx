import { Metadata } from "next"
import { getRegras } from "@/lib/services/regras"
import { RegrasClient } from "./regras-client"

export const metadata: Metadata = {
  title: "Regras e Pontuações | Dashboard Gaming Nobreak",
  description: "Gerencie e configure os critérios e regras de pontuações de atividades da plataforma.",
}

export default async function RegrasPage() {
  const regras = await getRegras()
  
  return <RegrasClient initialData={regras} />
}
