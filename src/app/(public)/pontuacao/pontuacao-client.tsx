"use client";

import { DataTable } from "@/components/layout/data-table";
import { columns } from "./_components/columns";
import { BookOpen } from "lucide-react";
import { PointRule } from "@/generated/prisma/client";

interface RegrasClientProps {
  initialData: PointRule[];
}

export function RegrasClient({ initialData }: RegrasClientProps) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Regras de Pontuação
          </h1>
          <p className="text-muted-foreground mt-1">
            Confira a tabela de atividades e descubra como acumular pontos no Gaming Nobreak.
          </p>
        </div>
      </div>

      <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-lg shadow-sm p-4 md:p-6">
        <DataTable
          columns={columns}
          data={initialData}
          searchKey="name"
          searchPlaceholder="Buscar regra pelo nome..."
        />
      </div>
    </div>
  );
}
