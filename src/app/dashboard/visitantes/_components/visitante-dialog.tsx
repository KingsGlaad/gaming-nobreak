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
import { Youth } from "@/generated/prisma/client";
import { format } from "date-fns";

const formSchema = z.object({
  name: z.string().min(3, "Nome do visitante é obrigatório"),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  responsible_youth_id: z.string().optional(),
  visit_date: z.string().optional(),
  notes: z.string().optional(),
});

interface VisitanteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any | null;
  jovens: Youth[];
  onSuccess?: () => void;
}

export function VisitanteDialog({
  isOpen,
  onOpenChange,
  data,
  jovens,
  onSuccess,
}: VisitanteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      instagram: "",
      responsible_youth_id: "none",
      visit_date: format(new Date(), "yyyy-MM-dd"),
      notes: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        phone: data.phone || "",
        instagram: data.instagram || "",
        responsible_youth_id: data.responsible_youth_id || "none",
        visit_date: data.visit_date ? format(new Date(data.visit_date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        notes: data.notes || "",
      });
    } else {
      form.reset({
        name: "",
        phone: "",
        instagram: "",
        responsible_youth_id: "none",
        visit_date: format(new Date(), "yyyy-MM-dd"),
        notes: "",
      });
    }
  }, [data, form, isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        responsible_youth_id: values.responsible_youth_id === "none" ? undefined : values.responsible_youth_id,
        visit_date: values.visit_date ? new Date(values.visit_date) : new Date(),
      };

      const url = isEditing ? `/api/visitantes/${data.id}` : "/api/visitantes";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isEditing ? "Visitante atualizado!" : "Visitante criado!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error("Ocorreu um erro ao salvar o visitante.");
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
          <DialogTitle>{isEditing ? "Editar Visitante" : "Novo Visitante"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Nome do Visitante</FieldLabel>
            <FieldContent>
              <Input id="name" placeholder="Nome completo" {...form.register("name")} />
              <FieldError errors={[form.formState.errors.name]} />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="phone">Telefone</FieldLabel>
              <FieldContent>
                <Input id="phone" placeholder="(XX) XXXXX-XXXX" {...form.register("phone")} />
                <FieldError errors={[form.formState.errors.phone]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="instagram">Instagram</FieldLabel>
              <FieldContent>
                <Input id="instagram" placeholder="@usuario" {...form.register("instagram")} />
                <FieldError errors={[form.formState.errors.instagram]} />
              </FieldContent>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="responsible_youth_id"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="responsible_youth_id">Jovem que Trouxe</FieldLabel>
                  <FieldContent>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <SelectTrigger id="responsible_youth_id">
                        <SelectValue placeholder="Selecione um jovem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum / Não informado</SelectItem>
                        {jovens.map(j => (
                          <SelectItem key={j.id} value={j.id}>{j.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[form.formState.errors.responsible_youth_id]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Field>
              <FieldLabel htmlFor="visit_date">Data da Visita</FieldLabel>
              <FieldContent>
                <Input id="visit_date" type="date" {...form.register("visit_date")} />
                <FieldError errors={[form.formState.errors.visit_date]} />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="notes">Observações</FieldLabel>
            <FieldContent>
              <Textarea id="notes" placeholder="Alguma informação adicional..." className="resize-none" {...form.register("notes")} />
              <FieldError errors={[form.formState.errors.notes]} />
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
