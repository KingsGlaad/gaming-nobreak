"use server";

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getAchievements() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { points: "asc" }
    })
    return achievements
  } catch (error) {
    console.error("Error fetching achievements:", error)
    return []
  }
}

export async function createAchievement(data: {
  name: string
  description?: string
  icon?: string
  condition_type: string
  condition_value: number
  points: number
}) {
  try {
    const achievement = await prisma.achievement.create({
      data: {
        name: data.name,
        description: data.description || null,
        icon: data.icon || null,
        condition_type: data.condition_type,
        condition_value: data.condition_value,
        points: data.points,
      }
    })
    revalidatePath("/dashboard/conquistas")
    revalidatePath("/")
    return { success: true, data: achievement }
  } catch (error) {
    console.error("Error creating achievement:", error)
    return { success: false, error: "Falha ao criar conquista" }
  }
}

export async function updateAchievement(id: string, data: {
  name: string
  description?: string
  icon?: string
  condition_type: string
  condition_value: number
  points: number
}) {
  try {
    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        icon: data.icon || null,
        condition_type: data.condition_type,
        condition_value: data.condition_value,
        points: data.points,
      }
    })
    revalidatePath("/dashboard/conquistas")
    revalidatePath("/")
    return { success: true, data: achievement }
  } catch (error) {
    console.error("Error updating achievement:", error)
    return { success: false, error: "Falha ao atualizar conquista" }
  }
}

export async function deleteAchievement(id: string) {
  try {
    await prisma.achievement.delete({
      where: { id }
    })
    revalidatePath("/dashboard/conquistas")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting achievement:", error)
    return { success: false, error: "Falha ao excluir conquista (pode estar em uso)" }
  }
}
