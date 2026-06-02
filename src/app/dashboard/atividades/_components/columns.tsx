/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { GlobalDeleteDialog } from "@/components/shared/global-delete-dialog";
import { EditAtividadeDialog } from "./edit-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Activity } from "@/generated/prisma/client";

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "activity_date",
    header: "Data da Atividade",
    cell: ({ row }) => {
      const date = new Date(row.original.activity_date);
      return format(date, "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR });
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      return (
        <div className="max-w-[300px] truncate">
          {row.original.description || "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const atividade = row.original;
      const [deleteOpen, setDeleteOpen] = useState(false);
      const [editOpen, setEditOpen] = useState(false);

      const router = useRouter();

      const handleDelete = async () => {
        try {
          const res = await fetch(`/api/atividades/${atividade.id}`, { method: "DELETE" });
          const data = await res.json();
          if (res.ok && data.success) {
            toast.success("Atividade excluída com sucesso!");
            router.refresh();
          } else {
            toast.error(data.error || "Erro ao excluir.");
          }
        } catch {
          toast.error("Erro interno.");
        }
        setDeleteOpen(false);
      };

      return (
        <>
          <div className="flex items-center justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <EditAtividadeDialog
            isOpen={editOpen}
            onOpenChange={setEditOpen}
            data={atividade}
          />

          <GlobalDeleteDialog
            isOpen={deleteOpen}
            onOpenChange={setDeleteOpen}
            onConfirm={handleDelete}
          />
        </>
      );
    },
  },
];
