import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface ClassifiedFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  categories: string[];
  filters: {
    priceRange: string;
    condition: string;
    priceType: string;
    sortBy: string;
    location: string;
  };
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const ClassifiedFilters: React.FC<ClassifiedFiltersProps> = ({
  searchTerm,
  selectedCategory,
  categories,
  filters,
  onSearchChange,
  onCategoryChange,
  onFilterChange,
  onClearFilters,
}) => {
  const activeFiltersCount = [
    filters.priceRange,
    filters.condition,
    filters.priceType,
    selectedCategory,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Доска объявлений</h1>
        <Button className="bg-accent hover:bg-accent/90 text-white">
          <Icon name="Plus" className="h-5 w-5 mr-2" />
          Разместить объявление
        </Button>
      </div>

      <div className="relative">
        <Icon
          name="Search"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400"
        />
        <Input
          type="text"
          placeholder="Поиск по названию или описанию..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[200px] bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="">Все категории</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.condition}
          onValueChange={(val) => onFilterChange("condition", val)}
        >
          <SelectTrigger className="w-[160px] bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder="Состояние" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="">Любое</SelectItem>
            <SelectItem value="new">Новое</SelectItem>
            <SelectItem value="used">Б/У</SelectItem>
            <SelectItem value="broken">На запчасти</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priceType}
          onValueChange={(val) => onFilterChange("priceType", val)}
        >
          <SelectTrigger className="w-[160px] bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder="Тип цены" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="">Все</SelectItem>
            <SelectItem value="fixed">Фиксированная</SelectItem>
            <SelectItem value="negotiable">Договорная</SelectItem>
            <SelectItem value="free">Бесплатно</SelectItem>
            <SelectItem value="exchange">Обмен</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priceRange}
          onValueChange={(val) => onFilterChange("priceRange", val)}
        >
          <SelectTrigger className="w-[200px] bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder="Диапазон цен" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="">Любая цена</SelectItem>
            <SelectItem value="0-50000">До 50 000 ₽</SelectItem>
            <SelectItem value="50000-100000">50 000 - 100 000 ₽</SelectItem>
            <SelectItem value="100000-300000">
              100 000 - 300 000 ₽
            </SelectItem>
            <SelectItem value="300000-500000">
              300 000 - 500 000 ₽
            </SelectItem>
            <SelectItem value="500000+">500 000+ ₽</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy}
          onValueChange={(val) => onFilterChange("sortBy", val)}
        >
          <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="newest">Сначала новые</SelectItem>
            <SelectItem value="oldest">Сначала старые</SelectItem>
            <SelectItem value="price-asc">Дешевле</SelectItem>
            <SelectItem value="price-desc">Дороже</SelectItem>
            <SelectItem value="popular">Популярные</SelectItem>
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-accent border-accent">
              Фильтров: {activeFiltersCount}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-zinc-400 hover:text-white"
            >
              <Icon name="X" className="h-4 w-4 mr-1" />
              Сбросить
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassifiedFilters;
