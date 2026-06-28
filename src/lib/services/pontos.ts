

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addPoints(data: {
  youth_id: string;
  rule_id: string;
  points: number;
  description?: string;
  leader_email?: string | null;
}) {
  try {
    // Buscar a temporada ativa
    const activeSeason = await prisma.season.findFirst({
      where: { is_active: true },
    });

    if (!activeSeason) {
      return { success: false, error: "Nenhuma temporada ativa encontrada. Por favor, ative uma temporada primeiro." };
    }

    // Buscar o líder através do e-mail (opcional)
    let leaderId = null;
    if (data.leader_email) {
      const user = await prisma.user.findUnique({
        where: { email: data.leader_email },
        include: { leaders: true }
      });
      if (user && user.leaders && user.leaders.length > 0) {
        leaderId = user.leaders[0].id;
      }
    }

    const transaction = await prisma.scoreTransaction.create({
      data: {
        youth_id: data.youth_id,
        point_rule_id: data.rule_id,
        points: data.points,
        description: data.description || null,
        season_id: activeSeason.id,
        leader_id: leaderId,
      },
    });

    // Atualiza as conquistas do jovem com base na pontuação total
    await updateYouthAchievements(data.youth_id, activeSeason.id);

    revalidatePath("/dashboard/jovens");
    revalidatePath("/dashboard");
    return { success: true, data: transaction };
  } catch (error) {
    console.error("Error adding points:", error);
    return { success: false, error: "Falha ao registrar pontos" };
  }
}

export async function updateYouthAchievements(youthId: string, seasonId: string) {
  try {
    let newAchievementsUnlocked = true;

    while (newAchievementsUnlocked) {
      newAchievementsUnlocked = false;

      const sumResult = await prisma.scoreTransaction.aggregate({
        where: {
          youth_id: youthId,
          season_id: seasonId,
        },
        _sum: {
          points: true,
        },
      });

      const totalPoints = sumResult._sum.points || 0;

      const visitorsCount = await prisma.visitor.count({
        where: {
          responsible_youth_id: youthId,
        },
      });

      const ebdCondition = {
        OR: [
          { title: { contains: "ebd", mode: "insensitive" as const } },
          { title: { contains: "escola bíblica", mode: "insensitive" as const } },
          { title: { contains: "escola biblica", mode: "insensitive" as const } },
          { title: { contains: "dominical", mode: "insensitive" as const } },
          { activity_type: { name: { contains: "ebd", mode: "insensitive" as const } } },
          { activity_type: { name: { contains: "escola bíblica", mode: "insensitive" as const } } },
          { activity_type: { name: { contains: "escola biblica", mode: "insensitive" as const } } },
          { activity_type: { name: { contains: "dominical", mode: "insensitive" as const } } },
        ]
      };

      const discipuladoCondition = {
        OR: [
          { title: { contains: "discipulado", mode: "insensitive" as const } },
          { activity_type: { name: { contains: "discipulado", mode: "insensitive" as const } } },
        ]
      };

      const ebdCount = await prisma.attendance.count({
        where: {
          youth_id: youthId,
          season_id: seasonId,
          status: "present",
          activity: ebdCondition,
        },
      });

      const discipuladoCount = await prisma.attendance.count({
        where: {
          youth_id: youthId,
          season_id: seasonId,
          status: "present",
          activity: discipuladoCondition,
        },
      });

      const cultosCount = await prisma.attendance.count({
        where: {
          youth_id: youthId,
          season_id: seasonId,
          status: "present",
          NOT: {
            activity: {
              OR: [
                ebdCondition,
                discipuladoCondition
              ]
            }
          },
        },
      });

      const achievements = await prisma.achievement.findMany();

      const qualifiedAchievements = achievements.filter((ach) => {
        if (ach.condition_type === "points") {
          return totalPoints >= ach.condition_value;
        }
        if (ach.condition_type === "visitors") {
          return visitorsCount >= ach.condition_value;
        }
        if (ach.condition_type === "cultos") {
          return cultosCount >= ach.condition_value;
        }
        if (ach.condition_type === "ebd") {
          return ebdCount >= ach.condition_value;
        }
        if (ach.condition_type === "discipulado") {
          return discipuladoCount >= ach.condition_value;
        }
        return false;
      });

      const alreadyAwarded = await prisma.youthAchievement.findMany({
        where: {
          youth_id: youthId,
          season_id: seasonId,
        },
        select: {
          achievement_id: true,
        },
      });
      const awardedIds = new Set(alreadyAwarded.map((a) => a.achievement_id));

      for (const ach of qualifiedAchievements) {
        if (!awardedIds.has(ach.id)) {
          await prisma.youthAchievement.create({
            data: {
              youth_id: youthId,
              season_id: seasonId,
              achievement_id: ach.id,
            },
          });

          if (ach.points > 0) {
            await prisma.scoreTransaction.create({
              data: {
                season_id: seasonId,
                youth_id: youthId,
                points: ach.points,
                description: `Conquista desbloqueada: ${ach.name}`,
              },
            });
          }

          newAchievementsUnlocked = true;
        }
      }
    }
  } catch (error) {
    console.error("Error updating youth achievements:", error);
  }
}

