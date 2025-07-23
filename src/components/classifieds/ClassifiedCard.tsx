import React from "react";
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

interface Classified {
  id: string;
  title: string;
  description: string;
  price?: number;
  priceType: "fixed" | "negotiable" | "free" | "exchange";
  images: string[];
  category: string;
  subcategory?: string;
  type: "sale" | "wanted" | "exchange" | "free";
  condition?: "new" | "used" | "broken";
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    responseTime: string;
    memberSince: string;
  };
  location: string;
  createdAt: string;
  featured: boolean;
  urgent: boolean;
  tags: string[];
  contactPreference: "phone" | "message" | "both";
  viewCount: number;
  favoriteCount: number;
}

interface ClassifiedCardProps {
  classified: Classified;
  getTypeConfig: (type: string) => {
    label: string;
    color: string;
    icon: string;
  };
  getConditionColor: (condition?: string) => string;
  getConditionText: (condition?: string) => string;
  getPriceText: (classified: Classified) => string;
}

const ClassifiedCard: React.FC<ClassifiedCardProps> = ({
  classified,
  getTypeConfig,
  getConditionColor,
  getConditionText,
  getPriceText,
}) => {
  const typeConfig = getTypeConfig(classified.type);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {classified.images.length > 0 ? (
          <img
            src={classified.images[0]}
            alt={classified.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <Icon
              name="ImageOff"
              className="h-16 w-16 text-muted-foreground"
            />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          {classified.featured && (
            <Badge className="bg-accent text-white">
              Топ
            </Badge>
          )}
          {classified.urgent && (
            <Badge className="bg-red-500 text-white">
              Срочно
            </Badge>
          )}
          <Badge
            className={`${typeConfig.color} text-white`}
          >
            {typeConfig.label}
          </Badge>
          <FavoriteButton
            item={{
              id: classified.id,
              type: "classified",
              title: classified.title,
              description: classified.description,
              image: classified.images[0],
            }}
          />
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle
          className="text-lg leading-tight line-clamp-2"
          style={{ fontFamily: "Oswald, sans-serif" }}
        >
          {classified.title}
        </CardTitle>
        <p
          className="text-sm text-muted-foreground line-clamp-3"
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          {classified.description}
        </p>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-accent">
            {getPriceText(classified)}
          </span>
          {classified.condition && (
            <Badge
              className={`${getConditionColor(classified.condition)} text-white text-xs`}
            >
              {getConditionText(classified.condition)}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={classified.seller.avatar}
              alt={classified.seller.name}
            />
            <AvatarFallback className="text-xs">
              {classified.seller.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {classified.seller.name}
          </span>
          {classified.seller.isVerified && (
            <Icon
              name="BadgeCheck"
              className="h-4 w-4 text-blue-500"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icon name="Eye" className="h-3 w-3" />
            <span>{classified.viewCount} просмотров</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Heart" className="h-3 w-3" />
            <span>
              {classified.favoriteCount} в избранном
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Clock" className="h-3 w-3" />
            <span>
              отвечает через{" "}
              {classified.seller.responseTime}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="MapPin" className="h-3 w-3" />
            <span>{classified.location}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1">
            <Icon
              name="MessageCircle"
              className="h-4 w-4 mr-2"
            />
            Написать
          </Button>
          <Button className="flex-1 bg-accent hover:bg-accent/90">
            <Icon name="Phone" className="h-4 w-4 mr-2" />
            Связаться
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClassifiedCard;