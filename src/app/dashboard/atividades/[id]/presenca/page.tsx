import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PresencaClient } from "./presenca-client";

export default async function PresencaPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const activity = await prisma.activity.findUnique({
    where: { id: params.id },
    include: { activity_type: true },
  });

  if (!activity) {
    notFound();
  }

  // Get active season
  const activeSeason = await prisma.season.findFirst({
    where: { is_active: true },
  });

  // Get youths
  const youths = await prisma.youth.findMany({
    where: { status: "active" },
    orderBy: { name: "asc" },
  });

  // Get existing attendances
  const attendances = await prisma.attendance.findMany({
    where: { activity_id: params.id },
    select: { youth_id: true, status: true },
  });

  const attendanceMap = attendances.reduce(
    (acc, curr) => {
      acc[curr.youth_id] = curr.status === "present";
      return acc;
    },
    {} as Record<string, boolean>,
  );

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/atividades">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Lista de Presença: {activity.title}
          </h1>
          <p className="text-muted-foreground">
            {activity.activity_type?.name || "Sem tipo"} •{" "}
            {new Date(activity.activity_date).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <PresencaClient
          activityId={activity.id}
          youths={youths}
          initialAttendances={attendanceMap}
        />
      </div>
    </div>
  );
}
