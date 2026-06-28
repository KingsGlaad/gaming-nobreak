import { NextRequest, NextResponse } from "next/server";
import { getVisitantes, createVisitante } from "@/lib/services/visitantes";

export async function GET() {
  try {
    const data = await getVisitantes();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await createVisitante(data);
    
    if (result.success) {
      return NextResponse.json(result.data, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
