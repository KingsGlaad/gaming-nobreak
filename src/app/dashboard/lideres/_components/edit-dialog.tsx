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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createLider, updateLider } from "@/actions/lideres";

const formSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  role: z.string(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional().or(z.literal("")),
});

interface EditLiderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: any | null;
  onSuccess?: () => void;
}

export function EditLiderDialog({
  isOpen,
  onOpenChange,
  data,
  onSuccess,
}: EditLiderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Líder",
      password: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        email: data.user?.email || "",
        role: data.user?.role || data.role || "Líder",
        password: "",
      });
    } else {
      form.reset({
        name: "",
        email: "",
        role: "Líder",
        password: "",
      });
    }
  }, [data, form, isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        const res = await updateLider(data.id, values);
        if (res.success) {
          toast.success("Líder atualizado!");
          onOpenChange(false);
          onSuccess?.();
        } else {
          toast.error(res.error || "Ocorreu um erro.");
        }
      } else {
        const res = await createLider(values);
        if (res.success) {
          toast.success("Líder criado!");
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
          <DialogTitle>{isEditing ? "Editar Líder" : "Novo Líder"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                placeholder="Ex: Maria Pereira"
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">E-mail de Acesso (Opcional)</FieldLabel>
            <FieldContent>
              <Input
                id="email"
                type="email"
                placeholder="Para login no sistema"
                {...form.register("email")}
              />
              <FieldError errors={[form.formState.errors.email]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Senha de Acesso (Opcional ao editar)</FieldLabel>
            <FieldContent>
              <Input
                id="password"
                type="password"
                placeholder={isEditing ? "Deixe em branco para manter a atual" : "Mínimo 6 caracteres"}
                {...form.register("password")}
              />
              <FieldError errors={[form.formState.errors.password]} />
            </FieldContent>
          </Field>

          <Controller
            control={form.control}
            name="role"
            render={({ field }) => (
              <Field>
                <FieldLabel>Cargo</FieldLabel>
                <FieldContent>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Líder">Líder</SelectItem>
                      <SelectItem value="Co-líder">Co-líder</SelectItem>
                      <SelectItem value="Apoio">Apoio</SelectItem>
                      <SelectItem value="Pastor">Pastor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[form.formState.errors.role]} />
                </FieldContent>
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
