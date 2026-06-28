"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Youth } from "@/generated/prisma/client";
import { Trophy, Medal, Award } from "lucide-react";

export type YouthWithPoints = Youth & { points?: number };

export const columns: ColumnDef<YouthWithPoints>[] = [
  {
    id: "rank",
    header: "Posição",
    cell: ({ row }) => {
      const index = row.index;
      const position = index + 1;
      
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
];
