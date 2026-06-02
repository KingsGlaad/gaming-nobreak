/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ptBR } from "date-fns/locale";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

function DatePickerInput({
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
}: {
  value: Date | null | undefined;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [prevValue, setPrevValue] = useState<Date | null | undefined>(value);

  // Ajusta o estado durante a renderização (Padrão recomendado pelo React para evitar useEffect cascata)
  if (value !== prevValue) {
    setPrevValue(value);
    if (value && isValid(value)) {
      setInputValue(format(value, "dd/MM/yyyy"));
    } else {
      setInputValue("");
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); // Keep only digits

    // Auto format: dd/MM/yyyy
    if (val.length > 2 && val.length <= 4) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    } else if (val.length > 4) {
      val = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4, 8)}`;
    }

    setInputValue(val);

    // Parse using dd/MM/yyyy format
    const parsedDate = parse(val, "dd/MM/yyyy", new Date());

    // Only update the form state if it's a valid date and the user typed 10 chars (e.g. 01/01/2000)
    if (isValid(parsedDate) && val.length === 10) {
      onChange(parsedDate);
    } else if (val === "") {
      onChange(null);
    }
  };

  return (
    <div className="flex relative items-center w-full">
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        maxLength={10}
        className="pr-10"
      />
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          >
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={value || undefined}
            onSelect={(date) => {
              if (date) {
                onChange(date);
                setInputValue(format(date, "dd/MM/yyyy"));
              } else {
                onChange(null);
                setInputValue("");
              }
              setIsPopoverOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

const formSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  nickname: z.string().optional(),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  birth_date: z.date().optional().nullable(),
  baptized: z.boolean(),
  baptism_date: z.date().optional().nullable(),
  photo_url: z.string().optional().nullable(),
  status: z.string(),
});

async function convertToWebp(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas toBlob returned null"));
            }
          },
          "image/webp",
          0.8,
        );
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

interface EditJovemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: any | null;
  onSuccess?: () => void;
}

export function EditJovemDialog({
  isOpen,
  onOpenChange,
  data,
  onSuccess,
}: EditJovemDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isEditing = !!data;
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nickname: "",
      phone: "",
      instagram: "",
      birth_date: null,
      baptized: false,
      baptism_date: null,
      photo_url: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        nickname: data.nickname || "",
        phone: data.phone || "",
        instagram: data.instagram || "",
        birth_date: data.birth_date ? new Date(data.birth_date) : null,
        baptized: data.baptized || false,
        baptism_date: data.baptism_date ? new Date(data.baptism_date) : null,
        photo_url: data.photo_url || "",
        status: data.status || "active",
      });
    } else {
      form.reset({
        name: "",
        nickname: "",
        phone: "",
        instagram: "",
        birth_date: null,
        baptized: false,
        baptism_date: null,
        photo_url: "",
        status: "active",
      });
    }
    setImageFile(null);
  }, [data, form, isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let photo_url = values.photo_url;

      if (imageFile) {
        let fileToUpload: Blob | File = imageFile;
        try {
          fileToUpload = await convertToWebp(imageFile);
        } catch (webpError) {
          console.error("Erro na conversão para webp:", webpError);
        }

        const nicknameClean = (
          values.nickname?.trim() ||
          values.name.trim().split(" ")[0] ||
          "sem-nome"
        )
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9-_]/g, "");

        const fileName = `${nicknameClean}.webp`;
        const filePath = `avatar/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("jovens")
          .upload(filePath, fileToUpload, {
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadError) {
          toast.error("Erro ao fazer upload da imagem.");
          console.error("Upload error:", uploadError);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from("jovens")
            .getPublicUrl(filePath);

          photo_url = publicUrlData.publicUrl;
        }
      }

      const payload = {
        name: values.name,
        nickname: values.nickname || undefined,
        phone: values.phone || undefined,
        instagram: values.instagram || undefined,
        photo_url: photo_url || undefined,
        birth_date: values.birth_date || undefined,
        baptism_date: values.baptism_date || undefined,
        baptized: !!values.baptism_date || values.baptized,
        status: values.status,
      };

      if (isEditing) {
        const res = await fetch(`/api/jovens/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (res.ok) {
          toast.success("Jovem atualizado!");
          onOpenChange(false);
          router.refresh();
          onSuccess?.();
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Ocorreu um erro ao atualizar.");
        }
      } else {
        const res = await fetch("/api/jovens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (res.ok) {
          toast.success("Jovem criado!");
          onOpenChange(false);
          router.refresh();
          onSuccess?.();
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Ocorreu um erro ao criar.");
        }
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Jovem" : "Novo Jovem"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit as any)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Foto do Jovem</FieldLabel>
            <FieldContent>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {data?.photo_url && !imageFile && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Já possui uma imagem salva.
                </div>
              )}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                placeholder="Ex: João da Silva"
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="nickname">Apelido (Opcional)</FieldLabel>
              <FieldContent>
                <Input
                  id="nickname"
                  placeholder="Ex: Joãozinho"
                  {...form.register("nickname")}
                />
                <FieldError errors={[form.formState.errors.nickname]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Telefone (Opcional)</FieldLabel>
              <FieldContent>
                <Input
                  id="phone"
                  placeholder="Ex: (11) 99999-9999"
                  {...form.register("phone")}
                />
                <FieldError errors={[form.formState.errors.phone]} />
              </FieldContent>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="instagram">Instagram (Opcional)</FieldLabel>
              <FieldContent>
                <Input
                  id="instagram"
                  placeholder="Ex: @joao.silva"
                  {...form.register("instagram")}
                />
                <FieldError errors={[form.formState.errors.instagram]} />
              </FieldContent>
            </Field>

            <Controller
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <Field className="flex flex-col space-y-2">
                  <FieldLabel>Data de Nascimento</FieldLabel>
                  <DatePickerInput
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FieldError errors={[form.formState.errors.birth_date]} />
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="baptism_date"
              render={({ field }) => (
                <Field className="flex flex-col space-y-2">
                  <FieldLabel>Data do Batizado</FieldLabel>
                  <DatePickerInput
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      form.setValue("baptized", !!date);
                    }}
                  />
                  <FieldError errors={[form.formState.errors.baptism_date]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <FieldContent>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[form.formState.errors.status]} />
                  </FieldContent>
                </Field>
              )}
            />
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
