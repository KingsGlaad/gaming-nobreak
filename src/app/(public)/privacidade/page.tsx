import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Política de Privacidade | Gaming Nobreak",
  description: "Política de Privacidade e Proteção de Dados da Plataforma Gaming Nobreak",
};

export default function PrivacidadePage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <CardTitle className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
            Política de Privacidade
          </CardTitle>
          <CardDescription className="text-lg">
            Plataforma Gaming Nobreak
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 text-muted-foreground">
          {/* 1. Introdução */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary text-xl">1.</span> Introdução
            </h2>
            <p className="leading-relaxed">
              A sua privacidade é importante para nós. Esta Política de Privacidade explica como o <strong className="text-foreground">Gaming Nobreak</strong> coleta, usa, compartilha e protege as suas informações pessoais ao utilizar nossa plataforma, em conformidade com as diretrizes de proteção de dados.
            </p>
          </section>

          <Separator className="bg-border/50" />

          {/* 2. Coleta de Dados */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary text-xl">2.</span> Dados que Coletamos
            </h2>
            <ul className="space-y-3 list-none pl-1">
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong className="text-foreground">Dados de Cadastro:</strong> Informações fornecidas no momento de criação da conta, como nome de usuário, e-mail e senha (armazenada de forma criptografada).
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong className="text-foreground">Dados de Progresso:</strong> Informações geradas durante sua participação, como pontuações, emblemas conquistados, histórico de atividades e nível atual no ranking.
                </span>
              </li>
            </ul>
          </section>

          <Separator className="bg-border/50" />

          {/* 3. Uso das Informações */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary text-xl">3.</span> Como Usamos as Informações
            </h2>
            <p className="leading-relaxed">
              Os dados coletados são utilizados exclusivamente para as seguintes finalidades:
            </p>
            <ul className="space-y-3 list-none pl-1 mt-4">
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Garantir o funcionamento adequado da plataforma e do sistema de pontuação e emblemas.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Exibir seu progresso e nome de usuário em rankings públicos (de acordo com as regras de visibilidade da plataforma).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Manter a integridade do jogo, prevenindo fraudes e automatizações.</span>
              </li>
            </ul>
          </section>

          <Separator className="bg-border/50" />

          {/* 4. Compartilhamento de Dados */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary text-xl">4.</span> Compartilhamento de Dados
            </h2>
            <p className="leading-relaxed">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins comerciais. O compartilhamento só ocorrerá mediante obrigação legal ou para a manutenção técnica dos nossos servidores com parceiros estritamente sob acordo de confidencialidade.
            </p>
          </section>

          <Separator className="bg-border/50" />

          {/* 5. Segurança */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary text-xl">5.</span> Segurança da Informação
            </h2>
            <p className="leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração. No entanto, lembre-se de que nenhum sistema na internet é 100% seguro.
            </p>
          </section>

          <Separator className="bg-border/50" />

          {/* 6. Direitos do Usuário */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary text-xl">6.</span> Seus Direitos
            </h2>
            <p className="leading-relaxed">
              Você tem o direito de solicitar o acesso, a correção ou a exclusão de seus dados pessoais a qualquer momento. Caso deseje excluir sua conta e remover seus dados da plataforma, entre em contato com a equipe de administração do Gaming Nobreak.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
