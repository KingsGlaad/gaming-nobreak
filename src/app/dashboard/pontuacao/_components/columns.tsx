"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Youth } from "@/generated/prisma/client";
import { Trophy, Medal, Award } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogsDialog } from "./logs-dialog";
import { PenaltyDialog } from "./penalty-dialog";
import { ScoreTransaction } from "@/generated/prisma/client";

export type YouthWithPoints = Youth & { points?: number; score_transactions?: ScoreTransaction[]; rank?: number };

export const columns: ColumnDef<YouthWithPoints>[] = [
  {
    id: "rank",
    header: "Posição",
    cell: ({ row }) => {
      const position = row.original.rank || row.index + 1;
      
      let icon = null;
      if (position === 1) icon = <Trophy className="h-5 w-5 text-yellow-500" />;
      else if (position === 2) icon = <Medal className="h-5 w-5 text-gray-400" />;
      else if (position === 3) icon = <Award className="h-5 w-5 text-amber-700" />;

      return (
        <div className="flex items-center gap-2 font-medium">
          <span className="w-6 text-center">{position}º</span>
          {icon}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      return <div className="font-semibold">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "nickname",
    header: "Apelido",
    cell: ({ row }) => {
      return row.original.nickname || "-";
    },
  },
  {
    accessorKey: "points",
    header: "Pontuação",
    cell: ({ row }) => {
      const points = row.original.points || 0;
      return (
        <Badge variant={points > 0 ? "default" : "secondary"} className="px-3 py-1 text-sm">
          {points} pts
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const jovem = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isLogsOpen, setIsLogsOpen] = useState(false);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isPenaltyOpen, setIsPenaltyOpen] = useState(false);

      return (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsLogsOpen(true)}>
            Ver Histórico
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsPenaltyOpen(true)} className="text-red-500 hover:text-red-700">
            Remover
          </Button>
          <LogsDialog isOpen={isLogsOpen} onOpenChange={setIsLogsOpen} jovem={jovem} />
          <PenaltyDialog isOpen={isPenaltyOpen} onOpenChange={setIsPenaltyOpen} jovem={jovem} onSuccess={() => window.location.reload()} />
        </div>
      );
    },
  },
];
