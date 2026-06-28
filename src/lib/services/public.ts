/* eslint-disable @typescript-eslint/no-explicit-any */


import { prisma } from "@/lib/prisma";

export async function getTopRanking(limit: number = 2) {
  try {
    const activeSeason = await prisma.season.findFirst({
      where: { is_active: true },
    });

    if (!activeSeason) {
      return [];
    }

    const ranking = await prisma.scoreTransaction.groupBy({
      by: ["youth_id"],
      where: { season_id: activeSeason.id },
      _sum: {
        points: true,
      },
      orderBy: {
        _sum: {
          points: "desc",
        },
      },
      take: limit,
    });

    const youthIds = ranking.map((r) => r.youth_id);

    const youths = await prisma.youth.findMany({
      where: { id: { in: youthIds } },
      select: { id: true, name: true, nickname: true, photo_url: true },
    });

    const youthsMap = youths.reduce(
      (acc, youth) => {
        acc[youth.id] = youth;
        return acc;
      },
      {} as Record<string, any>,
    );

    return ranking.map((r) => ({
      id: r.youth_id,
      name:
        youthsMap[r.youth_id]?.nickname ||
        youthsMap[r.youth_id]?.name ||
        "Desconhecido",
      points: r._sum.points || 0,
      photo_url: youthsMap[r.youth_id]?.photo_url || null,
    }));
  } catch (error) {
    console.error("Error fetching top ranking:", error);
    return [];
  }
}

export async function getUpcomingEvents(limit: number = 2) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activities = await prisma.activity.findMany({
      where: {
        activity_date: {
          gte: today,
        },
      },
      include: {
        activity_type: true,
      },
      orderBy: {
        activity_date: "asc",
      },
      take: limit,
    });

    return activities;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}

export async function getCurrentSeason() {
  try {
    const activeSeason = await prisma.season.findFirst({
      where: { is_active: true },
    });

    return activeSeason;
  } catch (error) {
    console.error("Error fetching current season:", error);
    return null;
  }
}

export async function getAchivements() {
  try {
    const achivements = await prisma.achievement.findMany();

    return achivements;
  } catch (error) {
    console.error("Error fetching achivements:", error);
    return [];
  }
}

export async function getRanking() {
  try {
    const activeSeason = await prisma.season.findFirst({
      where: { is_active: true },
    });

    if (!activeSeason) {
      return [];
    }

    // Buscar jovens ativos
    const youths = await prisma.youth.findMany({
      where: { status: "active" },
      select: { id: true, name: true, nickname: true, photo_url: true },
    });

    // Buscar a soma de pontos para a temporada ativa por jovem
    const scoreSum = await prisma.scoreTransaction.groupBy({
      by: ["youth_id"],
      where: { season_id: activeSeason.id },
      _sum: {
        points: true,
      },
    });

    const pointsMap = scoreSum.reduce(
      (acc, current) => {
        acc[current.youth_id] = current._sum.points || 0;
        return acc;
      },
      {} as Record<string, number>,
    );

    const ranking = youths.map((youth) => {
      const points = pointsMap[youth.id] || 0;
      let level = "Bronze";
      if (points >= 1500) level = "Diamante";
      else if (points >= 1000) level = "Ouro";
      else if (points >= 500) level = "Prata";

      return {
        id: youth.id,
        name: youth.name,
        nickname: youth.nickname || "",
        points,
        level,
        photo_url: youth.photo_url || null,
      };
    });

    // Ordenar decrescente por pontos e depois alfabético por nome
    ranking.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return a.name.localeCompare(b.name);
    });

    return ranking;
  } catch (error) {
    console.error("Error fetching ranking:", error);
    return [];
  }
}

export async function getYouthProfile(identifier: string) {
  try {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[0-89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        identifier,
      );

    const activeSeason = await prisma.season.findFirst({
      where: { is_active: true },
    });

    const youth = await prisma.youth.findFirst({
      where: isUuid
        ? { id: identifier }
        : {
            nickname: { equals: identifier, mode: "insensitive" },
            status: "active",
          },
      include: {
        score_transactions: {
          where: activeSeason ? { season_id: activeSeason.id } : undefined,
          include: {
            point_rule: true,
          },
          orderBy: {
            created_at: "desc",
          },
        },
        youth_achievements: {
          where: activeSeason ? { season_id: activeSeason.id } : undefined,
          include: {
            achievement: true,
          },
        },
      },
    });

    if (!youth) {
      return null;
    }

    const points = youth.score_transactions.reduce(
      (acc, t) => acc + t.points,
      0,
    );
    let level = "Bronze";
    if (points >= 1500) level = "Diamante";
    else if (points >= 1000) level = "Ouro";
    else if (points >= 500) level = "Prata";

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

    const visitorsCount = await prisma.visitor.count({
      where: { responsible_youth_id: youth.id }
    });

    const cultosCount = await prisma.attendance.count({
      where: {
        youth_id: youth.id,
        status: "present",
        ...(activeSeason && { season_id: activeSeason.id }),
        NOT: {
          activity: {
            OR: [
              ebdCondition,
              discipuladoCondition
            ]
          }
        }
      }
    });

    const ebdCount = await prisma.attendance.count({
      where: {
        youth_id: youth.id,
        status: "present",
        ...(activeSeason && { season_id: activeSeason.id }),
        activity: ebdCondition
      }
    });

    const discipuladoCount = await prisma.attendance.count({
      where: {
        youth_id: youth.id,
        status: "present",
        ...(activeSeason && { season_id: activeSeason.id }),
        activity: discipuladoCondition
      }
    });

    const allAchievements = await prisma.achievement.findMany({ orderBy: { condition_value: "asc" } });
    const unlockedIds = new Set(youth.youth_achievements.map((ya) => ya.achievement_id));

    const achievements = allAchievements.map((ach) => {
      let currentProgress = 0;
      if (ach.condition_type === "points") currentProgress = points;
      else if (ach.condition_type === "visitors") currentProgress = visitorsCount;
      else if (ach.condition_type === "cultos") currentProgress = cultosCount;
      else if (ach.condition_type === "ebd") currentProgress = ebdCount;
      else if (ach.condition_type === "discipulado") currentProgress = discipuladoCount;

      return {
        id: ach.id,
        name: ach.name,
        desc: ach.description || "",
        icon: ach.icon || "⭐",
        unlocked: unlockedIds.has(ach.id),
        progress: currentProgress,
        target: ach.condition_value
      };
    });

    const history = youth.score_transactions.map((t) => ({
      id: t.id,
      date: new Date(t.created_at).toLocaleDateString("pt-BR"),
      action: t.description || t.point_rule?.name || "Pontos atribuídos",
      points: t.points >= 0 ? `+${t.points}` : `${t.points}`,
    }));

    const joinDate = `Desde ${new Date(youth.created_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}`;

    return {
      id: youth.id,
      name: youth.name,
      nickname: youth.nickname || "",
      photo_url: youth.photo_url || null,
      level,
      points,
      joinDate,
      achievements,
      history,
    };
  } catch (error) {
    console.error("Error fetching youth profile:", error);
    return null;
  }
}
