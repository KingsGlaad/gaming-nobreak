"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useSession } from "next-auth/react"
import { getRegras } from "@/actions/regras"
import { addPoints } from "@/actions/pontos"

const formSchema = z.object({
  rule_id: z.string().min(1, "Selecione uma regra"),
  points: z.coerce.number().int().min(1, "A pontuação deve ser maior que 0"),
  description: z.string().optional(),
})

interface AddPointsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  jovemName: string
  jovemId: string
  onSuccess?: () => void
}

export function AddPointsDialog({
  isOpen,
  onOpenChange,
  jovemName,
  jovemId,
  onSuccess,
}: AddPointsDialogProps) {
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [regras, setRegras] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rule_id: "",
      points: 0,
      description: "",
    },
  })

  useEffect(() => {
    if (isOpen) {
      getRegras().then((data) => {
        setRegras(data.filter((r: any) => r.is_active))
      })
    }
  }, [isOpen])

  const handleRuleChange = (ruleId: string) => {
    form.setValue("rule_id", ruleId)
    const rule = regras.find((r) => r.id === ruleId)
    if (rule) {
      form.setValue("points", rule.points)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const res = await addPoints({
        youth_id: jovemId,
        rule_id: values.rule_id,
        points: values.points,
        description: values.description,
        leader_email: session?.user?.email,
      })

      if (res.success) {
        toast.success(`+${values.points} pontos adicionados para ${jovemName}!`)
        form.reset()
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast.error(res.error || "Ocorreu um erro ao adicionar os pontos.")
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao adicionar os pontos.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open)
      if (!open) form.reset()
    }}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Dar Pontos - {jovemName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="rule_id"
            render={({ field }) => (
              <Field>
                <FieldLabel>Regra de Pontuação</FieldLabel>
                <FieldContent>
                  <Select onValueChange={handleRuleChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a atitude..." />
                    </SelectTrigger>
                    <SelectContent>
                      {regras.map((regra) => (
                        <SelectItem key={regra.id} value={regra.id}>
                          {regra.name} (+{regra.points})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[form.formState.errors.rule_id]} />
                </FieldContent>
              </Field>
            )}
          />

          <Field>
            <FieldLabel htmlFor="points">Quantidade de Pontos</FieldLabel>
            <FieldContent>
              <Input id="points" type="number" {...form.register("points")} />
              <FieldError errors={[form.formState.errors.points]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Observação (Opcional)</FieldLabel>
            <FieldContent>
              <Textarea id="description" placeholder="Algum detalhe adicional?" className="resize-none" {...form.register("description")} />
              <FieldError errors={[form.formState.errors.description]} />
            </FieldContent>
          </Field>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar Pontos"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
