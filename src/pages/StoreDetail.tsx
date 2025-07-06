import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import ProductCard from "@/components/shop/ProductCard";
import { mockStores } from "@/data/mockStores";
import { mockProducts } from "@/data/mockProducts";

interface StoreDetailProps {
  storeId: string;
  onBack: () => void;
  onContactStore?: (storeId: string) => void;
  onFollowStore?: (storeId: string) => void;
}

const StoreDetail: React.FC<StoreDetailProps> = ({
  storeId,
  onBack,
  onContactStore,
  onFollowStore,
}) => {
  const store = mockStores.find((s) => s.id === storeId);

  // Фильтруем товары для данного магазина (примерная логика)
  const storeProducts = mockProducts.filter(
    (product) => product.seller.name === store?.name,
  );

  if (!store) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center">
          <Icon
            name="Store"
            className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground"
          />
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            Магазин не найден
          </h2>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            Возможно, магазин был удален или изменен URL
          </p>
          <Button onClick={onBack} className="w-full sm:w-auto">
            <Icon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

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

  const handleContactSeller = (productId: string) => {
    console.log("Связаться с продавцом:", productId);
  };

  const handleBuyProduct = (productId: string) => {
    console.log("Купить товар:", productId);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero секция с баннером */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-muted to-muted-foreground/20">
        <img
          src={store.bannerImage}
          alt={`${store.name} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60"></div>

        {/* Контент поверх баннера */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-4 sm:pb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-primary-foreground hover:text-primary-foreground/80 mb-4"
            >
              <Icon name="ArrowLeft" className="h-4 w-4 mr-2" />
              Назад к магазинам
            </Button>

            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-primary-foreground shadow-lg">
                <AvatarImage src={store.logo} alt={store.name} />
                <AvatarFallback className="text-lg sm:text-xl">
                  {store.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1
                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-foreground"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    {store.name}
                  </h1>
                  {store.isVerified && (
                    <Icon
                      name="BadgeCheck"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-primary"
                    />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-primary-foreground/90">
                  <Badge
                    className={`${getCategoryColor(store.category)} text-primary-foreground text-xs sm:text-sm`}
                  >
                    {store.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Icon name="Star" className="h-4 w-4 text-yellow-500" />
                    <span>{store.rating}</span>
                    <span>({store.reviewCount} отзывов)</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Icon name="MapPin" className="h-4 w-4" />
                    <span>{store.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 w-full sm:w-auto"
                  onClick={() => onFollowStore?.(store.id)}
                >
                  <Icon name="Heart" className="h-4 w-4 mr-2" />
                  Подписаться
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                  onClick={() => onContactStore?.(store.id)}
                >
                  <Icon name="MessageCircle" className="h-4 w-4 mr-2" />
                  Написать
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Боковая панель с информацией */}
          <div className="lg:col-span-1">
            <div className="space-y-4 sm:space-y-6">
              {/* Основная информация */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">
                    О магазине
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {store.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Товаров:</span>
                      <br />
                      <span className="font-medium">
                        {store.totalProducts.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Подписчиков:
                      </span>
                      <br />
                      <span className="font-medium">{store.followers}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${store.isOpen ? "bg-green-500" : "bg-destructive"}`}
                    ></div>
                    <span
                      className={`text-sm font-medium ${store.isOpen ? "text-green-600 dark:text-green-400" : "text-destructive"}`}
                    >
                      {store.isOpen ? "Сейчас открыт" : "Закрыт"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Контакты */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">
                    Контакты
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {store.contacts.phone && (
                    <div className="flex items-center gap-3">
                      <Icon
                        name="Phone"
                        className="h-4 w-4 text-muted-foreground"
                      />
                      <span className="text-sm">{store.contacts.phone}</span>
                    </div>
                  )}
                  {store.contacts.telegram && (
                    <div className="flex items-center gap-3">
                      <Icon
                        name="Send"
                        className="h-4 w-4 text-muted-foreground"
                      />
                      <span className="text-sm">{store.contacts.telegram}</span>
                    </div>
                  )}
                  {store.contacts.whatsapp && (
                    <div className="flex items-center gap-3">
                      <Icon
                        name="MessageCircle"
                        className="h-4 w-4 text-muted-foreground"
                      />
                      <span className="text-sm">{store.contacts.whatsapp}</span>
                    </div>
                  )}
                  {store.contacts.website && (
                    <div className="flex items-center gap-3">
                      <Icon
                        name="Globe"
                        className="h-4 w-4 text-muted-foreground"
                      />
                      <a
                        href={store.contacts.website}
                        className="text-sm text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Сайт магазина
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Режим работы */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">
                    Режим работы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(store.workingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize text-muted-foreground">
                          {day === "monday" && "Пн"}
                          {day === "tuesday" && "Вт"}
                          {day === "wednesday" && "Ср"}
                          {day === "thursday" && "Чт"}
                          {day === "friday" && "Пт"}
                          {day === "saturday" && "Сб"}
                          {day === "sunday" && "Вс"}
                        </span>
                        <span className="font-medium">{hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Основной контент с товарами */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="products" className="text-xs sm:text-sm">
                  Товары ({storeProducts.length})
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs sm:text-sm">
                  Отзывы ({store.reviewCount})
                </TabsTrigger>
                <TabsTrigger value="info" className="text-xs sm:text-sm">
                  Информация
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-4 sm:mt-6">
                <div className="mb-4">
                  <h2
                    className="text-xl sm:text-2xl font-bold mb-2"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    Товары магазина
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Найдено товаров: {storeProducts.length}
                  </p>
                </div>

                {storeProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {storeProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onContactSeller={handleContactSeller}
                        onBuyProduct={handleBuyProduct}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon
                      name="Package"
                      className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground"
                    />
                    <h3 className="text-lg font-semibold mb-2">
                      Товары отсутствуют
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      В данный момент в магазине нет товаров для продажи
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-4 sm:mt-6">
                <div className="text-center py-12">
                  <Icon
                    name="MessageSquare"
                    className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground"
                  />
                  <h3 className="text-lg font-semibold mb-2">Отзывы</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Функция отзывов будет добавлена в следующем обновлении
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="info" className="mt-4 sm:mt-6">
                <div className="space-y-4 sm:space-y-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base sm:text-lg">
                        Подробная информация
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 text-sm sm:text-base">
                          Описание
                        </h4>
                        <p className="text-muted-foreground text-sm sm:text-base">
                          {store.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-sm sm:text-base">
                          Специализация
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {store.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs sm:text-sm"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-sm sm:text-base">
                          Дата регистрации
                        </h4>
                        <p className="text-muted-foreground text-sm sm:text-base">
                          {new Date(store.createdAt).toLocaleDateString(
                            "ru-RU",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;
