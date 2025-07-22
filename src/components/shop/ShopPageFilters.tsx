import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { categories } from "@/data/shopData";

interface ShopPageFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  filteredCount: number;
  totalCount: number;
  onClearFilters: () => void;
}

const ShopPageFilters: React.FC<ShopPageFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  isEditing,
  setIsEditing,
  filteredCount,
  totalCount,
  onClearFilters
}) => {
  return (
    <section className="py-6 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Поиск магазинов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
            size="sm"
          >
            <Icon name="Edit" className="h-4 w-4 mr-2" />
            {isEditing ? "Сохранить" : "Редактировать"}
          </Button>
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Найдено: {filteredCount} из {totalCount}</span>
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <Icon name="X" className="h-3 w-3 mr-1" />
            Очистить
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShopPageFilters;