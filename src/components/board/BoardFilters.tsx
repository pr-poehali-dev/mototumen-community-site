import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Icon from "@/components/ui/icon";

interface BoardFiltersProps {
  filters: {
    category: string;
    priceRange: string;
    sortBy: string;
    status: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  categories: string[];
}

export default function BoardFilters({
  filters,
  onFilterChange,
  onClearFilters,
  categories,
}: BoardFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все категории</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.priceRange}
            onValueChange={(value) => onFilterChange("priceRange", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Цена" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Любая цена</SelectItem>
              <SelectItem value="0-1000">До 1000 ₽</SelectItem>
              <SelectItem value="1000-5000">1000-5000 ₽</SelectItem>
              <SelectItem value="5000-10000">5000-10000 ₽</SelectItem>
              <SelectItem value="10000+">Более 10000 ₽</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy}
            onValueChange={(value) => onFilterChange("sortBy", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Сначала новые</SelectItem>
              <SelectItem value="date-asc">Сначала старые</SelectItem>
              <SelectItem value="price-asc">Цена (возрастание)</SelectItem>
              <SelectItem value="price-desc">Цена (убывание)</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все статусы</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="closed">Закрытые</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClearFilters}>
            <Icon name="X" className="h-4 w-4 mr-2" />
            Сбросить фильтры
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
