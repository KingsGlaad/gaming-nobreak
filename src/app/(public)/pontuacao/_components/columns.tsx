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
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => {
      return row.original.category ? (
        <Badge variant="outline" className="px-2 py-0.5 whitespace-nowrap">
          {row.original.category}
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground max-w-[400px]">
          {row.original.description || "Nenhuma descrição detalhada."}
        </div>
      );
    },
  },
  {
    accessorKey: "points",
    header: "Pontos",
    cell: ({ row }) => {
      const points = row.original.points;
      return (
        <Badge variant={points > 0 ? "default" : "destructive"} className="px-3 py-1 text-sm font-bold whitespace-nowrap">
          {points > 0 ? `+${points}` : points} pts
        </Badge>
      );
    },
  },
];
