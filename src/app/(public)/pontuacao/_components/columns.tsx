"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { PointRule } from "@/generated/prisma/client";

export const columns: ColumnDef<PointRule>[] = [
  {
    accessorKey: "name",
    header: "Atividade / Regra",
    cell: ({ row }) => {
      return <div className="font-bold text-base">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "points",
    header: "Pontos",
    cell: ({ row }) => {
      const points = row.original.points;
      return (
        <Badge
          variant={points > 0 ? "default" : "destructive"}
          className="px-3 py-1 text-sm font-bold whitespace-nowrap"
        >
          {points > 0 ? `+${points}` : points} pts
        </Badge>
      );
    },
  },
];
