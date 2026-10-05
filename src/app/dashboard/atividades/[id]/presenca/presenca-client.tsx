"use client";

import { useState } from "react";
import { Youth } from "@/generated/prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface PresencaClientProps {
  activityId: string;
  youths: Youth[];
  initialAttendances: Record<string, boolean>;
}

export function PresencaClient({
  activityId,
  youths,
  initialAttendances,
}: PresencaClientProps) {
  const [attendances, setAttendances] = useState<Record<string, boolean>>(
    initialAttendances
  );
  const [search, setSearch] = useState("");
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const filteredYouths = youths.filter(
    (y) =>
      y.name.toLowerCase().includes(search.toLowerCase()) ||
      y.nickname?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = async (youthId: string, isPresent: boolean) => {
    // Optimistic update
    setAttendances((prev) => ({ ...prev, [youthId]: isPresent }));
    setLoadingMap((prev) => ({ ...prev, [youthId]: true }));

    try {
      const res = await fetch(`/api/atividades/${activityId}/presenca`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youth_id: youthId, present: isPresent }),
      });

      if (!res.ok) {
        throw new Error("Erro ao salvar presença");
      }
    } catch (error) {
      toast.error("Falha ao salvar a presença. Tentando reverter...");
      setAttendances((prev) => ({ ...prev, [youthId]: !isPresent }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [youthId]: false }));
    }
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar jovem por nome ou apelido..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b bg-muted/50 p-4 font-medium">
            <div>Nome do Jovem</div>
            <div>Presente?</div>
          </div>
          <div className="divide-y">
            {filteredYouths.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Nenhum jovem encontrado.
              </div>
            ) : (
              filteredYouths.map((youth) => {
                const isPresent = attendances[youth.id] || false;
                const isLoading = loadingMap[youth.id] || false;

                return (
                  <div
                    key={youth.id}
                    className="grid grid-cols-[1fr_auto] items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{youth.name}</div>
                      {youth.nickname && (
                        <div className="text-sm text-muted-foreground">
                          {youth.nickname}
                        </div>
                      )}
                    </div>
                    <div>
                      <Switch
                        checked={isPresent}
                        disabled={isLoading}
                        onCheckedChange={(checked) =>
                          handleToggle(youth.id, checked)
                        }
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
