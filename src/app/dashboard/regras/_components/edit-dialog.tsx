/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(3, "Nome da regra é obrigatório"),
  description: z.string().optional(),
  points: z.number().int().refine((val) => val !== 0, "A pontuação não pode ser 0"),
  category: z.string().optional(),
  is_active: z.boolean(),
});

interface EditRegraDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: any | null;
  onSuccess?: () => void;
}

export function EditRegraDialog({
  isOpen,
  onOpenChange,
  data,
  onSuccess,
}: EditRegraDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!data;
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      points: 10,
      category: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        description: data.description || "",
        points: data.points || 10,
        category: data.category || "",
        is_active: data.is_active !== undefined ? data.is_active : true,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        points: 10,
        category: "",
        is_active: true,
      });
    }
  }, [data, form, isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        const res = await fetch(`/api/regras/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (res.ok) {
          toast.success("Regra atualizada!");
          onOpenChange(false);
          router.refresh();
          onSuccess?.();
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Ocorreu um erro.");
        }
      } else {
        const res = await fetch("/api/regras", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (res.ok) {
          toast.success("Regra criada!");
          onOpenChange(false);
          router.refresh();
          onSuccess?.();
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Ocorreu um erro.");
        }
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Regra" : "Nova Regra"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Nome da Regra</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                placeholder="Ex: Presença no Culto"
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="points">Pontos (+ ou -)</FieldLabel>
              <FieldContent>
                <Input id="points" type="number" {...form.register("points", { valueAsNumber: true })} />
                <FieldError errors={[form.formState.errors.points]} />
              </FieldContent>
            </Field>
            <Controller
              control={form.control}
              name="category"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="category">Categoria (Opcional)</FieldLabel>
                  <FieldContent>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Assiduidade">Assiduidade</SelectItem>
                        <SelectItem value="Participação">Participação</SelectItem>
                        <SelectItem value="Disciplina">Disciplina</SelectItem>
                        <SelectItem value="Tarefas">Tarefas</SelectItem>
                        <SelectItem value="Eventos">Eventos</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[form.formState.errors.category]} />
                  </FieldContent>
                </Field>
              )}
            />
          </div>

          <Field>
            <FieldLabel htmlFor="description">Descrição (Opcional)</FieldLabel>
            <FieldContent>
              <Textarea
                id="description"
                placeholder="Detalhes sobre a regra..."
                className="resize-none"
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </FieldContent>
          </Field>

          <Controller
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <Field className="flex items-center gap-2">
                <FieldLabel htmlFor="is_active">
                  <Checkbox
                    id="is_active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  Regra Ativa
                </FieldLabel>
              </Field>
            )}
          />

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
