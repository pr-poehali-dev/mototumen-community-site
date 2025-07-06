import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { StoreFilters as StoreFiltersType } from "@/types/store";

interface StoreFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: StoreFiltersType;
  handleFilterChange: (key: string, value: string) => void;
  clearFilters: () => void;
  categories: string[];
  locations: string[];
}

const StoreFilters: React.FC<StoreFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  handleFilterChange,
  clearFilters,
  categories,
  locations,
}) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-sm sm:text-base md:text-lg text-card-foreground">
          Фильтры
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="relative">
          <Icon
            name="Search"
            className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Поиск магазинов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border rounded-md bg-input text-foreground border-border focus:border-accent focus:ring-1 focus:ring-accent text-xs sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-card-foreground">
            Категория
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="w-full px-2 sm:px-3 py-2 border rounded-md bg-input text-foreground border-border focus:border-accent focus:ring-1 focus:ring-accent text-xs sm:text-sm"
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-card-foreground">
            Местоположение
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full px-2 sm:px-3 py-2 border rounded-md bg-input text-foreground border-border focus:border-accent focus:ring-1 focus:ring-accent text-xs sm:text-sm"
          >
            <option value="">Все города</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-card-foreground">
            Рейтинг
          </label>
          <select
            value={filters.rating}
            onChange={(e) => handleFilterChange("rating", e.target.value)}
            className="w-full px-2 sm:px-3 py-2 border rounded-md bg-input text-foreground border-border focus:border-accent focus:ring-1 focus:ring-accent text-xs sm:text-sm"
          >
            <option value="">Любой рейтинг</option>
            <option value="4.5">4.5+ звезд</option>
            <option value="4.0">4.0+ звезд</option>
            <option value="3.5">3.5+ звезд</option>
            <option value="3.0">3.0+ звезд</option>
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-card-foreground">
            Сортировка
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="w-full px-2 sm:px-3 py-2 border rounded-md bg-input text-foreground border-border focus:border-accent focus:ring-1 focus:ring-accent text-xs sm:text-sm"
          >
            <option value="rating">По рейтингу</option>
            <option value="popular">По популярности</option>
            <option value="newest">Сначала новые</option>
            <option value="name">По алфавиту</option>
          </select>
        </div>

        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full text-xs sm:text-sm"
        >
          <Icon name="RotateCcw" className="h-4 w-4 mr-2" />
          Сбросить фильтры
        </Button>
      </CardContent>
    </Card>
  );
};

export default StoreFilters;
