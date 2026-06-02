"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, PlusCircle, Pencil, Trash2 } from "lucide-react";

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
import { AddPointsDialog } from "@/components/shared/add-points-dialog";
import { EditJovemDialog } from "./edit-dialog";

import { deleteJovem } from "@/actions/jovens";
import { toast } from "sonner";
import { Youth } from "@/generated/prisma/client";
import { format } from "date-fns";

export const columns: ColumnDef<Youth>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "nickname",
    header: "Apelido",
    cell: ({ row }) => {
      return row.original.nickname || "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status === "active" ? "Ativo" : "Inativo"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "baptized",
    header: "Batizado",
    cell: ({ row }) => {
      return row.original.baptized ? "Sim" : "Não";
    },
  },
  {
    accessorKey: "birth_date",
    header: "Data de Nascimento",
    cell: ({ row }) => {
      const date = row.original.birth_date;
      if (!date) return "-";
      const d = new Date(date);
      const correctedDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
      return format(correctedDate, "dd/MM/yyyy");
    },
  },
  {
    accessorKey: "baptism_date",
    header: "Data do Batismo",
    cell: ({ row }) => {
      const date = row.original.baptism_date;
      if (!date) return "-";
      const d = new Date(date);
      const correctedDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
      return format(correctedDate, "dd/MM/yyyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const jovem = row.original;
      const [deleteOpen, setDeleteOpen] = useState(false);
      const [editOpen, setEditOpen] = useState(false);
      const [addPointsOpen, setAddPointsOpen] = useState(false);

      const handleDelete = async () => {
        const res = await deleteJovem(jovem.id);
        if (res.success) {
          toast.success("Jovem inativado com sucesso!");
        } else {
          toast.error(res.error || "Erro ao excluir.");
        }
        setDeleteOpen(false);
      };

      return (
        <>
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-dashed"
              onClick={() => setAddPointsOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Dar Pontos
            </Button>
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

          <AddPointsDialog
            isOpen={addPointsOpen}
            onOpenChange={setAddPointsOpen}
            jovemId={jovem.id}
            jovemName={jovem.name}
          />

          <EditJovemDialog
            isOpen={editOpen}
            onOpenChange={setEditOpen}
            data={jovem}
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
