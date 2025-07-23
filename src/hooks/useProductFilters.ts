import { useState, useMemo } from "react";
import { Product, ShopFilters, SortOption } from "@/types/product";

export const useProductFilters = (products: Product[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filters, setFilters] = useState<ShopFilters>({
    priceRange: "",
    condition: "",
    sortBy: "newest",
    location: "",
  });

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products],
  );

  const locations = useMemo(
    () => [...new Set(products.map((p) => p.location))],
    [products],
  );

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: "",
      condition: "",
      sortBy: "newest",
      location: "",
    });
    setSearchTerm("");
    setSelectedCategory("");
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;

      const matchesCondition =
        !filters.condition || product.condition === filters.condition;

      const matchesLocation =
        !filters.location || product.location === filters.location;

      let matchesPrice = true;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange
          .split("-")
          .map((p) => parseInt(p) || 0);
        if (filters.priceRange === "50000+") {
          matchesPrice = product.price >= 50000;
        } else {
          matchesPrice =
            product.price >= min && product.price <= (max || Infinity);
        }
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesCondition &&
        matchesLocation &&
        matchesPrice
      );
    });
  }, [products, searchTerm, selectedCategory, filters]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (filters.sortBy as SortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.seller.rating - a.seller.rating;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });
  }, [filteredProducts, filters.sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filters,
    handleFilterChange,
    clearFilters,
    categories,
    locations,
    sortedProducts,
  };
};
