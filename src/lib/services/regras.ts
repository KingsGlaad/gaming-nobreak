

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getRegras() {
  try {
    const regras = await prisma.pointRule.findMany({
      orderBy: { name: 'asc' },
    });
    return regras;
  } catch (error) {
    console.error("Error fetching regras:", error);
    return [];
  }
}

// Helper to create a basic slug from a string
function slugify(text: string) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function createRegra(data: {
  name: string;
  description?: string;
  points: number;
  category?: string;
  is_active: boolean;
}) {
  try {
    const baseSlug = slugify(data.name);
    let slug = baseSlug;
    
    // Check if slug exists
    let exists = await prisma.pointRule.findUnique({ where: { slug } });
    let counter = 1;
    while (exists) {
      slug = `${baseSlug}-${counter}`;
      exists = await prisma.pointRule.findUnique({ where: { slug } });
      counter++;
    }

    const regra = await prisma.pointRule.create({
      data: {
        name: data.name,
        slug: slug,
        description: data.description || null,
        points: data.points,
        category: data.category || null,
        is_active: data.is_active,
      },
    });
    revalidatePath("/dashboard/regras");
    return { success: true, data: regra };
  } catch (error) {
    console.error("Error creating regra:", error);
    return { success: false, error: "Falha ao criar regra" };
  }
}

export async function updateRegra(
  id: string,
  data: {
    name: string;
    description?: string;
    points: number;
    category?: string;
    is_active: boolean;
  }
) {
  try {
    const regra = await prisma.pointRule.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        points: data.points,
        category: data.category || null,
        is_active: data.is_active,
        updated_at: new Date(),
      },
    });
    revalidatePath("/dashboard/regras");
    return { success: true, data: regra };
  } catch (error) {
    console.error("Error updating regra:", error);
    return { success: false, error: "Falha ao atualizar regra" };
  }
}

export async function deleteRegra(id: string) {
  try {
    await prisma.pointRule.delete({
      where: { id },
    });
    revalidatePath("/dashboard/regras");
    return { success: true };
  } catch (error) {
    console.error("Error deleting regra:", error);
    return { success: false, error: "Falha ao excluir regra" };
  }
}
