import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { ShopData } from "./types";

interface ShopCardProps {
  shop: ShopData;
  isEditing: boolean;
  onEdit: (id: number, field: keyof ShopData, value: string | number) => void;
}

interface ShopStatus {
  status: string;
  color: string;
  dotColor: string;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, isEditing, onEdit }) => {
  const getShopStatus = (shop: ShopData): ShopStatus => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const isOpen = currentTimeInMinutes >= shop.openTime && currentTimeInMinutes < shop.closeTime;

    if (isOpen) {
      return {
        status: "Открыто",
        color: "text-green-400",
        dotColor: "bg-green-400",
      };
    } else {
      return {
        status: "Закрыто",
        color: "text-red-400",
        dotColor: "bg-red-400",
      };
    }
  };

  const shopStatus = getShopStatus(shop);

  return (
    <div className="bg-card rounded-xl shadow-sm hover:shadow-md border border-border transition-all duration-300 overflow-hidden group">
      <div className="absolute top-3 right-3 z-10">
        <div className="flex items-center gap-1 bg-background/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm border border-border">
          <div className={`w-2 h-2 ${shopStatus.dotColor} rounded-full`}></div>
          <span className={`text-xs font-medium ${shopStatus.color === "text-green-400" ? "text-green-600" : "text-red-600"}`}>
            {shopStatus.status}
          </span>
        </div>
      </div>

      <div className="relative h-32 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
        <Icon name={shop.icon as any} className="h-12 w-12 text-white" />
        <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-white text-xs font-medium">
            {isEditing ? (
              <input
                type="text"
                value={shop.category}
                onChange={(e) => onEdit(shop.id, 'category', e.target.value)}
                className="bg-transparent text-white text-xs border-none outline-none"
              />
            ) : (
              shop.category
            )}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-foreground truncate">
            {isEditing ? (
              <input
                type="text"
                value={shop.name}
                onChange={(e) => onEdit(shop.id, 'name', e.target.value)}
                className="bg-transparent border-b border-border outline-none text-lg font-bold"
              />
            ) : (
              shop.name
            )}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <Icon name="Star" className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold text-foreground">
              {shop.rating}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {isEditing ? (
            <textarea
              value={shop.description}
              onChange={(e) => onEdit(shop.id, 'description', e.target.value)}
              className="w-full bg-transparent border border-border rounded p-1 text-sm resize-none"
              rows={2}
            />
          ) : (
            shop.description
          )}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="MapPin" className="h-3 w-3 text-orange-500 flex-shrink-0" />
            <span className="truncate">
              {isEditing ? (
                <input
                  type="text"
                  value={shop.shortAddress}
                  onChange={(e) => onEdit(shop.id, 'shortAddress', e.target.value)}
                  className="bg-transparent border-b border-border outline-none text-sm w-full"
                />
              ) : (
                shop.shortAddress
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Clock" className="h-3 w-3 text-orange-500 flex-shrink-0" />
            <span>
              {isEditing ? (
                <input
                  type="text"
                  value={shop.shortWorkTime}
                  onChange={(e) => onEdit(shop.id, 'shortWorkTime', e.target.value)}
                  className="bg-transparent border-b border-border outline-none text-sm"
                />
              ) : (
                shop.shortWorkTime
              )}
            </span>
          </div>
        </div>

        <a 
          href={isEditing ? "#" : shop.website} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block mb-3"
          onClick={isEditing ? (e) => e.preventDefault() : undefined}
        >
          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all">
            <Icon name="Globe" className="h-4 w-4 mr-2" />
            {isEditing ? (
              <input
                type="text"
                value={shop.website}
                onChange={(e) => onEdit(shop.id, 'website', e.target.value)}
                className="bg-transparent text-white outline-none text-center"
                placeholder="URL сайта"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              "Перейти на сайт"
            )}
          </Button>
        </a>

        <div className="flex justify-between items-center">
          <a 
            href={isEditing ? "#" : `tel:${shop.phone}`} 
            className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium"
            onClick={isEditing ? (e) => e.preventDefault() : undefined}
          >
            <Icon name="Phone" className="h-3 w-3" />
            <span className="text-sm">
              {isEditing ? (
                <input
                  type="text"
                  value={shop.phone}
                  onChange={(e) => onEdit(shop.id, 'phone', e.target.value)}
                  className="bg-transparent border-b border-border outline-none text-sm text-orange-600"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                "Звонок"
              )}
            </span>
          </a>

          <div className="flex gap-1">
            {shop.telegram && (
              <a 
                href={isEditing ? "#" : shop.telegram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                onClick={isEditing ? (e) => e.preventDefault() : undefined}
              >
                <Icon name="Send" className="h-3 w-3 text-white" />
              </a>
            )}
            {shop.vk && (
              <a 
                href={isEditing ? "#" : shop.vk} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                onClick={isEditing ? (e) => e.preventDefault() : undefined}
              >
                <span className="text-white font-bold text-xs">VK</span>
              </a>
            )}
            {shop.whatsapp && (
              <a 
                href={isEditing ? "#" : shop.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center w-6 h-6 bg-green-500 hover:bg-green-600 rounded transition-colors"
                onClick={isEditing ? (e) => e.preventDefault() : undefined}
              >
                <Icon name="MessageCircle" className="h-3 w-3 text-white" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;