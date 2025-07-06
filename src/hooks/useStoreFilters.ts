import { useState, useMemo } from "react";
import { Store, StoreFilters, StoreSortOption } from "@/types/store";

export const useStoreFilters = (stores: Store[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<StoreFilters>({
    category: "",
    location: "",
    rating: "",
    sortBy: "rating",
  });

  const categories = useMemo(
    () => [...new Set(stores.map((s) => s.category))],
    [stores],
  );

  const locations = useMemo(
    () => [...new Set(stores.map((s) => s.location))],
    [stores],
  );

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      location: "",
      rating: "",
      sortBy: "rating",
    });
    setSearchTerm("");
  };

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesSearch =
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesCategory =
        !filters.category || store.category === filters.category;

      const matchesLocation =
        !filters.location || store.location === filters.location;

      let matchesRating = true;
      if (filters.rating) {
        const minRating = parseFloat(filters.rating);
        matchesRating = store.rating >= minRating;
      }

      return (
        matchesSearch && matchesCategory && matchesLocation && matchesRating
      );
    });
  }, [stores, searchTerm, filters]);

  const sortedStores = useMemo(() => {
    return [...filteredStores].sort((a, b) => {
      switch (filters.sortBy as StoreSortOption) {
        case "rating":
          return b.rating - a.rating;
        case "popular":
          return b.followers - a.followers;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [filteredStores, filters.sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    clearFilters,
    categories,
    locations,
    sortedStores,
  };
};
