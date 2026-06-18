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
  console.log("🌱 Iniciando seed de atividades programadas...");

  const types = await prisma.activityType.findMany();
  const getTypeId = (slug: string) => types.find(t => t.slug === slug)?.id || null;

  // Tentar pegar uma temporada ativa para associar
  const activeSeason = await prisma.season.findFirst({
    where: { is_active: true }
  });

  const activitiesData = [];

  // Data inicial: 11 de Julho de 2026, 19:30 (horário local de Brasília, UTC-3)
  let currentDate = new Date("2026-07-11T19:30:00-03:00");
  
  let discipuladoCount = 2; // Já tem o 01
  let celulaCount = 1; // 1 = Pré Nobreak, 2 = Célula 02
  let nobreakCount = 2; // Começa do 2º Nobreak
  
  // 24 sábados do dia 11 de julho ao dia 19 de dezembro
  for (let i = 0; i < 24; i++) {
    const cycleIndex = i % 4;
    let title = "";
    let slug = "";
    
    if (cycleIndex === 0) {
      title = "Atividade - a definir";
      slug = "evento-especial";
    } else if (cycleIndex === 1) {
      title = `Discipulado ${discipuladoCount.toString().padStart(2, '0')}`;
      slug = "discipulado";
      discipuladoCount++;
    } else if (cycleIndex === 2) {
      if (celulaCount === 1) {
        title = "Célula - Pré Nobreak";
      } else {
        title = `Célula ${celulaCount.toString().padStart(2, '0')}`;
      }
      slug = "celula";
      celulaCount++;
    } else if (cycleIndex === 3) {
      title = `${nobreakCount}º Nobreak`;
      slug = "culto-nobreak";
      nobreakCount++;
    }
    
    const activity_type_id = getTypeId(slug);
    
    activitiesData.push({
      title,
      activity_date: new Date(currentDate),
      activity_type_id,
      season_id: activeSeason?.id || null,
    });
    
    // Avançar 7 dias
    currentDate.setDate(currentDate.getDate() + 7);
  }

  console.log(`Gerando ${activitiesData.length} atividades...`);

  for (const act of activitiesData) {
    const created = await prisma.activity.create({
      data: act,
    });
    console.log(`✅ Criado: ${act.title} - ${created.activity_date.toLocaleString('pt-BR')}`);
  }

  console.log("🎉 Todas as atividades foram geradas com sucesso!");
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
