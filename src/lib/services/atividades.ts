

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAtividades() {
  try {
    const atividades = await prisma.activity.findMany({
      orderBy: { activity_date: "desc" },
      include: {
        season: true,
        activity_type: true,
      },
    });
    return atividades;
  } catch (error) {
    console.error("Error fetching atividades:", error);
    return [];
  }
}

export async function getTiposAtividade() {
  try {
    const tipos = await prisma.activityType.findMany({
      orderBy: { name: "asc" },
    });
    return tipos;
  } catch (error) {
    console.error("Error fetching activity types:", error);
    return [];
  }
}

export async function createAtividade(data: {
  title: string;
  description?: string;
  activity_date: string | Date;
  season_id?: string | null;
  activity_type_id?: string | null;
}) {
  try {
    const atividade = await prisma.activity.create({
      data: {
        title: data.title,
        description: data.description || null,
        activity_date: new Date(data.activity_date),
        season_id: data.season_id || null,
        activity_type_id: data.activity_type_id || null,
      },
    });
    revalidatePath("/dashboard/atividades");
    return { success: true, data: atividade };
  } catch (error) {
    console.error("Error creating atividade:", error);
    return { success: false, error: "Falha ao criar atividade" };
  }
}

export async function updateAtividade(
  id: string,
  data: {
    title: string;
    description?: string;
    activity_date: string | Date;
    season_id?: string | null;
    activity_type_id?: string | null;
  },
) {
  try {
    const atividade = await prisma.activity.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        activity_date: new Date(data.activity_date),
        season_id: data.season_id || null,
        activity_type_id: data.activity_type_id || null,
      },
    });
    revalidatePath("/dashboard/atividades");
    return { success: true, data: atividade };
  } catch (error) {
    console.error("Error updating atividade:", error);
    return { success: false, error: "Falha ao atualizar atividade" };
  }
}

export async function deleteAtividade(id: string) {
  try {
    await prisma.activity.delete({
      where: { id },
    });
    revalidatePath("/dashboard/atividades");
    return { success: true };
  } catch (error) {
    console.error("Error deleting atividade:", error);
    return { success: false, error: "Falha ao excluir atividade" };
  }
}
