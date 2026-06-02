import { Metadata } from "next"
import { getLideres } from "@/actions/lideres"
import { LideresClient } from "./lideres-client"

export const metadata: Metadata = {
  title: "Gerenciamento de Líderes | Dashboard Gaming Nobreak",
  description: "Gerencie as contas e permissões dos líderes e administradores na plataforma.",
}

export default async function LideresPage() {
  const lideres = await getLideres()
  
  return <LideresClient initialData={lideres} />
}
