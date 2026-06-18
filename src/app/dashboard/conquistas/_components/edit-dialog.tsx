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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createAchievement, updateAchievement } from "@/lib/services/conquistas";

const formSchema = z.object({
  name: z.string().min(3, "Nome da conquista é obrigatório"),
  description: z.string().optional(),
  icon: z.string().optional(),
  condition_type: z.enum(["points", "visitors"]),
  condition_value: z.number().int().min(0, "O valor deve ser 0 ou maior"),
  points: z.number().int().min(0, "Os pontos devem ser positivos"),
});

interface EditConquistaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: any | null;
  onSuccess?: () => void;
}

export function EditConquistaDialog({
  isOpen,
  onOpenChange,
  data,
  onSuccess,
}: EditConquistaDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      condition_type: "points",
      condition_value: 0,
      points: 50,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        description: data.description || "",
        icon: data.icon || "",
        condition_type: data.condition_type as "points" | "visitors",
        condition_value: data.condition_value || 0,
        points: data.points || 0,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        icon: "",
        condition_type: "points",
        condition_value: 0,
        points: 50,
      });
    }
  }, [data, form, isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        const res = await updateAchievement(data.id, values);
        if (res.success) {
          toast.success("Conquista atualizada!");
          onOpenChange(false);
          onSuccess?.();
        } else {
          toast.error(res.error || "Ocorreu um erro.");
        }
      } else {
        const res = await createAchievement(values);
        if (res.success) {
          toast.success("Conquista criada!");
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
          <DialogTitle>{isEditing ? "Editar Conquista" : "Nova Conquista"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Nome da Conquista</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                placeholder="Ex: Guerreiro de Prata"
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="icon">Ícone (Emoji ou Nome)</FieldLabel>
              <FieldContent>
                <Input
                  id="icon"
                  placeholder="Ex: 🔥 ou shield"
                  {...form.register("icon")}
                />
                <FieldError errors={[form.formState.errors.icon]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="points">Pontos Concedidos</FieldLabel>
              <FieldContent>
                <Input id="points" type="number" {...form.register("points", { valueAsNumber: true })} />
                <FieldError errors={[form.formState.errors.points]} />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="description">Descrição</FieldLabel>
            <FieldContent>
              <Textarea
                id="description"
                placeholder="Ex: Alcançou o nível Prata..."
                className="resize-none"
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="condition_type"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="condition_type">Gatilho (Condição)</FieldLabel>
                  <FieldContent>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger id="condition_type">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="points">Total de Pontos (XP)</SelectItem>
                        <SelectItem value="visitors">Qtd. de Visitantes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[form.formState.errors.condition_type]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Field>
              <FieldLabel htmlFor="condition_value">Valor Necessário</FieldLabel>
              <FieldContent>
                <Input id="condition_value" type="number" {...form.register("condition_value", { valueAsNumber: true })} />
                <FieldError errors={[form.formState.errors.condition_value]} />
              </FieldContent>
            </Field>
          </div>

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
