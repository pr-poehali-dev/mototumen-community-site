import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useFavorites } from "@/hooks/use-favorites";

interface FavoriteButtonProps {
  item: {
    id: string;
    type:
      | "product"
      | "service"
      | "course"
      | "announcement"
      | "event"
      | "lost-found";
    title: string;
    description?: string;
    image?: string;
    price?: number;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  item,
  className = "",
  size = "md",
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(item.id, item.type);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item);
  };

  return (
    <Button
      variant={favorite ? "default" : "outline"}
      size={size}
      onClick={handleClick}
      className={`${className} ${favorite ? "bg-accent hover:bg-accent/90" : ""}`}
    >
      <Icon
        name={favorite ? "Heart" : "Heart"}
        className={`h-4 w-4 ${favorite ? "fill-current" : ""}`}
      />
    </Button>
  );
};

export default FavoriteButton;
