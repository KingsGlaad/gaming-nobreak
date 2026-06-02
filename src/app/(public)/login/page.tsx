import { Metadata } from "next";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Entrar | Gaming Nobreak",
  description: "Acesse a área administrativa da plataforma Gaming Nobreak",
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-full w-full py-12">
      <div className="w-full max-w-[90%] md:max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <LoginForm />
      </div>
    </div>
  );
}
