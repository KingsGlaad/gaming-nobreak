import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateYouthAchievements } from "@/lib/services/pontos";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const activityId = params.id;
    const body = await req.json();
    const { youth_id, present } = body;

    if (!youth_id) {
      return NextResponse.json({ error: "youth_id é obrigatório" }, { status: 400 });
    }

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      return NextResponse.json({ error: "Atividade não encontrada" }, { status: 404 });
    }

    if (present) {
      // Upsert attendance
      await prisma.attendance.upsert({
        where: {
          activity_id_youth_id: {
            activity_id: activityId,
            youth_id: youth_id,
          },
        },
        update: {
          status: "present",
        },
        create: {
          activity_id: activityId,
          youth_id: youth_id,
          season_id: activity.season_id,
          status: "present",
        },
      });
    } else {
      // Delete attendance
      await prisma.attendance.deleteMany({
        where: {
          activity_id: activityId,
          youth_id: youth_id,
        },
      });
    }

    // Call achievements update
    if (activity.season_id) {
      await updateYouthAchievements(youth_id, activity.season_id);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
