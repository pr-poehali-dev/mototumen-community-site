import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { categories } from "./data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShopData } from "./types";
import { Card } from "@/components/ui/card";

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
  onSearch?: () => void;
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
  onClearFilters,
  onSearch
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ShopData>>({
    name: "",
    description: "",
    category: "",
    address: "",
    phone: "",
    website: "",
    workTime: "",
    rating: 5.0,
    icon: "🏪",
    color: "blue",
  });

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      address: "",
      phone: "",
      website: "",
      workTime: "",
      rating: 5.0,
      icon: "🏪",
      color: "blue",
    });
  };

  const handleSubmit = () => {
    console.log("Создание магазина:", formData);
    setIsDialogOpen(false);
    resetForm();
  };

  const getShopStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();
    const workTimeMatch = formData.workTime?.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
    
    if (workTimeMatch) {
      const [, startHour, startMin, endHour, endMin] = workTimeMatch;
      const startTime = parseInt(startHour) + parseInt(startMin) / 60;
      const endTime = parseInt(endHour) + parseInt(endMin) / 60;
      const currentTime = currentHour + now.getMinutes() / 60;
      const isWorkDay = currentDay >= 1 && currentDay <= 6;
      const isWorkTime = currentTime >= startTime && currentTime < endTime;
      return isWorkDay && isWorkTime;
    }
    return false;
  };

  const isOpen = getShopStatus();
  return (
    <section className="py-6 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
          <div className="relative flex-1 max-w-md flex gap-2">
            <Input
              type="text"
              placeholder="Поиск магазинов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch?.()}
              className="pl-10"
            />
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {onSearch && (
              <Button onClick={onSearch} size="sm">
                <Icon name="Search" className="h-4 w-4" />
              </Button>
            )}
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

          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-accent hover:bg-accent/90">
                  <Icon name="Plus" className="h-4 w-4 mr-2" />
                  Добавить
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Создать продукт</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Название</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleFormChange("name", e.target.value)}
                        placeholder="Название продукта"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleFormChange("description", e.target.value)}
                        placeholder="Описание продукта"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Категория</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleFormChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(c => c !== "Все").map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="address">Адрес</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleFormChange("address", e.target.value)}
                        placeholder="ул. Пример, 1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleFormChange("phone", e.target.value)}
                        placeholder="+7 (3452) 555-123"
                      />
                    </div>

                    <div>
                      <Label htmlFor="workTime">Часы работы</Label>
                      <Input
                        id="workTime"
                        value={formData.workTime}
                        onChange={(e) => handleFormChange("workTime", e.target.value)}
                        placeholder="09:00-18:00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Веб-сайт</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleFormChange("website", e.target.value)}
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="icon">Иконка (emoji)</Label>
                      <Input
                        id="icon"
                        value={formData.icon}
                        onChange={(e) => handleFormChange("icon", e.target.value)}
                        placeholder="🏪"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleSubmit}
                        className="flex-1 bg-accent hover:bg-accent/90"
                      >
                        Создать
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          resetForm();
                        }}
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Предпоказ</h3>
                    <Card className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="text-3xl">{formData.icon || "🏪"}</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground mb-1">
                              {formData.name || "Название магазина"}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {formData.category || "Категория"}
                            </p>
                            <div className="flex items-center gap-1 mb-2">
                              <Icon name="Star" className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs font-medium">{formData.rating || 5.0}</span>
                            </div>
                          </div>
                        </div>

                        <div className={`flex items-center gap-2 mb-3 px-3 py-1 rounded-full inline-flex ${
                          isOpen ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            isOpen ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span className="text-xs font-medium">
                            {isOpen ? 'ОТКРЫТО' : 'ЗАКРЫТО'}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                          {formData.description || "Описание магазина..."}
                        </p>

                        <div className="space-y-2 mb-4 text-sm">
                          {formData.address && (
                            <div className="flex items-start gap-2 text-muted-foreground">
                              <Icon name="MapPin" className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{formData.address}</span>
                            </div>
                          )}
                          {formData.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Icon name="Phone" className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>{formData.phone}</span>
                            </div>
                          )}
                          {formData.workTime && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Icon name="Clock" className="h-4 w-4 text-orange-500 flex-shrink-0" />
                              <span>{formData.workTime}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1" size="sm">
                            <Icon name="Phone" className="h-4 w-4 mr-1" />
                            Позвонить
                          </Button>
                          <Button className="flex-1 bg-accent hover:bg-accent/90" size="sm">
                            <Icon name="MapPin" className="h-4 w-4 mr-1" />
                            На карте
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              size="sm"
            >
              <Icon name="Edit" className="h-4 w-4 mr-2" />
              {isEditing ? "Сохранить" : "Редактировать"}
            </Button>
          </div>
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