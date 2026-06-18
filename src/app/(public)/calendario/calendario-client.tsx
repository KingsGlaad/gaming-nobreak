"use client";

import { Activity } from "@/generated/prisma/client";
import { CalendarDays, Calendar } from "lucide-react";
import { CalendarCard } from "./_componets/calendar-card";

interface CalendarioClientProps {
  initialEvents: Activity[];
}

export function CalendarioClient({ initialEvents }: CalendarioClientProps) {
  // Agrupar eventos por mês e ano
  const groupedEvents = initialEvents.reduce((acc, event) => {
    const date = new Date(event.activity_date);
    const monthKey = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date);
    
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(event);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <CalendarDays className="h-8 w-8 text-secondary drop-shadow-[0_0_10px_rgba(var(--secondary),0.8)]" />
          Calendário de Eventos
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Programe-se para as próximas atividades, células e cultos e não perca nenhum ponto!
        </p>
      </div>

      <div className="space-y-16">
        {Object.entries(groupedEvents).map(([month, events]) => (
          <div key={month} className="space-y-6 relative">
            {/* Cabeçalho do mês com estilo criativo e sticky */}
            <div className="flex items-center gap-4 sticky top-[72px] z-10 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 md:mx-0 md:px-0 rounded-b-xl border-b md:border-none shadow-[0_4px_20px_-15px_rgba(0,0,0,0.1)] md:shadow-none">
              <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 shadow-sm">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold capitalize text-foreground tracking-tight drop-shadow-sm">
                {month}
              </h2>
              <div className="hidden md:flex h-[2px] flex-1 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent rounded-full ml-4" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {events.map((event) => (
                <CalendarCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ))}
        
        {initialEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-24 bg-secondary/5 rounded-3xl border border-secondary/10 shadow-inner">
            <CalendarDays className="h-20 w-20 text-muted-foreground/30 mb-6 drop-shadow-sm" />
            <h3 className="text-2xl font-bold text-foreground">Nenhum evento agendado</h3>
            <p className="text-muted-foreground mt-3 max-w-md text-lg">
              Não há eventos programados para os próximos dias. Volte mais tarde!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

