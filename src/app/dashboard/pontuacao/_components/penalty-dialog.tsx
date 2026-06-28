"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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

const formSchema = z.object({
  points: z.number().min(1, "Insira um valor maior que zero"),
  description: z.string().optional(),
});

interface PenaltyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jovem: any;
  onSuccess?: () => void;
}

export function PenaltyDialog({ isOpen, onOpenChange, jovem, onSuccess }: PenaltyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      points: 10,
      description: "",
    },
  });

  if (!jovem) return null;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/pontos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youth_id: jovem.id,
          points: -Math.abs(values.points), // Garante que será negativo
          description: values.description || "Penalidade aplicada manualmente",
        }),
      });

      if (res.ok) {
        toast.success("Penalidade aplicada com sucesso!");
        onOpenChange(false);
        form.reset();
        onSuccess?.();
      } else {
        toast.error("Ocorreu um erro ao aplicar penalidade.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Aplicar Penalidade - {jovem.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="points">Pontos a Remover</FieldLabel>
            <FieldContent>
              <Input id="points" type="number" {...form.register("points", { valueAsNumber: true })} />
              <FieldError errors={[form.formState.errors.points]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Justificativa (Opcional)</FieldLabel>
            <FieldContent>
              <Textarea 
                id="description" 
                placeholder="Motivo da remoção de pontos..." 
                className="resize-none" 
                {...form.register("description")} 
              />
              <FieldError errors={[form.formState.errors.description]} />
            </FieldContent>
          </Field>

          <div className="flex justify-end pt-4">
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? "Aplicando..." : "Remover Pontos"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
