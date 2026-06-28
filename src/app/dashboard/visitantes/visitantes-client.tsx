"use client";

import { useState } from "react";
import { DataTable } from "@/components/layout/data-table";
import { columns } from "./_components/columns";
import { Visitor, Youth } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { VisitanteDialog } from "./_components/visitante-dialog";

export type VisitorWithYouth = Visitor & { responsible_youth: Youth | null };

interface VisitantesClientProps {
  initialData: VisitorWithYouth[];
  jovens: Youth[];
}

export function VisitantesClient({
  initialData,
  jovens,
}: VisitantesClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Visitantes
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os visitantes e quem os trouxe.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Visitante
        </Button>
      </div>

      <DataTable
        columns={columns(jovens)}
        data={initialData}
        searchKey="name"
        searchPlaceholder="Buscar visitante pelo nome..."
      />

      <VisitanteDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        data={null}
        jovens={jovens}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
