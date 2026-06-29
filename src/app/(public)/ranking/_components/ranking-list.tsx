"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Search, Trophy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { UserAvatar } from "@/components/shared/user-avatar";

interface RankingItem {
  id: string;
  name: string;
  nickname: string;
  points: number;
  level: string;
  photo_url: string | null;
}

interface RankingListProps {
  initialRanking: RankingItem[];
}

// Input de busca memoizado para evitar re-renderizações desnecessárias
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput = React.memo(({ value, onChange }: SearchInputProps) => {
  return (
    <div className="relative w-full md:w-80">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Buscar jovem por nome ou apelido..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 bg-background/30 border-border/50 focus-visible:ring-primary/20"
      />
    </div>
  );
});

SearchInput.displayName = "SearchInput";

export function RankingList({ initialRanking }: RankingListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Handler de mudança memoizado com useCallback
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Adicionar o rank original a cada item antes de filtrar
  const rankedItems = useMemo(() => {
    let currentRank = 0;
    let previousPoints = -1;
    const result = [];

    for (const item of initialRanking) {
      if (item.points !== previousPoints) {
        currentRank++;
        previousPoints = item.points;
      }
      result.push({
        ...item,
        rank: currentRank,
      });
    }

    return result;
  }, [initialRanking]);

  // Filtrar e limitar os itens com useMemo
  const filteredRanking = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();

    // Se não houver busca, mostrar apenas os 10 primeiros
    if (!lowerSearch) {
      return rankedItems.slice(0, 10);
    }

    // Se houver busca, filtrar correspondências por nome ou apelido
    const filtered = rankedItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item.nickname.toLowerCase().includes(lowerSearch),
    );

    // Limitar também a busca aos 10 primeiros resultados correspondentes
    return filtered.slice(0, 10);
  }, [rankedItems, searchTerm]);

  // Lista de todos os jovens, ordenada alfabeticamente
  const alphabeticalRanking = useMemo(() => {
    return [...rankedItems].sort((a, b) => a.name.localeCompare(b.name));
  }, [rankedItems]);

  const filteredAlphabetical = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();
    if (!lowerSearch) return alphabeticalRanking;

    return alphabeticalRanking.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item.nickname.toLowerCase().includes(lowerSearch),
    );
  }, [alphabeticalRanking, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Ranking Geral
            </h1>
            <p className="text-muted-foreground">
              Classificação atualizada da temporada em andamento.
            </p>
          </div>
        </div>
        <SearchInput value={searchTerm} onChange={handleSearchChange} />
      </div>

      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle>
            {searchTerm ? "Resultados da Busca" : "Top 10 Jovens"}
          </CardTitle>
          <CardDescription>
            {searchTerm
              ? `Exibindo resultados para "${searchTerm}"`
              : "Os 10 jovens com maior destaque nas atividades e eventos."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRanking.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum jovem encontrado com o termo pesquisado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[80px] text-center">
                    Posição
                  </TableHead>
                  <TableHead>Jovem</TableHead>
                  <TableHead className="hidden md:table-cell">Nível</TableHead>
                  <TableHead className="text-right">Pontos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRanking.map((youth) => (
                  <TableRow
                    key={youth.id}
                    className="group hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <TableCell className="text-center font-bold">
                      {youth.rank === 1 && (
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-yellow-500/20 text-yellow-500">
                          {youth.rank}
                        </span>
                      )}
                      {youth.rank === 2 && (
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-400/20 text-gray-400">
                          {youth.rank}
                        </span>
                      )}
                      {youth.rank === 3 && (
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-600/20 text-amber-600">
                          {youth.rank}
                        </span>
                      )}
                      {youth.rank > 3 && (
                        <span className="text-muted-foreground">
                          {youth.rank}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/jovem/${youth.nickname || youth.id}`}
                        className="flex items-center gap-3 group-hover:text-primary transition-colors"
                      >
                        <UserAvatar 
                          name={youth.name} 
                          photo_url={youth.photo_url} 
                          className="h-10 w-10 border border-primary/20"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold">{youth.name}</span>
                          {youth.nickname && (
                            <span className="text-xs text-muted-foreground">
                              {youth.nickname}
                            </span>
                          )}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {youth.level}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      {youth.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/40 backdrop-blur-sm mt-12">
        <CardHeader className="pb-4">
          <CardTitle>Todos os Participantes</CardTitle>
          <CardDescription>Lista completa de participantes.</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAlphabetical.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum participante encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pt-4">
              {filteredAlphabetical.map((youth) => {
                let borderClass =
                  "border-amber-700 shadow-[0_0_15px_rgba(180,83,9,0.3)]";
                let textClass = "text-amber-700";
                const lvl = youth.level.toLowerCase();

                if (lvl === "diamante") {
                  borderClass =
                    "border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]";
                  textClass = "text-cyan-400";
                } else if (lvl === "ouro") {
                  borderClass =
                    "border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]";
                  textClass = "text-yellow-400";
                } else if (lvl === "prata") {
                  borderClass =
                    "border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.4)]";
                  textClass = "text-slate-300";
                }

                return (
                  <Link
                    href={`/jovem/${youth.nickname || youth.id}`}
                    key={youth.id}
                  >
                    <div
                      className={`relative flex flex-col items-center p-3 transition-transform hover:-translate-y-1 hover:scale-105 cursor-pointer`}
                    >
                      {/* Badge de Posição (Rank Global) */}
                      <div className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center rounded-full bg-background border border-primary text-primary font-bold text-xs shadow-md z-10">
                        #{youth.rank}
                      </div>

                      {/* Avatar */}
                      <div
                        className={`mb-2 flex items-center justify-center rounded-full p-0.5 ${borderClass}`}
                      >
                        <UserAvatar 
                          name={youth.name} 
                          photo_url={youth.photo_url} 
                          className="h-16 w-16"
                        />
                      </div>

                      {/* Info */}
                      <h3 className="font-bold text-sm text-center leading-tight line-clamp-1 w-full">
                        {youth.name}
                      </h3>
                      {youth.nickname && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {youth.nickname}
                        </p>
                      )}

                      <div className="mt-2 flex flex-col items-center gap-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-background/50 border ${borderClass} ${textClass}`}
                        >
                          {youth.level}
                        </span>
                        <div className="font-black text-lg text-foreground mt-1">
                          {youth.points}{" "}
                          <span className="text-xs font-medium text-muted-foreground">
                            pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
