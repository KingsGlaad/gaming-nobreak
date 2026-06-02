import { NextResponse } from "next/server";
import { getTiposAtividade } from "@/lib/services/atividades";

export async function GET() {
  try {
    const tipos = await getTiposAtividade();
    return NextResponse.json(tipos);
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
