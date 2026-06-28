"use client";

import { ColumnDef } from "@tanstack/react-table";
import { VisitorWithYouth } from "../visitantes-client";
import { Youth } from "@/generated/prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { VisitanteDialog } from "./visitante-dialog";
import { GlobalDeleteDialog } from "@/components/shared/global-delete-dialog";

export const columns = (jovens: Youth[]): ColumnDef<VisitorWithYouth>[] => [
  {
    accessorKey: "name",
    header: "Nome do Visitante",
    cell: ({ row }) => <div className="font-semibold">{row.original.name}</div>,
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ row }) => row.original.phone || "-",
  },
  {
    accessorKey: "responsible_youth",
    header: "Jovem que Trouxe",
    cell: ({ row }) => row.original.responsible_youth?.name || "-",
  },
  {
    accessorKey: "visit_date",
    header: "Data da Visita",
    cell: ({ row }) => {
      if (!row.original.visit_date) return "-";
      return format(new Date(row.original.visit_date), "dd 'de' MMM, yyyy", {
        locale: ptBR,
      });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const visitante = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isEditOpen, setIsEditOpen] = useState(false);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isDeleteOpen, setIsDeleteOpen] = useState(false);

      const handleDelete = async () => {
        try {
          const res = await fetch(`/api/visitantes/${visitante.id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            toast.success("Visitante excluído!");
            window.location.reload();
          } else {
            toast.error("Erro ao excluir.");
          }
        } catch (error) {
          toast.error("Erro ao excluir visitante.");
        } finally {
          setIsDeleteOpen(false);
        }
      };

      return (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDeleteOpen(true)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
          <VisitanteDialog
            isOpen={isEditOpen}
            onOpenChange={setIsEditOpen}
            data={visitante}
            jovens={jovens}
            onSuccess={() => window.location.reload()}
          />
          <GlobalDeleteDialog
            isOpen={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onConfirm={handleDelete}
            title="Excluir Visitante"
            description="Tem certeza que deseja excluir este visitante? Essa ação não pode ser desfeita."
          />
        </div>
      );
    },
  },
];
