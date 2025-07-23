import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: {
    category?: string;
    priceRange?: string;
    sortBy?: string;
    status?: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  categories?: string[];
  showPriceFilter?: boolean;
  showStatusFilter?: boolean;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  onFilterChange,
  onClearFilters,
  categories = [],
  showPriceFilter = false,
  showStatusFilter = false,
}) => {
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      {/* Поиск */}
      <div className="relative">
        <Icon
          name="Search"
          className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
        />
        <Input
          placeholder="Поиск..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-2">
        {/* Категория */}
        {categories.length > 0 && (
          <Select
            value={filters.category || ""}
            onValueChange={(value) => onFilterChange("category", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все категории</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Цена */}
        {showPriceFilter && (
          <Select
            value={filters.priceRange || ""}
            onValueChange={(value) => onFilterChange("priceRange", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Цена" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Любая цена</SelectItem>
              <SelectItem value="0-1000">До 1,000 ₽</SelectItem>
              <SelectItem value="1000-5000">1,000 - 5,000 ₽</SelectItem>
              <SelectItem value="5000-10000">5,000 - 10,000 ₽</SelectItem>
              <SelectItem value="10000+">От 10,000 ₽</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Статус */}
        {showStatusFilter && (
          <Select
            value={filters.status || ""}
            onValueChange={(value) => onFilterChange("status", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все статусы</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="inactive">Неактивные</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Сортировка */}
        <Select
          value={filters.sortBy || ""}
          onValueChange={(value) => onFilterChange("sortBy", value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Сначала новые</SelectItem>
            <SelectItem value="date-asc">Сначала старые</SelectItem>
            <SelectItem value="name-asc">По названию А-Я</SelectItem>
            <SelectItem value="name-desc">По названию Я-А</SelectItem>
            {showPriceFilter && (
              <>
                <SelectItem value="price-asc">По цене ↑</SelectItem>
                <SelectItem value="price-desc">По цене ↓</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>

        {/* Кнопка очистки */}
        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <Icon name="X" className="h-4 w-4 mr-1" />
            Очистить ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Активные фильтры */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) =>
            value ? (
              <Badge key={key} variant="secondary" className="cursor-pointer">
                {key === "category" && `Категория: ${value}`}
                {key === "priceRange" && `Цена: ${value}`}
                {key === "status" && `Статус: ${value}`}
                {key === "sortBy" && `Сортировка: ${value}`}
                <Icon
                  name="X"
                  className="h-3 w-3 ml-1"
                  onClick={() => onFilterChange(key, "")}
                />
              </Badge>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
