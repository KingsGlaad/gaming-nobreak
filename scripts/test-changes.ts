import { prisma } from "../src/lib/prisma";
import { updateYouthAchievements } from "../src/lib/services/pontos";



async function runTest() {
  console.log("Iniciando testes de Visitantes e Conquistas de Cultos...");

  try {
    // 1. Obter a temporada ativa
    const season = await prisma.season.findFirst({ where: { is_active: true } });
    if (!season) {
      console.log("Nenhuma temporada ativa. Crie/ative uma temporada primeiro.");
      return;
    }

    // 2. Criar um Jovem de Teste
    const youth = await prisma.youth.create({
      data: {
        name: "Jovem Teste Visitante " + Date.now(),
        status: "active",
        baptized: false,
      }
    });
    console.log(`Jovem de teste criado: ${youth.name}`);

    // 3. Criar uma Conquista de Cultos
    const achCultos = await prisma.achievement.create({
      data: {
        name: "Fiel (Cultos)",
        condition_type: "cultos",
        condition_value: 2,
        points: 50,
      }
    });
    console.log(`Conquista de Cultos criada: ${achCultos.name}`);

    // 4. Criar uma Conquista de Visitantes
    const achVisitantes = await prisma.achievement.create({
      data: {
        name: "Evangelista",
        condition_type: "visitors",
        condition_value: 1,
        points: 50,
      }
    });
    console.log(`Conquista de Visitantes criada: ${achVisitantes.name}`);

    // 5. Adicionar um Visitante para esse jovem
    const visitor = await prisma.visitor.create({
      data: {
        name: "Visitante do " + youth.name,
        responsible_youth_id: youth.id,
      }
    });
    console.log(`Visitante criado e vinculado ao jovem.`);

    // 6. Adicionar 2 presenças de cultos (Activity Type dummy)
    const actType = await prisma.activityType.create({
      data: { name: "Culto Teste", slug: "culto-teste-" + Date.now() }
    });
    const act1 = await prisma.activity.create({
      data: { title: "Culto 1", activity_date: new Date(), season_id: season.id, activity_type_id: actType.id }
    });
    const act2 = await prisma.activity.create({
      data: { title: "Culto 2", activity_date: new Date(), season_id: season.id, activity_type_id: actType.id }
    });

    await prisma.attendance.create({ data: { youth_id: youth.id, activity_id: act1.id, season_id: season.id } });
    await prisma.attendance.create({ data: { youth_id: youth.id, activity_id: act2.id, season_id: season.id } });
    console.log(`2 Presenças de cultos adicionadas para o jovem.`);

    // 7. Rodar a verificação de conquistas
    await updateYouthAchievements(youth.id, season.id);
    console.log(`Verificação de conquistas rodada.`);

    // 8. Verificar se o jovem ganhou as conquistas
    const wonAchievements = await prisma.youthAchievement.findMany({
      where: { youth_id: youth.id, season_id: season.id },
      include: { achievement: true }
    });

    console.log("Conquistas recebidas pelo jovem:");
    wonAchievements.forEach(wa => console.log(`- ${wa.achievement.name}`));

    if (wonAchievements.length >= 2) {
      console.log("✅ TESTE PASSOU: O jovem recebeu as conquistas por cultos e visitantes corretamente.");
    } else {
      console.log("❌ TESTE FALHOU: O jovem não recebeu todas as conquistas.");
    }

  } catch (error) {
    console.error("Erro no script de teste:", error);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();
