"use client";

import { DataTable } from "@/components/layout/data-table";
import { columns } from "./_components/columns";
import { Youth } from "@/generated/prisma/client";
import { Trophy } from "lucide-react";

interface PontuacaoClientProps {
  initialData: (Youth & { points?: number })[];
}

export function PontuacaoClient({ initialData }: PontuacaoClientProps) {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Ranking de Pontuação
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe a classificação e os pontos dos jovens participantes.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={initialData}
        searchKey="name"
        searchPlaceholder="Buscar jovem pelo nome..."
      />
    </div>
  );
}
