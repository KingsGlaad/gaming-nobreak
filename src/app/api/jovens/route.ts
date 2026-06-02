import { NextRequest, NextResponse } from "next/server";
import { getJovens, createJovem } from "@/lib/services/jovens";

export async function GET() {
  const jovens = await getJovens();
  return NextResponse.json(jovens);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await createJovem(data);
    
    if (result.success) {
      return NextResponse.json(result.data, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
