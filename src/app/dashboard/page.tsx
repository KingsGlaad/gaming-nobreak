import { SectionCards } from "@/components/layout/section-cards"
import { ChartAreaInteractive } from "@/components/layout/chart-area-interactive"
import { DataTable } from "@/components/layout/data-table"
import { columns } from "./_components/dashboard-columns"
import { Metadata } from "next"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertTriangleIcon, TrophyIcon, ListIcon } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Painel Principal | Dashboard Gaming Nobreak",
  description: "Visão geral e estatísticas de atividades, jovens e engajamento da temporada.",
}

export default async function Page() {
  // 1. Total de Jovens Ativos
  const totalJovens = await prisma.youth.count({
    where: { status: "active" },
  })

  // 2. Líderes Ativos
  const lideresAtivos = await prisma.leader.count()

  // 3. Atividades no Mês Atual
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  const atividadesMes = await prisma.activity.count({
    where: {
      activity_date: {
        gte: startOfMonth,
      },
    },
  })

  // 4. Temporada Atual
  const temporadaAtual = await prisma.season.findFirst({
    where: { is_active: true },
  })

  // 5. Atividades Recentes
  const recentActivitiesDb = await prisma.activity.findMany({
    orderBy: { activity_date: 'desc' },
    take: 10,
    include: {
      activity_type: true,
      creator: true,
      score_transactions: true,
    }
  })

  const atividadesRecentes = recentActivitiesDb.map(act => {
    let status = "Agendada"
    const agora = new Date()
    if (act.activity_date < agora) {
      status = "Concluída"
    }

    const pontos = act.score_transactions.reduce((acc, t) => acc + t.points, 0)

    return {
      id: act.id,
      nome: act.title,
      tipo: act.activity_type?.name || "Geral",
      status,
      pontos,
      responsavel: act.creator?.name || "Atribuir líder",
    }
  })

  // 6. Dados do Gráfico de Frequência (últimos 90 dias para bater com o ToggleGroup)
  const daysAgo = new Date()
  daysAgo.setDate(daysAgo.getDate() - 90)
  daysAgo.setHours(0, 0, 0, 0)

  const attendances = await prisma.attendance.findMany({
    where: { created_at: { gte: daysAgo } },
    select: { created_at: true }
  })
  
  const visitors = await prisma.visitor.findMany({
    where: { visit_date: { gte: daysAgo } },
    select: { visit_date: true }
  })

  const dateMap: Record<string, { desktop: number, mobile: number }> = {}
  
  for(let i = 90; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    dateMap[key] = { desktop: 0, mobile: 0 }
  }

  attendances.forEach(a => {
    const key = a.created_at.toISOString().split('T')[0]
    if (dateMap[key]) dateMap[key].desktop += 1
  })

  visitors.forEach(v => {
    const key = v.visit_date.toISOString().split('T')[0]
    if (dateMap[key]) dateMap[key].mobile += 1
  })

  const chartData = Object.entries(dateMap).map(([date, counts]) => ({
    date,
    desktop: counts.desktop,
    mobile: counts.mobile
  }))

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards 
        totalJovens={totalJovens} 
        lideresAtivos={lideresAtivos} 
        atividadesMes={atividadesMes} 
        temporadaAtual={temporadaAtual?.name || "Nenhuma"} 
      />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive chartData={chartData} />
      </div>

      <Tabs
        defaultValue="overview"
        className="w-full flex-col justify-start gap-6 px-0"
      >
        <div className="flex items-center justify-between px-4 lg:px-6 mb-4">
          <Label htmlFor="view-selector" className="sr-only">
            Visão
          </Label>
          <Select defaultValue="overview">
            <SelectTrigger
              className="flex w-fit @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Selecione uma visão" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="overview">Visão Geral</SelectItem>
                <SelectItem value="activities">Atividades Recentes</SelectItem>
                <SelectItem value="ranking">Ranking Liderança</SelectItem>
                <SelectItem value="rules">Avisos/Regras</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
            <TabsTrigger value="overview">
               Visão Geral
            </TabsTrigger>
            <TabsTrigger value="activities">
              Atividades Recentes <Badge variant="secondary">{atividadesRecentes.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="ranking">
              Ranking Liderança <Badge variant="secondary">Top 3</Badge>
            </TabsTrigger>
            <TabsTrigger value="rules">
               Avisos/Regras
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="overview"
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          <DataTable
            columns={columns}
            data={atividadesRecentes}
            searchKey="nome"
            searchPlaceholder="Buscar atividade..."
          />
        </TabsContent>
        <TabsContent
          value="activities"
          className="flex flex-col px-4 lg:px-6"
        >
          <div className="flex flex-col gap-4 p-8 items-center justify-center aspect-video w-full flex-1 rounded-lg border border-dashed">
             <ListIcon className="size-8 text-muted-foreground" />
             <p className="text-muted-foreground">Listagem expandida de atividades em breve.</p>
          </div>
        </TabsContent>
        <TabsContent value="ranking" className="flex flex-col px-4 lg:px-6">
          <div className="flex flex-col gap-4 p-8 items-center justify-center aspect-video w-full flex-1 rounded-lg border border-dashed">
             <TrophyIcon className="size-8 text-muted-foreground" />
             <p className="text-muted-foreground">O ranking de líderes e equipes será exibido aqui.</p>
          </div>
        </TabsContent>
        <TabsContent
          value="rules"
          className="flex flex-col px-4 lg:px-6"
        >
          <div className="flex flex-col gap-4 p-8 items-center justify-center aspect-video w-full flex-1 rounded-lg border border-dashed">
             <AlertTriangleIcon className="size-8 text-muted-foreground" />
             <p className="text-muted-foreground">Novas regras e avisos importantes.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
