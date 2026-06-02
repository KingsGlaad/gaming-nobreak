import { NextRequest, NextResponse } from "next/server";
import { getTemporadas, createTemporada } from "@/lib/services/temporadas";

export async function GET() {
  const temporadas = await getTemporadas();
  return NextResponse.json(temporadas);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await createTemporada(data);
    
    if (result.success) {
      return NextResponse.json(result.data, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
