import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Icon from "@/components/ui/icon";
import { Store } from "@/types/store";

interface StoreCardProps {
  store: Store;
  onStoreClick: (storeId: string) => void;
  onFollowStore?: (storeId: string) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({
  store,
  onStoreClick,
  onFollowStore,
}) => {
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group bg-card border-border">
      <div className="relative" onClick={() => onStoreClick(store.id)}>
        <img
          src={store.bannerImage}
          alt={`${store.name} banner`}
          className="w-full h-24 sm:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex gap-1 sm:gap-2">
          {store.featured && (
            <Badge className="bg-accent text-accent-foreground text-xs">
              Рекомендуем
            </Badge>
          )}
          {!store.isOpen && (
            <Badge className="bg-red-500 text-white text-xs">Закрыт</Badge>
          )}
        </div>
        <div className="absolute top-2 left-2">
          <Badge
            className={`${getCategoryColor(store.category)} text-white text-xs`}
          >
            {store.category}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3 p-4" onClick={() => onStoreClick(store.id)}>
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-border shadow-md">
            <AvatarImage src={store.logo} alt={store.name} />
            <AvatarFallback className="text-sm">
              {store.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="font-bold text-base sm:text-lg leading-tight truncate text-card-foreground"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                {store.name}
              </h3>
              {store.isVerified && (
                <Icon
                  name="BadgeCheck"
                  className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0"
                />
              )}
            </div>
            <p
              className="text-sm text-muted-foreground line-clamp-2"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              {store.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="Star" className="h-4 w-4 text-yellow-500" />
            <span className="font-medium text-card-foreground">
              {store.rating}
            </span>
            <span className="text-muted-foreground">({store.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Package" className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {store.totalProducts.toLocaleString()} товаров
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="MapPin" className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground truncate">
              {store.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Users" className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {store.followers} подписчиков
            </span>
          </div>
        </div>

        {store.isOpen && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 font-medium">Сейчас открыт</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1 w-full sm:w-auto"
            onClick={(e) => {
              e.stopPropagation();
              onFollowStore?.(store.id);
            }}
          >
            <Icon name="Heart" className="h-4 w-4 mr-2" />
            Подписаться
          </Button>
          <Button
            className="flex-1 bg-accent hover:bg-accent/90 w-full sm:w-auto"
            onClick={() => onStoreClick(store.id)}
          >
            <Icon name="ArrowRight" className="h-4 w-4 mr-2" />
            Открыть
          </Button>
        </div>

        {store.contacts.phone && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Phone" className="h-4 w-4" />
              <span>{store.contacts.phone}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreCard;
