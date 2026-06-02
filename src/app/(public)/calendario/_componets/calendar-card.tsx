import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Activity, ActivityType } from "@/generated/prisma/client";

interface CalendarCardProps {
  event: (Activity & { activity_type?: ActivityType | null }) | null;
}

export function CalendarCard({ event }: CalendarCardProps) {
  if (!event) {
    return (
      <div className="border-border/50 bg-card/40 backdrop-blur-sm hover:border-secondary/50 transition-colors group">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl group-hover:text-secondary transition-colors">
            Nenhum evento encontrado
          </CardTitle>
        </CardHeader>
      </div>
    );
  }

  const dateObj = new Date(event.activity_date);
  const formattedDate = dateObj
    .toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    })
    .replace("-feira", "");

  const formattedTime = dateObj.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card
      key={event.id}
      className="border-border/50 bg-card/40 backdrop-blur-sm hover:border-secondary/50 transition-colors group"
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-300/10 text-amber-300 border border-amber-300/20">
            {event.activity_type?.name || "Atividade"}
          </span>
        </div>
        <CardTitle className="text-xl group-hover:text-secondary transition-colors">
          {event.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-foreground/70" />
            <span className="capitalize">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-foreground/70" />
            <span>{formattedTime}</span>
          </div>
          {event.description && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-foreground/70" />
              <span>{event.description}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
