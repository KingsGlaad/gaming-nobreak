/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { supabase } from "@/lib/supabase/client";
import { ImageCropper } from "@/components/shared/image-cropper";
import Image from "next/image";

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

    if (val.length > 2 && val.length <= 4) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    } else if (val.length > 4) {
      val = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4, 8)}`;
    }

    setInputValue(val);

    const parsedDate = parse(val, "dd/MM/yyyy", new Date());

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
      const img = new window.Image();
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

export interface JovemFormProps {
  data?: any | null;
  onSuccess?: () => void;
  isPublic?: boolean;
}

export function JovemForm({
  data,
  onSuccess,
  isPublic = false,
}: JovemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uncroppedImageSrc, setUncroppedImageSrc] = useState<string | null>(
    null,
  );
  const [isGenerating3D, setIsGenerating3D] = useState(false);
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
    setPreviewUrl(null);
  }, [data, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUncroppedImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    setImageFile(croppedBlob);
    setPreviewUrl(URL.createObjectURL(croppedBlob));
    setUncroppedImageSrc(null);
  };

  const generate3DAvatar = async () => {
    // Pegar a imagem que já está em uncroppedImageSrc (se acabou de fazer upload)
    // Ou a dataUrl convertida do previewUrl
    // Ou a URL pública que já está salva no banco (data?.photo_url)
    let imageToProcess = previewUrl || form.getValues("photo_url") || data?.photo_url;
    
    // Se o usuário selecionou uma nova foto local (File/Blob), vamos lê-la
    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          imageToProcess = reader.result as string;
          resolve();
        };
      });
    }

    if (!imageToProcess) {
      toast.error("Por favor, selecione ou recorte uma foto primeiro.");
      return;
    }

    setIsGenerating3D(true);
    toast.info("A IA está trabalhando no seu avatar 3D. Isso pode levar alguns segundos...");

    try {
      const res = await fetch("/api/jovens/generate-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageToProcess }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Erro ao gerar avatar.");
      }

      setPreviewUrl(json.url);
      setImageFile(null);
      form.setValue("photo_url", json.url);
      toast.success("Avatar 3D gerado com sucesso! ✨");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Ocorreu um erro ao gerar o avatar 3D.");
    } finally {
      setIsGenerating3D(false);
    }
  };

  const nicknameValue = form.watch("nickname");

  useEffect(() => {
    if (!nicknameValue) {
      if (form.formState.errors.nickname?.type === "manual") {
        form.clearErrors("nickname");
      }
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const url = new URL(
          "/api/jovens/check-nickname",
          window.location.origin,
        );
        url.searchParams.set("nickname", nicknameValue);
        if (isEditing && data?.id) {
          url.searchParams.set("ignoreId", data.id);
        }

        const res = await fetch(url.toString());
        const json = await res.json();

        if (json.exists) {
          form.setError("nickname", {
            type: "manual",
            message: "Este apelido já está em uso por outro jovem.",
          });
        } else {
          if (form.formState.errors.nickname?.type === "manual") {
            form.clearErrors("nickname");
          }
        }
      } catch (e) {
        console.error("Erro ao checar apelido:", e);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [nicknameValue, isEditing, data?.id, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let photo_url = values.photo_url;

      if (imageFile) {
        let fileToUpload: Blob | File = imageFile;
        if (imageFile instanceof File) {
          try {
            fileToUpload = await convertToWebp(imageFile);
          } catch (webpError) {
            console.error("Erro na conversão para webp:", webpError);
          }
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

        const fileName = `${nicknameClean}-${Date.now()}.webp`;
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
        status: isPublic ? "active" : values.status,
      };

      if (isEditing) {
        const res = await fetch(`/api/jovens/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          toast.success("Jovem atualizado com sucesso!");
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
          toast.success("Jovem cadastrado com sucesso!");
          if (isPublic) {
            form.reset();
            setImageFile(null);
          }
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel>Avatar / Foto do Jovem</FieldLabel>
        <FieldContent>
          <div className="flex flex-col gap-2 w-full">
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            <p className="text-xs text-muted-foreground mt-1">
              Faça upload de uma foto do rosto bem iluminada.
            </p>
          </div>

          {(data?.photo_url || previewUrl || form.getValues("photo_url") || imageFile) && (
            <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center p-4 bg-muted/30 rounded-xl border border-border">
              <Image
                src={
                  previewUrl || form.getValues("photo_url") || data?.photo_url || ""
                }
                alt="Preview da foto do jovem"
                className="w-32 h-32 object-cover rounded-xl border-2 border-primary shadow-sm"
                width={128}
                height={128}
              />
              
              <div className="flex flex-col gap-2">
                {!previewUrl && !form.getValues("photo_url") && (
                  <div className="text-sm text-muted-foreground font-medium">
                    Foto atual
                  </div>
                )}
                
                <Button
                  type="button"
                  variant="default"
                  disabled={isGenerating3D || (!imageFile && !previewUrl && !data?.photo_url)}
                  onClick={generate3DAvatar}
                  className="bg-gradient-to-r from-primary to-secondary text-white font-bold w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
                >
                  {isGenerating3D ? "Transformando na IA... ⏳" : "Transformar em 3D com IA ✨"}
                </Button>
                <p className="text-xs text-muted-foreground max-w-[200px] text-center sm:text-left">
                  A Inteligência Artificial vai transformar a foto acima em um personagem de game no estilo 3D.
                </p>
              </div>
            </div>
          )}
        </FieldContent>
      </Field>

      {uncroppedImageSrc && (
        <ImageCropper
          imageSrc={uncroppedImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setUncroppedImageSrc(null)}
        />
      )}

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <DatePickerInput value={field.value} onChange={field.onChange} />
              <FieldError errors={[form.formState.errors.birth_date]} />
            </Field>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {!isPublic && (
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
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !!form.formState.errors.nickname}
          className={isPublic ? "w-full md:w-auto" : ""}
        >
          {isSubmitting ? "Salvando..." : isPublic ? "Registrar" : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
