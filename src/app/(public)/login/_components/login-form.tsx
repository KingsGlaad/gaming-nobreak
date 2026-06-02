"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  if (session) {
    router.push("/dashboard");
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginSchema) {
    setIsLoading(true);

    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.error) {
        toast.error("Credenciais inválidas. Tente novamente.");
      } else {
        toast.success("Login efetuado com sucesso!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao tentar fazer login.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border border-border/50 shadow-2xl bg-card/60 backdrop-blur-xl sm:mx-auto">
      <CardHeader className="space-y-1 pb-4 md:pb-6">
        <div className="flex justify-center mb-2">
          <div className="h-14 w-14 md:h-12 md:w-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 md:h-6 md:w-6 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]"
            >
              <rect width="20" height="12" x="2" y="6" rx="2" />
              <path d="M12 12h.01" />
              <path d="M17 12h.01" />
              <path d="M7 12h.01" />
            </svg>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          Gaming Nobreak
        </CardTitle>
        <CardDescription className="text-center">
          Acesse a plataforma com suas credenciais
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm md:text-base">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@admin.com"
              {...register("email")}
              disabled={isLoading}
              className={`min-h-[48px] md:min-h-[40px] text-base transition-colors focus-visible:ring-secondary ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.email && (
              <p className="text-sm text-destructive font-medium">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm md:text-base">
                Senha
              </Label>
              <a
                href="#"
                className="text-sm font-medium text-secondary hover:underline hover:text-secondary/80 transition-colors"
              >
                Esqueceu a senha?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isLoading}
              className={`min-h-[48px] md:min-h-[40px] text-base transition-colors focus-visible:ring-secondary ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.password && (
              <p className="text-sm text-destructive font-medium">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-4 md:pt-2">
          <Button
            type="submit"
            className="w-full min-h-[48px] md:min-h-[40px] text-base font-bold bg-gradient-to-r from-gradient-yellow to-gradient-yellow-end text-black hover:opacity-90 transition-all shadow-[0_0_15px_var(--color-gradient-yellow)] hover:shadow-[0_0_25px_var(--color-gradient-yellow)] border-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
                Entrando...
              </>
            ) : (
              "Entrar na plataforma"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
