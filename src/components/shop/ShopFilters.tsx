import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { ShopFilters as ShopFiltersType } from "@/types/product";

interface ShopFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filters: ShopFiltersType;
  handleFilterChange: (key: string, value: string) => void;
  clearFilters: () => void;
  categories: string[];
}

const ShopFilters: React.FC<ShopFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  filters,
  handleFilterChange,
  clearFilters,
  categories,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Фильтры</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Icon
            name="Search"
            className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Категория</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
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
          <label className="block text-sm font-medium mb-2">Цена</label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange("priceRange", e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            <option value="">Любая цена</option>
            <option value="0-5000">До 5 000 ₽</option>
            <option value="5000-15000">5 000 - 15 000 ₽</option>
            <option value="15000-30000">15 000 - 30 000 ₽</option>
            <option value="30000-50000">30 000 - 50 000 ₽</option>
            <option value="50000+">От 50 000 ₽</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Состояние</label>
          <select
            value={filters.condition}
            onChange={(e) => handleFilterChange("condition", e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            <option value="">Любое</option>
            <option value="new">Новое</option>
            <option value="used">Б/у</option>
            <option value="refurbished">Восстановленное</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Сортировка</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            <option value="newest">Сначала новые</option>
            <option value="price-asc">Сначала дешевые</option>
            <option value="price-desc">Сначала дорогие</option>
            <option value="rating">По рейтингу</option>
          </select>
        </div>

        <Button onClick={clearFilters} variant="outline" className="w-full">
          <Icon name="RotateCcw" className="h-4 w-4 mr-2" />
          Сбросить фильтры
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShopFilters;
