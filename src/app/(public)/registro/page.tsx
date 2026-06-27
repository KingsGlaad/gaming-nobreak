"use client";

import { motion } from "framer-motion";
import { JovemForm } from "@/components/shared/jovem-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegistroPage() {
  return (
    <div className="container max-w-2xl mx-auto py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit">
              <Gamepad2 className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Junte-se à Aventura!
            </CardTitle>
            <CardDescription className="text-lg">
              Crie seu perfil no Gaming Nobreak, participe das temporadas e
              conquiste prêmios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <JovemForm
              isPublic={true}
              onSuccess={() => {
                // Redirecionamento pode ser adicionado aqui, ou apenas exibir a mensagem de sucesso que já existe no form
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
