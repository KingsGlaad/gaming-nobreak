

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTemporadas() {
  try {
    const temporadas = await prisma.season.findMany({
      orderBy: { start_date: 'desc' },
    });
    return temporadas;
  } catch (error) {
    console.error("Error fetching temporadas:", error);
    return [];
  }
}

export async function createTemporada(data: {
  name: string;
  description?: string;
  start_date: string | Date;
  end_date: string | Date;
  is_active: boolean;
}) {
  try {
    // Se a nova temporada for ativa, desativamos as outras
    if (data.is_active) {
      await prisma.season.updateMany({
        where: { is_active: true },
        data: { is_active: false },
      });
    }

    const temporada = await prisma.season.create({
      data: {
        name: data.name,
        description: data.description || null,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        is_active: data.is_active,
      },
    });
    revalidatePath("/dashboard/temporadas");
    return { success: true, data: temporada };
  } catch (error) {
    console.error("Error creating temporada:", error);
    return { success: false, error: "Falha ao criar temporada" };
  }
}

export async function updateTemporada(
  id: string,
  data: {
    name: string;
    description?: string;
    start_date: string | Date;
    end_date: string | Date;
    is_active: boolean;
  }
) {
  try {
    // Se a temporada atualizada for ativa, desativamos as outras
    if (data.is_active) {
      await prisma.season.updateMany({
        where: { id: { not: id }, is_active: true },
        data: { is_active: false },
      });
    }

    const temporada = await prisma.season.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        is_active: data.is_active,
        updated_at: new Date(),
      },
    });
    revalidatePath("/dashboard/temporadas");
    return { success: true, data: temporada };
  } catch (error) {
    console.error("Error updating temporada:", error);
    return { success: false, error: "Falha ao atualizar temporada" };
  }
}

export async function deleteTemporada(id: string) {
  try {
    await prisma.season.delete({
      where: { id },
    });
    revalidatePath("/dashboard/temporadas");
    return { success: true };
  } catch (error) {
    console.error("Error deleting temporada:", error);
    return { success: false, error: "Falha ao excluir temporada" };
  }
}
