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
  title: "Regulamento | Gaming Nobreak",
  description: "Regulamento Oficial da Plataforma Gaming Nobreak",
};

export default function RegulamentoPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <CardTitle className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
            Regulamento Oficial
          </CardTitle>
          <CardDescription className="text-lg">
            Plataforma Gaming Nobreak
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 text-muted-foreground">
          {/* 1. Objetivo do Jogo */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary text-xl">1.</span> Objetivo do Jogo
            </h2>
            <p className="leading-relaxed">
              O presente documento estabelece as diretrizes de participação e
              conduta para os usuários da plataforma Gaming Nobreak. O objetivo
              do sistema é promover o engajamento através de desafios,
              recompensando o progresso contínuo dos jogadores com conquistas
              digitais.
            </p>
          </section>

          <Separator className="bg-border/50" />

          {/* 2. Cadastro e Gerenciamento de Contas */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary text-xl">2.</span> Cadastro e
              Gerenciamento de Contas
            </h2>
            <ul className="space-y-3 list-none pl-1">
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong className="text-foreground">Registro:</strong> Para
                  participar, o jogador deve se cadastrar na plataforma, momento
                  em que será gerado um registro em nosso banco de dados
                  relacional.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong className="text-foreground">
                    Identidade do Jogador:
                  </strong>{" "}
                  Cada participante será identificado por um nome de usuário
                  único (user_name), que é gerado e validado de forma
                  incremental pelo sistema.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong className="text-foreground">Uso Individual:</strong>{" "}
                  As contas são de uso estritamente pessoal e intransferível.
                </span>
              </li>
            </ul>
          </section>

          <Separator className="bg-border/50" />

          {/* 3. Sistema de Progressão e Emblemas (Badges) */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary text-xl">3.</span> Sistema de
              Progressão e Emblemas (Badges)
            </h2>
            <p className="leading-relaxed">
              O núcleo da experiência baseia-se em um sistema de recompensas
              visuais. Conforme os jogadores completam objetivos, eles
              desbloqueiam emblemas oficiais em seu perfil, divididos na
              seguinte hierarquia de raridade:
            </p>
            <ul className="space-y-3 list-none pl-1 mt-4">
              <li className="flex gap-2">
                <span className="text-[#CD7F32] mt-1 text-lg">✦</span>
                <span>
                  <strong className="text-foreground">Nível Bronze:</strong>{" "}
                  Emblema de entrada, concedido aos jogadores nas etapas
                  iniciais de progressão.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-400 mt-1 text-lg">✦</span>
                <span>
                  <strong className="text-foreground">Nível Prata:</strong>{" "}
                  Emblema intermediário, indicando dedicação e superação dos
                  desafios básicos.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-500 mt-1 text-lg">✦</span>
                <span>
                  <strong className="text-foreground">Nível Ouro:</strong>{" "}
                  Emblema avançado, destinado aos jogadores com alto índice de
                  vitórias e engajamento.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-400 mt-1 text-lg">✦</span>
                <span>
                  <strong className="text-foreground">Nível Diamante:</strong> O
                  emblema de prestígio máximo da plataforma, reservado apenas
                  para a elite dos jogadores.
                </span>
              </li>
            </ul>
          </section>

          <Separator className="bg-border/50" />

          {/* 4. Regras de Conduta e Fair Play */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary text-xl">4.</span> Regras de Conduta
              e Fair Play
            </h2>
            <ul className="space-y-3 list-none pl-1">
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong className="text-foreground">
                    Integridade do Sistema:
                  </strong>{" "}
                  É estritamente proibida a manipulação do código da plataforma
                  (desenvolvida em ambiente web moderno) ou o uso de scripts
                  automatizados para inflar pontuações de forma artificial.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong className="text-foreground">
                    Auditoria de Dados:
                  </strong>{" "}
                  A administração reserva-se o direito de auditar os registros
                  de banco de dados dos usuários a qualquer momento para
                  garantir que as conquistas e mudanças de nível foram obtidas
                  de forma legítima.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  <strong className="text-foreground">Penalidades:</strong> A
                  detecção de fraudes resultará na revogação imediata dos
                  emblemas conquistados e no possível banimento da conta.
                </span>
              </li>
            </ul>
          </section>

          <Separator className="bg-border/50" />

          {/* 5. Disposições Gerais */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary text-xl">5.</span> Disposições
              Gerais
            </h2>
            <div className="space-y-3 leading-relaxed">
              <p>
                Todos os emblemas e elementos visuais de destaque (incluindo o
                gaming-hero) conquistados pelo usuário ficarão atrelados
                permanentemente à sua conta, exibidos publicamente.
              </p>
              <p>
                A equipe de desenvolvimento do Gaming Nobreak pode realizar
                manutenções, aplicar atualizações de balanceamento e alterar os
                requisitos para a conquista dos emblemas a qualquer momento para
                garantir a saúde do jogo.
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
