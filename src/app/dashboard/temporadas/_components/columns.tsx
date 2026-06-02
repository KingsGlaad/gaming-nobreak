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
import { Badge } from "@/components/ui/badge";

import { GlobalDeleteDialog } from "@/components/shared/global-delete-dialog";
import { EditTemporadaDialog } from "./edit-dialog";
import { format } from "date-fns";
import { deleteTemporada } from "@/actions/temporadas";
import { toast } from "sonner";
import { Season } from "@/generated/prisma/client";

export const columns: ColumnDef<Season>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "start_date",
    header: "Início",
    cell: ({ row }) => {
      const date = new Date(row.original.start_date);
      return format(date, "dd/MM/yyyy");
    },
  },
  {
    accessorKey: "end_date",
    header: "Fim",
    cell: ({ row }) => {
      const date = new Date(row.original.end_date);
      return format(date, "dd/MM/yyyy");
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Ativa" : "Inativa"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const temporada = row.original;
      const [deleteOpen, setDeleteOpen] = useState(false);
      const [editOpen, setEditOpen] = useState(false);

      const handleDelete = async () => {
        const res = await deleteTemporada(temporada.id);
        if (res.success) {
          toast.success("Temporada excluída com sucesso!");
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

          <EditTemporadaDialog
            isOpen={editOpen}
            onOpenChange={setEditOpen}
            data={temporada}
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
