import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import BackButton from "@/components/ui/BackButton";
import StoreCard from "@/components/stores/StoreCard";
import StoreFilters from "@/components/stores/StoreFilters";
import { useStoreFilters } from "@/hooks/useStoreFilters";
import { mockStores } from "@/data/mockStores";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Store } from "@/types/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StoresProps {
  onStoreClick: (storeId: string) => void;
}

const Stores: React.FC<StoresProps> = ({ onStoreClick }) => {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    clearFilters,
    categories,
    locations,
    sortedStores,
  } = useStoreFilters(mockStores);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Store>>({
    name: "",
    description: "",
    category: "",
    location: "",
    logo: "",
    bannerImage: "",
    rating: 5.0,
    reviewCount: 0,
    isVerified: false,
    totalProducts: 0,
    followers: 0,
    isOpen: true,
    contacts: { phone: "", telegram: "" },
    tags: [],
    featured: false,
  });

  const handleFollowStore = (storeId: string) => {
    console.log("Подписаться на магазин:", storeId);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contacts: { ...prev.contacts, [field]: value },
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      location: "",
      logo: "",
      bannerImage: "",
      rating: 5.0,
      reviewCount: 0,
      isVerified: false,
      totalProducts: 0,
      followers: 0,
      isOpen: true,
      contacts: { phone: "", telegram: "" },
      tags: [],
      featured: false,
    });
  };

  const handleSubmit = () => {
    console.log("Создание магазина:", formData);
    setIsDialogOpen(false);
    resetForm();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Мотомагазин":
        return "bg-blue-500";
      case "Тюнинг":
        return "bg-purple-500";
      case "Сервис":
        return "bg-green-500";
      case "Кросс/Эндуро":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const featuredStores = sortedStores.filter((store) => store.featured);
  const regularStores = sortedStores.filter((store) => !store.featured);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <BackButton />
              <h1
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Магазины
              </h1>
            </div>
            <p
              className="text-sm sm:text-base text-muted-foreground"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Найдите лучшие мотомагазины и сервисы в вашем городе
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <Icon name="Filter" className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90 w-full sm:w-auto">
                  <Icon name="Plus" className="h-4 w-4 mr-2" />
                  Создать магазин
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Создать магазин</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Название</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleFormChange("name", e.target.value)}
                        placeholder="Название магазина"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleFormChange("description", e.target.value)}
                        placeholder="Описание магазина"
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
                          <SelectItem value="Мотомагазин">Мотомагазин</SelectItem>
                          <SelectItem value="Тюнинг">Тюнинг</SelectItem>
                          <SelectItem value="Сервис">Сервис</SelectItem>
                          <SelectItem value="Кросс/Эндуро">Кросс/Эндуро</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="location">Город</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleFormChange("location", e.target.value)}
                        placeholder="Тюмень"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        value={formData.contacts?.phone}
                        onChange={(e) => handleContactChange("phone", e.target.value)}
                        placeholder="+7 (3452) 555-123"
                      />
                    </div>

                    <div>
                      <Label htmlFor="telegram">Telegram</Label>
                      <Input
                        id="telegram"
                        value={formData.contacts?.telegram}
                        onChange={(e) => handleContactChange("telegram", e.target.value)}
                        placeholder="@магазин"
                      />
                    </div>

                    <div>
                      <Label htmlFor="logo">URL логотипа</Label>
                      <Input
                        id="logo"
                        value={formData.logo}
                        onChange={(e) => handleFormChange("logo", e.target.value)}
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="banner">URL баннера</Label>
                      <Input
                        id="banner"
                        value={formData.bannerImage}
                        onChange={(e) => handleFormChange("bannerImage", e.target.value)}
                        placeholder="https://..."
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
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="relative">
                        <img
                          src={formData.bannerImage || "https://picsum.photos/800/300?random=99"}
                          alt="banner"
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          {formData.featured && (
                            <Badge className="bg-accent text-accent-foreground text-xs">
                              Рекомендуем
                            </Badge>
                          )}
                          {!formData.isOpen && (
                            <Badge className="bg-red-500 text-white text-xs">Закрыт</Badge>
                          )}
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge
                            className={`${getCategoryColor(formData.category || "")} text-white text-xs`}
                          >
                            {formData.category || "Категория"}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-3 p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12 border-2 border-border shadow-md">
                            <AvatarImage src={formData.logo} alt={formData.name} />
                            <AvatarFallback className="text-sm">
                              {formData.name?.charAt(0) || "М"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className="font-bold text-lg leading-tight truncate"
                                style={{ fontFamily: "Oswald, sans-serif" }}
                              >
                                {formData.name || "Название магазина"}
                              </h3>
                              {formData.isVerified && (
                                <Icon name="BadgeCheck" className="h-5 w-5 text-blue-500" />
                              )}
                            </div>
                            <p
                              className="text-sm text-muted-foreground line-clamp-2"
                              style={{ fontFamily: "Open Sans, sans-serif" }}
                            >
                              {formData.description || "Описание магазина..."}
                            </p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0 p-4">
                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Icon name="Star" className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{formData.rating || 5.0}</span>
                            <span className="text-muted-foreground">({formData.reviewCount || 0})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Package" className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {formData.totalProducts || 0} товаров
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="MapPin" className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground truncate">
                              {formData.location || "Город"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Users" className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {formData.followers || 0} подписчиков
                            </span>
                          </div>
                        </div>

                        {formData.isOpen && (
                          <div className="flex items-center gap-2 mb-4 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-600 font-medium">Сейчас открыт</span>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1">
                            <Icon name="Heart" className="h-4 w-4 mr-2" />
                            Подписаться
                          </Button>
                          <Button className="flex-1 bg-accent hover:bg-accent/90">
                            <Icon name="ArrowRight" className="h-4 w-4 mr-2" />
                            Открыть
                          </Button>
                        </div>

                        {formData.contacts?.phone && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Icon name="Phone" className="h-4 w-4" />
                              <span>{formData.contacts.phone}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {/* Фильтры */}
          <div className="lg:col-span-1">
            <StoreFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              handleFilterChange={handleFilterChange}
              clearFilters={clearFilters}
              categories={categories}
              locations={locations}
            />
          </div>

          {/* Магазины */}
          <div className="lg:col-span-3">
            <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Найдено магазинов: {sortedStores.length}
              </p>
              <div className="flex items-center gap-2 justify-end">
                <Button variant="outline" size="sm">
                  <Icon name="Grid3x3" className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="List" className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Рекомендуемые магазины */}
            {featuredStores.length > 0 && (
              <div className="mb-4 sm:mb-6 md:mb-8">
                <h2
                  className="text-xl sm:text-2xl font-bold mb-4 text-foreground"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Рекомендуемые
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {featuredStores.map((store) => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      onStoreClick={onStoreClick}
                      onFollowStore={handleFollowStore}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Все магазины */}
            {regularStores.length > 0 && (
              <div>
                <h2
                  className="text-xl sm:text-2xl font-bold mb-4 text-foreground"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Все магазины
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {regularStores.map((store) => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      onStoreClick={onStoreClick}
                      onFollowStore={handleFollowStore}
                    />
                  ))}
                </div>
              </div>
            )}

            {sortedStores.length === 0 && (
              <div className="text-center py-12">
                <Icon
                  name="Store"
                  className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground"
                />
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Магазины не найдены
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Попробуйте изменить параметры поиска или фильтры
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stores;