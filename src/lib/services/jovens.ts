

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateYouthAchievements } from "./pontos";

export async function getJovens() {
  try {
    const activeSeason = await prisma.season.findFirst({
      where: { is_active: true },
    });

    const jovens = await prisma.youth.findMany({
      orderBy: { name: "asc" },
      include: {
        score_transactions: activeSeason ? {
          where: { season_id: activeSeason.id },
          orderBy: { created_at: "desc" },
          include: { point_rule: true, activity: true }
        } : false
      }
    });

    const pointsSum = await prisma.scoreTransaction.groupBy({
      by: ["youth_id"],
      where: activeSeason ? { season_id: activeSeason.id } : undefined,
      _sum: {
        points: true,
      },
    });

    const pointsMap = pointsSum.reduce(
      (acc, curr) => {
        acc[curr.youth_id] = curr._sum.points || 0;
        return acc;
      },
      {} as Record<string, number>,
    );

    return jovens.map((jovem) => ({
      ...jovem,
      points: pointsMap[jovem.id] || 0,
    }));
  } catch (error) {
    console.error("Error fetching jovens:", error);
    return [];
  }
}

export async function createJovem(data: {
  name: string;
  nickname?: string;
  birth_date?: Date;
  phone?: string;
  instagram?: string;
  baptized: boolean;
  baptism_date?: Date;
  photo_url?: string;
  status: string;
}) {
  try {
    if (data.nickname) {
      const existing = await prisma.youth.findFirst({
        where: {
          nickname: {
            equals: data.nickname,
            mode: 'insensitive'
          }
        }
      });
      if (existing) {
        return { success: false, error: "Este apelido já está em uso por outro jovem." };
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const jovem = await tx.youth.create({
        data: {
          name: data.name,
          nickname: data.nickname || null,
          birth_date: data.birth_date || null,
          phone: data.phone || null,
          instagram: data.instagram || null,
          baptized: data.baptized,
          baptism_date: data.baptism_date || null,
          photo_url: data.photo_url || null,
          status: data.status,
        },
      });

      const activeSeason = await tx.season.findFirst({
        where: { is_active: true },
      });

      return { jovem, activeSeason };
    });

    if (result.activeSeason) {
      await updateYouthAchievements(result.jovem.id, result.activeSeason.id);
    }

    revalidatePath("/dashboard/jovens");
    return { success: true, data: result.jovem };
  } catch (error) {
    console.error("Error creating jovem:", error);
    return { success: false, error: "Falha ao criar jovem" };
  }
}

export async function updateJovem(
  id: string,
  data: {
    name: string;
    nickname?: string;
    birth_date?: Date;
    phone?: string;
    instagram?: string;
    baptized: boolean;
    baptism_date?: Date;
    photo_url?: string;
    status: string;
    points?: number;
  },
) {
  try {
    if (data.nickname) {
      const existing = await prisma.youth.findFirst({
        where: {
          nickname: {
            equals: data.nickname,
            mode: 'insensitive'
          },
          id: { not: id }
        }
      });
      if (existing) {
        return { success: false, error: "Este apelido já está em uso por outro jovem." };
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const jovem = await tx.youth.update({
        where: { id },
        data: {
          name: data.name,
          nickname: data.nickname || null,
          birth_date: data.birth_date || null,
          phone: data.phone || null,
          instagram: data.instagram || null,
          baptized: data.baptized,
          baptism_date: data.baptism_date || null,
          photo_url: data.photo_url || null,
          status: data.status,
        },
      });

      const activeSeason = await tx.season.findFirst({
        where: { is_active: true },
      });

      if (activeSeason && typeof data.points === "number") {
        // Calcular pontos atuais do jovem
        const pointsSum = await tx.scoreTransaction.aggregate({
          where: {
            youth_id: id,
            season_id: activeSeason.id,
          },
          _sum: {
            points: true,
          },
        });

        const currentPoints = pointsSum._sum.points || 0;
        const diff = data.points - currentPoints;

        if (diff !== 0) {
          await tx.scoreTransaction.create({
            data: {
              season_id: activeSeason.id,
              youth_id: id,
              points: diff,
              description: `Ajuste manual de pontos (Novo total: ${data.points})`,
            },
          });
        }
      }

      return { jovem, activeSeason };
    });

    if (result.activeSeason) {
      await updateYouthAchievements(result.jovem.id, result.activeSeason.id);
    }

    revalidatePath("/dashboard/jovens");
    return { success: true, data: result.jovem };
  } catch (error) {
    console.error("Error updating jovem:", error);
    return { success: false, error: "Falha ao atualizar jovem" };
  }
}

export async function deleteJovem(id: string) {
  try {
    // Usando soft delete alterando o status
    await prisma.youth.update({
      where: { id },
      data: { status: "inactive" },
    });
    revalidatePath("/dashboard/jovens");
    return { success: true };
  } catch (error) {
    console.error("Error deleting jovem:", error);
    return { success: false, error: "Falha ao inativar jovem" };
  }
}
