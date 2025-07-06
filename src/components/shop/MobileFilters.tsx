import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Icon from "@/components/ui/icon";
import { ShopFilters as ShopFiltersType } from "@/types/product";

interface MobileFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filters: ShopFiltersType;
  handleFilterChange: (key: string, value: string) => void;
  clearFilters: () => void;
  categories: string[];
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  filters,
  handleFilterChange,
  clearFilters,
  categories,
}) => {
  const [open, setOpen] = useState(false);

  const handleClearFilters = () => {
    clearFilters();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full mb-4 lg:hidden">
          <Icon name="Filter" className="h-4 w-4 mr-2" />
          Фильтры
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-80">
        <SheetHeader>
          <SheetTitle>Фильтры</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          {/* Поиск */}
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
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-input text-foreground border-border focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Категория */}
          <div>
            <label className="block text-sm font-medium mb-2 text-card-foreground">
              Категория
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-input text-foreground border-border focus:border-accent focus:ring-1 focus:ring-accent"
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Цена */}
          <div>
            <label className="block text-sm font-medium mb-2 text-card-foreground">
              Цена
            </label>
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange("priceRange", e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-input text-foreground border-border focus:border-accent focus:ring-1 focus:ring-accent"
            >
              <option value="">Любая цена</option>
              <option value="0-5000">До 5 000 ₽</option>
              <option value="5000-15000">5 000 - 15 000 ₽</option>
              <option value="15000-30000">15 000 - 30 000 ₽</option>
              <option value="30000-50000">30 000 - 50 000 ₽</option>
              <option value="50000+">От 50 000 ₽</option>
            </select>
          </div>

          {/* Состояние */}
          <div>
            <label className="block text-sm font-medium mb-2 text-card-foreground">
              Состояние
            </label>
            <select
              value={filters.condition}
              onChange={(e) => handleFilterChange("condition", e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-input text-foreground border-border focus:border-accent focus:ring-1 focus:ring-accent"
            >
              <option value="">Любое</option>
              <option value="new">Новое</option>
              <option value="used">Б/у</option>
              <option value="refurbished">Восстановленное</option>
            </select>
          </div>

          {/* Сортировка */}
          <div>
            <label className="block text-sm font-medium mb-2 text-card-foreground">
              Сортировка
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-input text-foreground border-border focus:border-accent focus:ring-1 focus:ring-accent"
            >
              <option value="newest">Сначала новые</option>
              <option value="price-asc">Сначала дешевые</option>
              <option value="price-desc">Сначала дорогие</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>

          {/* Кнопки */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="flex-1"
            >
              <Icon name="RotateCcw" className="h-4 w-4 mr-2" />
              Сбросить
            </Button>
            <Button onClick={() => setOpen(false)} className="flex-1">
              Применить
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilters;
