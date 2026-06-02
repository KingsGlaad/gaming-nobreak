import { Metadata } from "next"
import { getAtividades } from "@/actions/atividades"
import { AtividadesClient } from "./atividades-client"

export const metadata: Metadata = {
  title: "Gerenciamento de Atividades | Dashboard Gaming Nobreak",
  description: "Gerencie células, cultos, presenças, pontuações e atividades de toda a temporada.",
}

export default async function AtividadesPage() {
  const atividades = await getAtividades()
  
  return (
    <AtividadesClient 
      initialData={atividades} 
    />
  )
}
