/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { GlobalDeleteDialog } from "@/components/shared/global-delete-dialog";

interface LogsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jovem: any;
}

export function LogsDialog({ isOpen, onOpenChange, jovem }: LogsDialogProps) {
  const [logToDelete, setLogToDelete] = useState<string | null>(null);

  if (!jovem) return null;

  const logs = jovem.score_transactions || [];

  const handleDelete = async () => {
    if (!logToDelete) return;
    try {
      const res = await fetch(`/api/pontos/${logToDelete}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Pontuação removida com sucesso!");
        window.location.reload();
      } else {
        toast.error("Erro ao remover pontuação.");
      }
    } catch (error) {
      toast.error("Erro interno ao remover.");
      console.error(error);
    } finally {
      setLogToDelete(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Pontos - {jovem.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center">
              Nenhum ponto registrado.
            </p>
          ) : (
            logs.map((log: any) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {log.points > 0 ? `+${log.points}` : log.points} pts
                    </span>
                    {log.point_rule && (
                      <Badge variant="outline">{log.point_rule.name}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {log.description || "Sem descrição"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(
                      new Date(log.created_at),
                      "dd 'de' MMM, yyyy 'às' HH:mm",
                      { locale: ptBR },
                    )}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLogToDelete(log.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
      <GlobalDeleteDialog
        isOpen={!!logToDelete}
        onOpenChange={(open) => {
          if (!open) setLogToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Remover Pontuação"
        description="Tem certeza que deseja remover esta pontuação? Essa ação não pode ser desfeita."
      />
    </Dialog>
  );
}
