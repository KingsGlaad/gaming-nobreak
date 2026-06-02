"use client"

import { useState } from "react"
import { DataTable } from "@/components/layout/data-table"
import { columns } from "./_components/columns"
import { EditRegraDialog } from "./_components/edit-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function RegrasClient({ initialData }: { initialData: any[] }) {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Regras de Pontuação</h1>
          <p className="text-muted-foreground">
            Defina atitudes e ações que geram pontos para os jovens.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Regra
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={initialData}
        searchKey="name"
        searchPlaceholder="Buscar por nome..."
      />

      <EditRegraDialog
        isOpen={createOpen}
        onOpenChange={setCreateOpen}
        data={null}
      />
    </div>
  )
}
