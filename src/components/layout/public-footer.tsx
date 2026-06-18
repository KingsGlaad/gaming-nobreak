import Image from "next/image";

export function PublicFooter() {
  return (
    <footer className="border-t border-border/50 bg-card/60 backdrop-blur-xl relative z-10">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded flex items-center justify-center">
              <Image
                src="/images/logo1.jpg"
                alt="Logo"
                width={20}
                height={20}
                className="rounded-lg"
              />
            </div>
            <span className="font-semibold text-sm">Gaming Nobreak</span>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Gaming Nobreak. Todos os direitos
            reservados.
          </div>
          <div className="text-sm text-muted-foreground flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">
              Termos
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
