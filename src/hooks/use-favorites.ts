import { useState, useCallback } from "react";

interface FavoriteItem {
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
  addedAt: Date;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem("moto-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const addToFavorites = useCallback((item: Omit<FavoriteItem, "addedAt">) => {
    const newItem: FavoriteItem = {
      ...item,
      addedAt: new Date(),
    };

    setFavorites((prev) => {
      const exists = prev.find(
        (fav) => fav.id === item.id && fav.type === item.type,
      );
      if (exists) return prev;

      const updated = [...prev, newItem];
      localStorage.setItem("moto-favorites", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromFavorites = useCallback((id: string, type: string) => {
    setFavorites((prev) => {
      const updated = prev.filter(
        (fav) => !(fav.id === id && fav.type === type),
      );
      localStorage.setItem("moto-favorites", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string, type: string) => {
      return favorites.some((fav) => fav.id === id && fav.type === type);
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    (item: Omit<FavoriteItem, "addedAt">) => {
      if (isFavorite(item.id, item.type)) {
        removeFromFavorites(item.id, item.type);
      } else {
        addToFavorites(item);
      }
    },
    [isFavorite, removeFromFavorites, addToFavorites],
  );

  const getFavoritesByType = useCallback(
    (type: string) => {
      return favorites.filter((fav) => fav.type === type);
    },
    [favorites],
  );

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    getFavoritesByType,
  };
};
