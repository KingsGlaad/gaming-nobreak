import { Metadata } from "next";
import { getRegras } from "@/lib/services/regras";
import { RegrasClient } from "./pontuacao-client";

export const metadata: Metadata = {
  title: "Regras de Pontuação | Gaming Nobreak",
  description:
    "Entenda como funciona o sistema de pontuação e como ganhar pontos.",
};

export default async function PublicRegrasPage() {
  const regras = await getRegras();
  const regrasAtivas = regras.filter((r) => r.is_active);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <RegrasClient initialData={regrasAtivas} />
    </div>
  );
}
