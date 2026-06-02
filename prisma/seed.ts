import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environmental variables.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // ============================================================
  // 1. POPULAR NÍVEIS (Levels)
  // ============================================================
  console.log("Limpar e popular níveis (Levels)...");
  await prisma.level.deleteMany({});
  const levels = [
    {
      name: "Bronze",
      min_points: 0,
      max_points: 499,
      icon: "shield",
      order_index: 1,
    },
    {
      name: "Prata",
      min_points: 500,
      max_points: 999,
      icon: "shield-check",
      order_index: 2,
    },
    {
      name: "Ouro",
      min_points: 1000,
      max_points: 1499,
      icon: "award",
      order_index: 3,
    },
    {
      name: "Diamante",
      min_points: 1500,
      max_points: null,
      icon: "gem",
      order_index: 4,
    },
  ];
  for (const level of levels) {
    await prisma.level.create({
      data: level,
    });
  }

  // ============================================================
  // 2. POPULAR TIPOS DE ATIVIDADE (Activity Types)
  // ============================================================
  console.log("Populando tipos de atividade (ActivityTypes)...");
  const activityTypes = [
    {
      name: "Culto Nobreak",
      slug: "culto-nobreak",
      description: "Culto oficial de sábado da juventude Nobreak",
    },
    {
      name: "Célula",
      slug: "celula",
      description: "Reunião nos lares (Célula Nobreak)",
    },
    {
      name: "Discipulado",
      slug: "discipulado",
      description: "Encontro de discipulado um a um ou em grupo",
    },
    {
      name: "Evento Especial",
      slug: "evento-especial",
      description: "Acampamentos, congressos, vigílias e ações sociais",
    },
    {
      name: "Atividade Grupal / Gincana",
      slug: "gincana",
      description: "Atividades recreativas e competitivas em grupo",
    },
  ];
  for (const type of activityTypes) {
    await prisma.activityType.upsert({
      where: { slug: type.slug },
      update: type,
      create: type,
    });
  }

  // ============================================================
  // 3. POPULAR REGRAS DE PONTUAÇÃO (Point Rules)
  // ============================================================
  console.log("Populando regras de pontuação (PointRules)...");
  const pointRules = [
    {
      name: "Participação em Atividade Grupal",
      slug: "atividade_grupal_participacao",
      points: 20,
      category: "Geral",
      description: "Pontos por participar de atividades do grupo",
    },
    {
      name: "Destaque em Atividade Grupal",
      slug: "atividade_grupal_destaque",
      points: 20,
      category: "Geral",
      description: "Pontos por se destacar em atividades do grupo",
    },
    {
      name: "Discipulado da Semana",
      slug: "discipulado",
      points: 20,
      category: "Discipulado",
      description: "Encontro semanal de discipulado realizado",
    },
    {
      name: "Presença na Célula",
      slug: "celula",
      points: 20,
      category: "Célula",
      description: "Pontos por comparecer na célula semanal",
    },
    {
      name: "Servir na Recepção",
      slug: "nobreak_recepcao",
      points: 30,
      category: "Serviço",
      description: "Servir na equipe de recepção do Culto Nobreak",
    },
    {
      name: "Fazer Saudação no Altar",
      slug: "nobreak_saudacao",
      points: 30,
      category: "Serviço",
      description: "Fazer a saudação inicial ou avisos no altar",
    },
    {
      name: "Ministrar Oferta",
      slug: "nobreak_oferta",
      points: 30,
      category: "Serviço",
      description: "Ministrar o momento das ofertas no Culto Nobreak",
    },
    {
      name: "Fazer Abertura / Oração",
      slug: "nobreak_abertura",
      points: 40,
      category: "Serviço",
      description: "Fazer a abertura em oração ou dinâmica inicial",
    },
    {
      name: "Servir no Louvor / Mídia",
      slug: "nobreak_louvor",
      points: 50,
      category: "Serviço",
      description:
        "Servir no ministério de louvor, som, projeção ou transmissão",
    },
    {
      name: "Pregação / Ministração da Palavra",
      slug: "nobreak_ministracao",
      points: 100,
      category: "Serviço",
      description: "Ministrar a palavra principal no Culto Nobreak",
    },
    {
      name: "Trazer um Novo Visitante",
      slug: "visitante_primeira_visita",
      points: 50,
      category: "Evangelismo",
      description: "Trazer um amigo visitante pela primeira vez",
    },
    {
      name: "Retorno do Visitante",
      slug: "visitante_retorno",
      points: 50,
      category: "Evangelismo",
      description: "O visitante trazido por você retornou a um segundo culto",
    },
    {
      name: "Conversão / Decisão do Visitante",
      slug: "visitante_convertido",
      points: 100,
      category: "Evangelismo",
      description: "O visitante decidiu seguir a Jesus ou se batizar",
    },
    {
      name: "Leitura em Dupla da Semana",
      slug: "dupla_leitura",
      points: 20,
      category: "Espiritual",
      description: "Leitura bíblica ou devocional em dupla na semana",
    },
    {
      name: "Vídeo de Destaque / Desafio",
      slug: "video_destaque",
      points: 50,
      category: "Geral",
      description: "Participar ou gravar vídeo para as redes sociais Nobreak",
    },
    {
      name: "Participar do Clube do Livro",
      slug: "clube_livro",
      points: 20,
      category: "Espiritual",
      description: "Participação ativa no encontro do Clube do Livro Nobreak",
    },
    {
      name: "Bônus por Atitude / Honra",
      slug: "bonus_atitude",
      points: 20,
      category: "Geral",
      description: "Bônus concedido por líderes por atitude exemplar ou honra",
    },
  ];
  for (const rule of pointRules) {
    await prisma.pointRule.upsert({
      where: { slug: rule.slug },
      update: rule,
      create: rule,
    });
  }

  // ============================================================
  // 4. POPULAR CONQUISTAS (Achievements)
  // ============================================================
  console.log("Limpar e popular conquistas (Achievements)...");
  await prisma.achievement.deleteMany({});
  const achievements = [
    {
      name: "Boas-vindas ao Game",
      description: "Criou sua conta ou perfil no Nobreak Gaming",
      icon: "user-check",
      condition_type: "points",
      condition_value: 0,
      points: 50,
    },
    {
      name: "Desbravador Bronze",
      description: "Alcançou o nível Bronze",
      icon: "shield",
      condition_type: "points",
      condition_value: 1,
      points: 50,
    },
    {
      name: "Guerreiro de Prata",
      description: "Alcançou o nível Prata com mais de 500 pontos",
      icon: "shield-check",
      condition_type: "points",
      condition_value: 500,
      points: 100,
    },
    {
      name: "Lenda de Ouro",
      description: "Alcançou o nível Ouro com mais de 1000 pontos",
      icon: "award",
      condition_type: "points",
      condition_value: 1000,
      points: 150,
    },
    {
      name: "Mestre Diamante",
      description: "Alcançou a pontuação máxima de 1500 pontos",
      icon: "gem",
      condition_type: "points",
      condition_value: 1500,
      points: 200,
    },
    {
      name: "Pescador de Homens",
      description: "Trouxe o seu primeiro visitante para o Nobreak",
      icon: "users",
      condition_type: "visitors",
      condition_value: 1,
      points: 100,
    },
  ];
  for (const achievement of achievements) {
    await prisma.achievement.create({
      data: achievement,
    });
  }

  console.log("🎉 Seed executado com total sucesso!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
