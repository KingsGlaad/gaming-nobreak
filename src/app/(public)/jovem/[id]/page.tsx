import { Metadata } from "next";
import { ArrowLeft, Trophy, Medal, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getYouthProfile } from "@/actions/public";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface Params {
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id: identifier } = await params;
  const youth = await getYouthProfile(identifier);

  if (!youth) {
    return {
      title: "Jovem não encontrado | Gaming Nobreak",
      description: "Perfil de jovem não encontrado.",
    };
  }

  const displayName = youth.nickname ? `${youth.name} (@${youth.nickname})` : youth.name;
  return {
    title: `Perfil de ${displayName} | Gaming Nobreak`,
    description: `Acompanhe o nível (${youth.level}), medalhas e histórico de conquistas de ${youth.name} no Gaming Nobreak.`,
  };
}

export default async function YouthProfilePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id: identifier } = await params;
  const youth = await getYouthProfile(identifier);

  if (!youth) {
    return (
      <div className="max-w-md mx-auto px-4 py-32 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-3xl">
            ⚠️
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Jovem não encontrado
          </h2>
          <p className="text-muted-foreground">
            O perfil solicitado com o identificador &quot;{identifier}&quot; não
            pôde ser encontrado ou não existe na temporada ativa.
          </p>
        </div>
        <Link href="/ranking">
          <Button variant="outline" className="mt-4">
            Voltar ao Ranking
          </Button>
        </Link>
      </div>
    );
  }

  const levelColors: Record<
    string,
    { border: string; text: string; bg: string }
  > = {
    Bronze: {
      border: "border-amber-700/30",
      text: "text-amber-700 dark:text-amber-500",
      bg: "bg-amber-700/10",
    },
    Prata: {
      border: "border-slate-400/30",
      text: "text-slate-400",
      bg: "bg-slate-400/10",
    },
    Ouro: {
      border: "border-yellow-500/30",
      text: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    Diamante: {
      border: "border-cyan-400/30",
      text: "text-cyan-400 dark:text-cyan-400",
      bg: "bg-cyan-400/10",
    },
  };

  const currentLevelColor = levelColors[youth.level] || {
    border: "border-primary/30",
    text: "text-primary",
    bg: "bg-primary/10",
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Link href="/ranking">
          <Button
            variant="ghost"
            className="mb-6 -ml-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Ranking
          </Button>
        </Link>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start p-6 md:p-8 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 pointer-events-none select-none">
            <Image
              src={`/badges/${youth.level.toLowerCase()}.png`}
              alt={`Emblema ${youth.level}`}
              className="h-32 w-32 md:h-40 md:w-40 object-contain"
              width={128}
              height={128}
            />
          </div>

          <Avatar className="h-32 w-32 md:h-40 md:w-40 shrink-0 rounded-full border-4 border-primary/20 shadow-xl z-10">
            {youth.photo_url ? (
              <AvatarImage
                src={youth.photo_url}
                alt={youth.name}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="text-4xl font-bold bg-muted text-muted-foreground">
              {youth.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-4 relative z-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {youth.name}
              </h1>
              {youth.nickname && (
                <p className="text-lg text-muted-foreground font-medium">
                  @{youth.nickname}
                </p>
              )}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Badge
                variant="outline"
                className={`text-sm py-1 ${currentLevelColor.border} ${currentLevelColor.text} ${currentLevelColor.bg}`}
              >
                Nível {youth.level}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center h-full ml-2">
                {youth.joinDate}
              </span>
            </div>

            <div className="pt-2 text-center md:text-left">
              <span
                className={`text-2xl font-bold ${currentLevelColor.text} block md:inline`}
              >
                {youth.points}
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                pontos acumulados nesta temporada
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Conquistas */}
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-yellow-500" />
              Conquistas Desbloqueadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {youth.achievements.length === 0 ? (
              <p className="text-center py-6 text-sm text-muted-foreground">
                Nenhuma conquista desbloqueada nesta temporada.
              </p>
            ) : (
              <div className="space-y-4">
                {youth.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="flex items-start gap-4 p-3 rounded-xl bg-background/50 border border-border/50"
                  >
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center text-2xl bg-muted rounded-lg">
                      {ach.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{ach.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {ach.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Histórico */}
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-secondary" />
              Últimas Pontuações
            </CardTitle>
          </CardHeader>
          <CardContent>
            {youth.history.length === 0 ? (
              <p className="text-center py-6 text-sm text-muted-foreground">
                Nenhum ponto registrado nesta temporada.
              </p>
            ) : (
              <div className="space-y-4">
                {youth.history.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 rounded-xl bg-background/50 border border-border/50"
                  >
                    <div>
                      <h4 className="font-medium text-sm">{item.action}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.date}
                      </p>
                    </div>
                    <div className="font-bold text-primary">{item.points}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
