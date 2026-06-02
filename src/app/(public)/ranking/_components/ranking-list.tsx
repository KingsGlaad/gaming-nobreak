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
    return initialRanking.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
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
                        className="flex flex-col group-hover:text-primary transition-colors"
                      >
                        <span className="font-semibold">{youth.name}</span>
                        {youth.nickname && (
                          <span className="text-xs text-muted-foreground">
                            {youth.nickname}
                          </span>
                        )}
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
    </div>
  );
}
