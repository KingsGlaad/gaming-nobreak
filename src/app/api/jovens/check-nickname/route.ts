/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const nickname = searchParams.get("nickname");
    const ignoreId = searchParams.get("ignoreId");

    if (!nickname) {
      return NextResponse.json({ exists: false });
    }

    const whereClause: any = {
      nickname: {
        equals: nickname,
        mode: "insensitive",
      },
    };

    if (ignoreId) {
      whereClause.id = { not: ignoreId };
    }

    const existing = await prisma.youth.findFirst({
      where: whereClause,
      select: { id: true },
    });

    return NextResponse.json({ exists: !!existing });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
