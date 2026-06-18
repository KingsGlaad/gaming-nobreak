import { NextRequest, NextResponse } from "next/server"
import { deleteAchievement } from "@/lib/services/conquistas"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!id) {
    return NextResponse.json({ success: false, error: "ID inválido" }, { status: 400 })
  }

  const result = await deleteAchievement(id)
  
  if (result.success) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 })
  }
}
