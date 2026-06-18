/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { DataTable } from "@/components/layout/data-table";
import { EditConquistaDialog } from "./_components/edit-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { columns } from "./_components/columns";

export function ConquistasClient({ initialData }: { initialData: any[] }) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Conquistas (Achievements)
          </h1>
          <p className="text-muted-foreground">
            Gerencie as recompensas e emblemas que os jovens podem desbloquear.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Conquista
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={initialData}
        searchKey="name"
        searchPlaceholder="Buscar por nome da conquista..."
      />

      <EditConquistaDialog
        isOpen={createOpen}
        onOpenChange={setCreateOpen}
        data={null}
      />
    </div>
  );
}
