"use client";

import { Activity } from "@/generated/prisma/client";
import { CalendarDays } from "lucide-react";
import { CalendarCard } from "./_componets/calendar-card";

interface CalendarioClientProps {
  initialEvents: Activity[];
}

export function CalendarioClient({ initialEvents }: CalendarioClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <CalendarDays className="h-8 w-8 text-secondary drop-shadow-[0_0_10px_rgba(var(--secondary),0.8)]" />
          Calendário de Eventos
        </h1>
        <p className="text-muted-foreground">
          Programe-se para as próximas atividades, células e cultos e não perca nenhum ponto!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {initialEvents.map((event) => (
          <CalendarCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
