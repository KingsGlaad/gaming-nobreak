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

import { getTiposAtividade } from "@/lib/services/atividades";
import { useRouter } from "next/navigation";
import { getTemporadas } from "@/lib/services/temporadas";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(3, "Título é obrigatório"),
  description: z.string().optional(),
  activity_date: z.string().min(1, "Data e hora são obrigatórias"),
  season_id: z.string().nullable().optional(),
  activity_type_id: z.string().nullable().optional(),
});

interface EditAtividadeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: any | null;
  onSuccess?: () => void;
}

export function EditAtividadeDialog({
  isOpen,
  onOpenChange,
  data,
  onSuccess,
}: EditAtividadeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [temporadas, setTemporadas] = useState<any[]>([]);
  const [tiposAtividade, setTiposAtividade] = useState<any[]>([]);
  const isEditing = !!data;
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      activity_date: "",
      season_id: "",
      activity_type_id: "",
    },
  });

  // Carregar as opções de Temporada e Tipo de Atividade
  useEffect(() => {
    async function loadOptions() {
      try {
        const [temps, types] = await Promise.all([
          getTemporadas(),
          getTiposAtividade(),
        ]);
        setTemporadas(temps);
        setTiposAtividade(types);
      } catch (err) {
        console.error("Erro ao carregar opções para a atividade", err);
      }
    }
    if (isOpen) {
      loadOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (data) {
      const dateStr = data.activity_date
        ? new Date(data.activity_date).toISOString().slice(0, 16)
        : "";

      form.reset({
        title: data.title || "",
        description: data.description || "",
        activity_date: dateStr,
        season_id: data.season_id || "",
        activity_type_id: data.activity_type_id || "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        activity_date: "",
        season_id: "",
        activity_type_id: "",
      });
    }
  }, [data, form, isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        const res = await fetch(`/api/atividades/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (res.ok) {
          toast.success("Atividade atualizada!");
          onOpenChange(false);
          router.refresh();
          onSuccess?.();
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Ocorreu um erro.");
        }
      } else {
        const res = await fetch("/api/atividades", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (res.ok) {
          toast.success("Atividade criada!");
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
          <DialogTitle>
            {isEditing ? "Editar Atividade" : "Nova Atividade"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="title">Título da Atividade</FieldLabel>
            <FieldContent>
              <Input
                id="title"
                placeholder="Ex: Culto de Jovens"
                {...form.register("title")}
              />
              <FieldError errors={[form.formState.errors.title]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="activity_date">Data e Hora</FieldLabel>
            <FieldContent>
              <Input
                id="activity_date"
                type="datetime-local"
                {...form.register("activity_date")}
              />
              <FieldError errors={[form.formState.errors.activity_date]} />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="season_id"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="season_id">Temporada</FieldLabel>
                  <FieldContent>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger id="season_id">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {temporadas.map((temp) => (
                          <SelectItem key={temp.id} value={temp.id}>
                            {temp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[form.formState.errors.season_id]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="activity_type_id"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="activity_type_id">Tipo de Atividade</FieldLabel>
                  <FieldContent>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger id="activity_type_id">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposAtividade.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[form.formState.errors.activity_type_id]} />
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
                placeholder="Detalhes do evento..."
                className="resize-none"
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </FieldContent>
          </Field>

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
