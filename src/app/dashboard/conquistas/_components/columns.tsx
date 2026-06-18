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
import { EditConquistaDialog } from "./edit-dialog";
import { Achievement } from "@/generated/prisma/client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const columns: ColumnDef<Achievement>[] = [
  {
    accessorKey: "icon",
    header: "Ícone",
    cell: ({ row }) => {
      const icon = row.original.icon;
      return <div className="text-2xl">{icon || "🏆"}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      return <span className="font-semibold">{row.original.name}</span>;
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      return <span className="text-muted-foreground">{row.original.description || "-"}</span>;
    },
  },
  {
    accessorKey: "condition",
    header: "Condição",
    cell: ({ row }) => {
      const type = row.original.condition_type;
      const value = row.original.condition_value;
      let label = "";
      if (type === "points") label = `≥ ${value} XP`;
      else if (type === "visitors") label = `≥ ${value} Visitantes`;
      else label = `${type} = ${value}`;

      return (
        <Badge variant="outline" className="bg-primary/5">
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "points",
    header: "Prêmio (Pontos)",
    cell: ({ row }) => {
      const points = row.original.points;
      return (
        <span className="font-bold text-gradient-yellow">
          {points > 0 ? `+${points}` : points}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const conquista = row.original;
      const [deleteOpen, setDeleteOpen] = useState(false);
      const [editOpen, setEditOpen] = useState(false);
      const router = useRouter();

      const handleDelete = async () => {
        try {
          const res = await fetch(`/api/conquistas/${conquista.id}`, { method: "DELETE" });
          const data = await res.json();
          if (res.ok && data.success) {
            toast.success("Conquista excluída com sucesso!");
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
          <div className="flex items-center justify-end">
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

          <EditConquistaDialog
            isOpen={editOpen}
            onOpenChange={setEditOpen}
            data={conquista}
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
