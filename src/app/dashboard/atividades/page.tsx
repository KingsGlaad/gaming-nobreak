import { Metadata } from "next"
import { getAtividades, getTiposAtividade } from "@/actions/atividades"
import { getTemporadas } from "@/actions/temporadas"
import { AtividadesClient } from "./atividades-client"

export const metadata: Metadata = {
  title: "Gerenciamento de Atividades | Dashboard Gaming Nobreak",
  description: "Gerencie células, cultos, presenças, pontuações e atividades de toda a temporada.",
}

export default async function AtividadesPage() {
  const atividades = await getAtividades()
  const temporadas = await getTemporadas()
  const tiposAtividade = await getTiposAtividade()
  
  return (
    <AtividadesClient 
      initialData={atividades} 
      temporadas={temporadas}
      tiposAtividade={tiposAtividade}
    />
  )
}
