import { Metadata } from "next";
import { getAchievements } from "@/lib/services/conquistas";
import { ConquistasClient } from "./conquistas-client";

export const metadata: Metadata = {
  title: "Conquistas (Achievements) | Dashboard Gaming Nobreak",
  description:
    "Gerencie e configure as conquistas que os jovens podem desbloquear no game.",
};

export default async function ConquistasPage() {
  const conquistas = await getAchievements();

  return <ConquistasClient initialData={conquistas} />;
}
