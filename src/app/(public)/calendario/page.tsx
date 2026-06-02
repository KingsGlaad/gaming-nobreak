import { Metadata } from "next";
import { getUpcomingEvents } from "@/lib/services/public";
import { CalendarioClient } from "./calendario-client";

export const metadata: Metadata = {
  title: "Calendário de Eventos | Gaming Nobreak",
  description: "Programe-se para as próximas atividades, células e cultos, e fique por dentro das pontuações.",
};

export default async function CalendarPage() {
  const events = await getUpcomingEvents(10);

  return <CalendarioClient initialEvents={events} />;
}
