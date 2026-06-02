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
import { EditLiderDialog } from "./edit-dialog";
import { deleteLider } from "@/actions/lideres";
import { toast } from "sonner";
import { Leader, User } from "@/generated/prisma/client";

export type LiderWithUser = Leader & { user: User | null };

export const columns: ColumnDef<LiderWithUser>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email (Usuário vinculado)",
    cell: ({ row }) => {
      return (
        row.original.user?.email || (
          <span className="text-muted-foreground italic">Não vinculado</span>
        )
      );
    },
  },
  {
    accessorKey: "role",
    header: "Função",
    cell: ({ row }) => {
      return row.original.user?.role;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const lider = row.original;
      const [deleteOpen, setDeleteOpen] = useState(false);
      const [editOpen, setEditOpen] = useState(false);

      const handleDelete = async () => {
        const res = await deleteLider(lider.id);
        if (res.success) {
          toast.success("Líder excluído com sucesso!");
        } else {
          toast.error(res.error || "Erro ao excluir.");
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

          <EditLiderDialog
            isOpen={editOpen}
            onOpenChange={setEditOpen}
            data={lider}
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
