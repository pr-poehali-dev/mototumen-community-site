import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FavoriteButton from "@/components/ui/favorite-button";
import Icon from "@/components/ui/icon";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onContactSeller?: (productId: string) => void;
  onBuyProduct?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onContactSeller,
  onBuyProduct,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-500";
      case "used":
        return "bg-blue-500";
      case "refurbished":
        return "bg-accent";
      default:
        return "bg-gray-500";
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case "new":
        return "Новое";
      case "used":
        return "Б/у";
      case "refurbished":
        return "Восстановленное";
      default:
        return "";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-card border-border flex flex-col">
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-32 sm:h-40 md:h-48 object-cover"
        />
        <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex gap-1 sm:gap-2">
          {product.featured && (
            <Badge className="bg-accent text-accent-foreground text-xs">
              Топ
            </Badge>
          )}
          <Badge
            className={`${getConditionColor(product.condition)} text-white text-xs`}
          >
            {getConditionText(product.condition)}
          </Badge>
          <FavoriteButton
            item={{
              id: product.id,
              type: "product",
              title: product.title,
              description: product.description,
              image: product.images[0],
            }}
          />
        </div>
      </div>

      <CardHeader className="pb-2 p-3 sm:p-6">
        <CardTitle
          className="text-sm sm:text-base md:text-lg leading-tight line-clamp-2 text-card-foreground"
          style={{ fontFamily: "Oswald, sans-serif" }}
        >
          {product.title}
        </CardTitle>
        <p
          className={`text-xs sm:text-sm text-muted-foreground ${isExpanded ? '' : 'line-clamp-2'}`}
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          {product.description}
        </p>
        {product.description.length > 80 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-accent text-xs hover:underline mt-1"
          >
            {isExpanded ? 'Свернуть' : 'Развернуть'}
          </button>
        )}
      </CardHeader>

      <CardContent className="pb-2 px-3 sm:px-6 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl sm:text-2xl font-bold text-accent">
            {product.price.toLocaleString()} ₽
          </span>
          {product.originalPrice && (
            <span className="text-xs sm:text-sm text-muted-foreground line-through">
              {product.originalPrice.toLocaleString()} ₽
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={product.seller.avatar}
              alt={product.seller.name}
            />
            <AvatarFallback className="text-xs">
              {product.seller.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-card-foreground">
            {product.seller.name}
          </span>
          {product.seller.isVerified && (
            <Icon name="BadgeCheck" className="h-4 w-4 text-blue-500" />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icon name="Star" className="h-4 w-4 text-yellow-500" />
            <span>{product.seller.rating}</span>
            <span>({product.seller.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="MapPin" className="h-4 w-4" />
            <span className="truncate">{product.location}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1 text-sm"
            onClick={() => onContactSeller?.(product.id)}
          >
            <Icon name="MessageCircle" className="h-4 w-4 mr-2" />
            Написать
          </Button>
          <Button
            className="flex-1 bg-accent hover:bg-accent/90 text-sm"
            onClick={() => onBuyProduct?.(product.id)}
          >
            <Icon name="ShoppingCart" className="h-4 w-4 mr-2" />
            Купить
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
