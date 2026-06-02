import { NextRequest, NextResponse } from "next/server";
import { getRegras, createRegra } from "@/lib/services/regras";

export async function GET() {
  const regras = await getRegras();
  return NextResponse.json(regras);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await createRegra(data);
    
    if (result.success) {
      return NextResponse.json(result.data, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
