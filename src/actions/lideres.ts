/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getLideres() {
  try {
    const lideres = await prisma.leader.findMany({
      include: {
        user: true,
      },
      orderBy: { name: "asc" },
    });
    return lideres;
  } catch (error) {
    console.error("Error fetching lideres:", error);
    return [];
  }
}
export async function createLider(data: {
  name: string;
  email?: string;
  role?: string;
  password?: string;
}) {
  try {
    const passwordHash = data.password && data.password.trim() !== ""
      ? await bcrypt.hash(data.password, 10)
      : await bcrypt.hash("lider123", 10);
    let userId: string | undefined = undefined;

    // Se informou um email, tenta vincular ou criar um User
    if (data.email) {
      let user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: data.name,
            email: data.email,
            role:
              data.role === "Líder" ||
              data.role === "Co-líder" ||
              data.role === "Apoio" ||
              data.role === "Pastor"
                ? "leader"
                : data.role || "leader",
            password: passwordHash,
          },
        });
      } else {
        // Se o usuário já existe, atualiza os dados dele (incluindo a senha se necessário)
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: data.name,
            role:
              data.role === "Líder" ||
              data.role === "Co-líder" ||
              data.role === "Apoio" ||
              data.role === "Pastor"
                ? "leader"
                : data.role || "leader",
            password: user.password ? (data.password && data.password.trim() !== "" ? passwordHash : user.password) : passwordHash,
          },
        });
      }
      userId = user.id;
    }

    const lider = await prisma.leader.create({
      data: {
        name: data.name,
        user_id: userId,
        password: passwordHash,
        role: data.role || "Líder",
      },
      include: {
        user: true,
      },
    });

    revalidatePath("/dashboard/lideres");
    return { success: true, data: lider };
  } catch (error) {
    console.error("Error creating lider:", error);
    return { success: false, error: "Falha ao criar líder" };
  }
}

export async function updateLider(
  id: string,
  data: {
    name: string;
    email?: string;
    role?: string;
    password?: string;
  },
) {
  try {
    const leader = await prisma.leader.findUnique({ where: { id } });
    if (!leader) throw new Error("Líder não encontrado");

    let userId = leader.user_id;
    let passwordHash = leader.password || await bcrypt.hash("lider123", 10);

    if (data.password && data.password.trim() !== "") {
      passwordHash = await bcrypt.hash(data.password, 10);
    }

    if (data.email) {
      // Verifica se o email pertence a outro usuário
      let user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (user) {
        userId = user.id;
        const userUpdateData: any = {
          name: data.name,
          role:
            data.role === "Líder" ||
            data.role === "Co-líder" ||
            data.role === "Apoio" ||
            data.role === "Pastor"
              ? "leader"
              : data.role || "leader",
        };
        // Se forneceu uma senha nova ou se o usuário não tem senha
        if (data.password && data.password.trim() !== "") {
          userUpdateData.password = passwordHash;
        } else if (!user.password) {
          userUpdateData.password = passwordHash;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: userUpdateData,
        });
      } else {
        const passwordToUse = data.password && data.password.trim() !== ""
          ? passwordHash
          : leader.password || (await bcrypt.hash("lider123", 10));
        user = await prisma.user.create({
          data: {
            name: data.name,
            email: data.email,
            role:
              data.role === "Líder" ||
              data.role === "Co-líder" ||
              data.role === "Apoio" ||
              data.role === "Pastor"
                ? "leader"
                : data.role || "leader",
            password: passwordToUse,
          },
        });
        userId = user.id;
      }
    }

    const updated = await prisma.leader.update({
      where: { id },
      data: {
        name: data.name,
        user_id: userId,
        role: data.role || "Líder",
        password: passwordHash,
      },
      include: {
        user: true,
      },
    });

    revalidatePath("/dashboard/lideres");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating lider:", error);
    return { success: false, error: "Falha ao atualizar líder" };
  }
}

export async function deleteLider(id: string) {
  try {
    await prisma.leader.delete({
      where: { id },
    });
    revalidatePath("/dashboard/lideres");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lider:", error);
    return { success: false, error: "Falha ao excluir líder" };
  }
}
