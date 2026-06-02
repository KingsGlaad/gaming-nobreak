import { NextRequest, NextResponse } from "next/server";
import { getLideres, createLider } from "@/lib/services/lideres";

export async function GET() {
  const lideres = await getLideres();
  return NextResponse.json(lideres);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await createLider(data);
    
    if (result.success) {
      return NextResponse.json(result.data, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
