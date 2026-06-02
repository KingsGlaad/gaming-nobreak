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
import { EditRegraDialog } from "./edit-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PointRule } from "@/generated/prisma/client";

export const columns: ColumnDef<PointRule>[] = [
  {
    accessorKey: "name",
    header: "Nome da Regra",
  },
  {
    accessorKey: "points",
    header: "Pontos",
    cell: ({ row }) => {
      return (
        <Badge
          variant="outline"
          className="font-bold text-green-600 dark:text-green-400"
        >
          +{row.original.points}
        </Badge>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => {
      return row.original.category || "-";
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
      const regra = row.original;
      const [deleteOpen, setDeleteOpen] = useState(false);
      const [editOpen, setEditOpen] = useState(false);

      const router = useRouter();

      const handleDelete = async () => {
        try {
          const res = await fetch(`/api/regras/${regra.id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (res.ok && data.success) {
            toast.success("Regra excluída com sucesso!");
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

          <EditRegraDialog
            isOpen={editOpen}
            onOpenChange={setEditOpen}
            data={regra}
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
