import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVisitantes() {
  try {
    const visitantes = await prisma.visitor.findMany({
      include: {
        responsible_youth: true,
      },
      orderBy: { created_at: "desc" },
    });
    return visitantes;
  } catch (error) {
    console.error("Error fetching visitantes:", error);
    return [];
  }
}

export async function createVisitante(data: {
  name: string;
  phone?: string;
  instagram?: string;
  responsible_youth_id?: string;
  visit_date?: Date;
  notes?: string;
}) {
  try {
    const visitante = await prisma.visitor.create({
      data: {
        name: data.name,
        phone: data.phone || null,
        instagram: data.instagram || null,
        responsible_youth_id: data.responsible_youth_id || null,
        visit_date: data.visit_date || new Date(),
        notes: data.notes || null,
      },
    });

    revalidatePath("/dashboard/visitantes");
    return { success: true, data: visitante };
  } catch (error) {
    console.error("Error creating visitante:", error);
    return { success: false, error: "Falha ao criar visitante" };
  }
}

export async function updateVisitante(
  id: string,
  data: {
    name: string;
    phone?: string;
    instagram?: string;
    responsible_youth_id?: string;
    visit_date?: Date;
    notes?: string;
  }
) {
  try {
    const visitante = await prisma.visitor.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone || null,
        instagram: data.instagram || null,
        responsible_youth_id: data.responsible_youth_id || null,
        visit_date: data.visit_date || new Date(),
        notes: data.notes || null,
      },
    });

    revalidatePath("/dashboard/visitantes");
    return { success: true, data: visitante };
  } catch (error) {
    console.error("Error updating visitante:", error);
    return { success: false, error: "Falha ao atualizar visitante" };
  }
}

export async function deleteVisitante(id: string) {
  try {
    await prisma.visitor.delete({
      where: { id },
    });
    revalidatePath("/dashboard/visitantes");
    return { success: true };
  } catch (error) {
    console.error("Error deleting visitante:", error);
    return { success: false, error: "Falha ao excluir visitante" };
  }
}
