# NOBREAK MANAGER - PRD COMPLETO

## Visão Geral

Sistema web de gerenciamento da juventude Nobreak com:

- Gamificação
- Ranking em tempo real
- Controle de presença
- Gestão de visitantes
- Gestão de temporadas
- Conquistas e níveis
- Portal público para jovens
- Painel para líderes e administradores

## Stack Tecnológica

### Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- Shadcn/UI
- React Hook Form
- Zod
- TanStack Query

### Backend

- Prisma
- PostgreSQL
- NextAuth
- Storage
- Realtime
- Edge Functions

### Deploy

- Vercel

---

# Perfis

## Administrador

- Gerenciar temporadas
- Gerenciar líderes
- Gerenciar jovens
- Gerenciar visitantes
- Gerenciar regras de pontuação
- Gerenciar conquistas
- Relatórios

## Líder

- Registrar presença
- Registrar visitantes
- Lançar pontuações
- Criar atividades
- Visualizar ranking

## Jovem

- Visualizar perfil
- Ranking
- Histórico
- Conquistas
- Calendário

---

# Regras de Negócio

## Temporadas

Uma única temporada ativa por vez.

Exemplos:

- Nobreak 2026
- Nobreak 2027

Toda movimentação pertence a uma temporada.

---

## Sistema de Pontos

Nenhuma pontuação será fixa no código.

Todas as regras ficam na tabela point_rules.

Toda pontuação gera uma transação.

Nunca armazenar saldo final.

Saldo = soma(score_transactions.points)

---

# Banco de Dados

// ============================================================
// SEASONS (Temporadas)
// ============================================================
model Season {
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
name String @db.VarChar(100)
description String?
start_date DateTime @db.Date
end_date DateTime @db.Date
is_active Boolean @default(false)
created_at DateTime @default(now()) @db.Timestamptz()
updated_at DateTime @default(now()) @db.Timestamptz()

// Relations
activities Activity[]
point_rules PointRule[]
score_transactions ScoreTransaction[]
youth_achievements YouthAchievement[]
attendance Attendance[]

@@map("seasons")
}

// ============================================================
// USERS (Usuários autenticados)
// ============================================================
model User {
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
email String? @unique @db.VarChar(255)
password String? @db.VarChar(255)
role String @default("youth") @db.VarChar(30)
created_at DateTime @default(now()) @db.Timestamptz()

// Relations
leaders Leader[]
activities Activity[]

@@map("users")
}

// ============================================================
// YOUTHS (Jovens)
// ============================================================
model Youth {
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
name String @db.VarChar(255)
nickname String? @db.VarChar(100)
birth_date DateTime? @db.Date
phone String? @db.VarChar(30)
instagram String? @db.VarChar(100)
baptized Boolean @default(false)
photo_url String?
status String @default("active") @db.VarChar(20)
created_at DateTime @default(now()) @db.Timestamptz()
updated_at DateTime @default(now()) @db.Timestamptz()

// Relations
score_transactions ScoreTransaction[]
youth_achievements YouthAchievement[]
attendance Attendance[]
visitors_responsible Visitor[] @relation("ResponsibleYouth")
visitors_converted Visitor[] @relation("ConvertedYouth")

@@map("youths")
}

// ============================================================
// LEADERS (Líderes)
// ============================================================
model Leader {
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
user_id String? @db.Uuid
name String @db.VarChar(255)
created_at DateTime @default(now()) @db.Timestamptz()

// Relations
user User? @relation(fields: [user_id], references: [id], onDelete: SetNull)
score_transactions ScoreTransaction[]

@@map("leaders")
}

// ============================================================
// VISITORS (Visitantes)
// ============================================================
model Visitor {
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
name String @db.VarChar(255)
phone String? @db.VarChar(30)
instagram String? @db.VarChar(100)
responsible_youth_id String? @db.Uuid
visit_date DateTime @default(now()) @db.Date
notes String?
converted_to_youth Boolean @default(false)
converted_youth_id String? @db.Uuid
created_at DateTime @default(now()) @db.Timestamptz()

// Relations
responsible_youth Youth? @relation("ResponsibleYouth", fields: [responsible_youth_id], references: [id], onDelete: SetNull)
converted_youth Youth? @relation("ConvertedYouth", fields: [converted_youth_id], references: [id], onDelete: SetNull)

@@map("visitors")
}

// ============================================================
// ACTIVITY TYPES (Tipos de Atividade)
// ============================================================
model ActivityType {
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
name String @db.VarChar(255)
slug String @unique @db.VarChar(100)
description String?

// Relations
activities Activity[]

@@map("activity_types")
}

// ============================================================
// ACTIVITIES (Atividades)
// ============================================================
model Activity {
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
season_id String? @db.Uuid
activity_type_id String? @db.Uuid
title String @db.VarChar(255)
description String?
activity_date DateTime @db.Timestamptz()
created_by String? @db.Uuid
created_at DateTime @default(now()) @db.Timestamptz()

// Relations
season Season? @relation(fields: [season_id], references: [id], onDelete: Cascade)
activity_type ActivityType? @relation(fields: [activity_type_id], references: [id], onDelete: SetNull)
creator User? @relation(fields: [created_by], references: [id], onDelete: SetNull)
attendance Attendance[]
score_transactions ScoreTransaction[]

@@map("activities")
}

// ============================================================
// ATTENDANCE (Presença)
// ============================================================
model Attendance {
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
season_id String? @db.Uuid
activity_id String @db.Uuid
youth_id String @db.Uuid
status String @default("present") @db.VarChar(20)
created_at DateTime @default(now()) @db.Timestamptz()

// Relations
season Season? @relation(fields: [season_id], references: [id], onDelete: Cascade)
activity Activity @relation(fields: [activity_id], references: [id], onDelete: Cascade)
youth Youth @relation(fields: [youth_id], references: [id], onDelete: Cascade)

@@unique([activity_id, youth_id])
@@map("attendance")
}

// ============================================================
// POINT RULES (Regras de Pontuação)
// ============================================================
model PointRule {
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
season_id String? @db.Uuid
name String @db.VarChar(255)
slug String @unique @db.VarChar(100)
description String?
points Int
category String? @db.VarChar(100)
is_active Boolean @default(true)
created_at DateTime @default(now()) @db.Timestamptz()
updated_at DateTime @default(now()) @db.Timestamptz()

// Relations
season Season? @relation(fields: [season_id], references: [id], onDelete: Cascade)
score_transactions ScoreTransaction[]

@@map("point_rules")
}

// ============================================================
// SCORE TRANSACTIONS (Transações de Pontos)
// ============================================================
model ScoreTransaction {
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
season_id String? @db.Uuid
youth_id String @db.Uuid
activity_id String? @db.Uuid
point_rule_id String? @db.Uuid
leader_id String? @db.Uuid
points Int
description String?
created_at DateTime @default(now()) @db.Timestamptz()

// Relations
season Season? @relation(fields: [season_id], references: [id], onDelete: Cascade)
youth Youth @relation(fields: [youth_id], references: [id], onDelete: Cascade)
activity Activity? @relation(fields: [activity_id], references: [id], onDelete: SetNull)
point_rule PointRule? @relation(fields: [point_rule_id], references: [id], onDelete: SetNull)
leader Leader? @relation(fields: [leader_id], references: [id], onDelete: SetNull)

@@map("score_transactions")
}

// ============================================================
// ACHIEVEMENTS (Conquistas)
// ============================================================
model Achievement {
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
name String @db.VarChar(255)
description String?
icon String? @db.VarChar(255)
condition_type String @db.VarChar(100)
condition_value Int

// Relations
youth_achievements YouthAchievement[]

@@map("achievements")
}

// ============================================================
// YOUTH ACHIEVEMENTS (Conquistas dos Jovens)
// ============================================================
model YouthAchievement {
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
season_id String @db.Uuid
youth_id String @db.Uuid
achievement_id String @db.Uuid
created_at DateTime @default(now()) @db.Timestamptz()

// Relations
season Season @relation(fields: [season_id], references: [id], onDelete: Cascade)
youth Youth @relation(fields: [youth_id], references: [id], onDelete: Cascade)
achievement Achievement @relation(fields: [achievement_id], references: [id], onDelete: Cascade)

@@unique([season_id, youth_id, achievement_id])
@@map("youth_achievements")
}

// ============================================================
// LEVELS (Níveis)
// ============================================================
model Level {
id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
name String @db.VarChar(100)
min_points Int
max_points Int?
icon String? @db.VarChar(255)
order_index Int

@@map("levels")
}

# Regras Iniciais (Seeds)

## Níveis

Bronze: 0-499
Prata: 500-999
Ouro: 1000-1499
Diamante: 1500+

## Point Rules

atividade_grupal_participacao = 20
atividade_grupal_destaque = 20
discipulado = 20
celula = 20
nobreak_recepcao = 30
nobreak_saudacao = 30
nobreak_oferta = 30
nobreak_abertura = 40
nobreak_louvor = 50
nobreak_ministracao = 100
visitante_primeira_visita = 50
visitante_retorno = 50
visitante_convertido = 100
dupla_leitura = 20
video_destaque = 50
clube_livro = 20
bonus_atitude = 20

---

# Telas

## Login

## Dashboard Admin

- Total jovens
- Total visitantes
- Ranking Top 10
- Próximos eventos
- Aniversariantes

## Jovens

- Listagem
- Cadastro
- Edição
- Perfil

## Visitantes

- Cadastro
- Conversão para jovem

## Atividades

- Calendário
- Cadastro
- Participantes

## Ranking

- Geral
- Mensal
- Categoria

## Perfil do Jovem

- Foto
- Nickname
- Nível
- Histórico
- Conquistas

---

# Estrutura de Pastas

```txt
src/
 ├─ app/
 ├─ components/
 ├─ features/
 │   ├─ youths/
 │   ├─ visitors/
 │   ├─ activities/
 │   ├─ rankings/
 │   ├─ seasons/
 │   └─ achievements/
 ├─ services/
 ├─ hooks/
 ├─ types/
 ├─ lib/
 └─ supabase/
```

---

# Roadmap

## MVP

- Login
- Jovens
- Visitantes
- Ranking
- Pontuação
- Temporadas

## V1

- Conquistas
- Níveis
- Calendário
- Hall da Fama

## V2

- WhatsApp
- QR Code
- Relatórios
- Equipes
- Multi-ministério

---

# Objetivo Final

Criar uma plataforma moderna de acompanhamento e gamificação da juventude Nobreak, incentivando participação, discipulado, evangelismo e crescimento espiritual através de rankings, conquistas e recompensas.
