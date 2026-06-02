import { ReactNode } from "react";
import { Metadata } from "next";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export const metadata: Metadata = {
  title: "Início | Gaming Nobreak",
  description: "Acompanhe as temporadas, conquistas e ranking dos jovens no Gaming Nobreak.",
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] rounded-full bg-primary/20 blur-[100px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] rounded-full bg-gradient-yellow/15 blur-[100px] md:blur-[120px] pointer-events-none" />

      {/* Header Separado */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-1 relative z-10 w-full">
        {children}
      </main>

      {/* Footer Separado */}
      <PublicFooter />
    </div>
  );
}
