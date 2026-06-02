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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { createTemporada, updateTemporada } from "@/actions/temporadas";

const formSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  description: z.string().optional(),
  start_date: z.string().min(1, "Data de início é obrigatória"),
  end_date: z.string().min(1, "Data de término é obrigatória"),
  is_active: z.boolean().default(false),
});

interface EditTemporadaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: any | null;
  onSuccess?: () => void;
}

export function EditTemporadaDialog({
  isOpen,
  onOpenChange,
  data,
  onSuccess,
}: EditTemporadaDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      is_active: false,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        description: data.description || "",
        start_date: data.start_date
          ? new Date(data.start_date).toISOString().slice(0, 10)
          : "",
        end_date: data.end_date
          ? new Date(data.end_date).toISOString().slice(0, 10)
          : "",
        is_active: data.is_active || false,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        is_active: false,
      });
    }
  }, [data, form, isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        const res = await updateTemporada(data.id, values);
        if (res.success) {
          toast.success("Temporada atualizada!");
          onOpenChange(false);
          onSuccess?.();
        } else {
          toast.error(res.error || "Ocorreu um erro.");
        }
      } else {
        const res = await createTemporada(values);
        if (res.success) {
          toast.success("Temporada criada!");
          onOpenChange(false);
          onSuccess?.();
        } else {
          toast.error(res.error || "Ocorreu um erro.");
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
          <DialogTitle>
            {isEditing ? "Editar Temporada" : "Nova Temporada"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Nome da Temporada</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                placeholder="Ex: 1º Semestre 2026"
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="start_date">Data de Início</FieldLabel>
              <FieldContent>
                <Input
                  id="start_date"
                  type="date"
                  {...form.register("start_date")}
                />
                <FieldError errors={[form.formState.errors.start_date]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="end_date">Data de Término</FieldLabel>
              <FieldContent>
                <Input
                  id="end_date"
                  type="date"
                  {...form.register("end_date")}
                />
                <FieldError errors={[form.formState.errors.end_date]} />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="description">Descrição (Opcional)</FieldLabel>
            <FieldContent>
              <Textarea
                id="description"
                placeholder="Detalhes da temporada..."
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
              <Field className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <Checkbox
                  id="is_active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <div className="space-y-1 leading-none">
                  <FieldLabel htmlFor="is_active">Temporada Ativa</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Apenas uma temporada deve estar ativa por vez.
                  </p>
                </div>
                <FieldError errors={[form.formState.errors.is_active]} />
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
