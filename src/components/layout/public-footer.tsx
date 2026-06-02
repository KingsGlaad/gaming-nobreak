export function PublicFooter() {
  return (
    <footer className="border-t border-border/50 bg-card/60 backdrop-blur-xl relative z-10">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded flex items-center justify-center bg-primary/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-primary"
              >
                <rect width="20" height="12" x="2" y="6" rx="2" />
              </svg>
            </div>
            <span className="font-semibold text-sm">Gaming Nobreak</span>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Gaming Nobreak. Todos os direitos reservados.
          </div>
          <div className="text-sm text-muted-foreground flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Termos</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
