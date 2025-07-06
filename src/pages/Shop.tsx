import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import ShopFilters from "@/components/shop/ShopFilters";
import ProductList from "@/components/shop/ProductList";
import { useProductFilters } from "@/hooks/useProductFilters";
import { mockProducts } from "@/data/mockProducts";

const Shop = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filters,
    handleFilterChange,
    clearFilters,
    categories,
    sortedProducts,
  } = useProductFilters(mockProducts);

  const handleContactSeller = (productId: string) => {
    console.log("Связаться с продавцом:", productId);
  };

  const handleBuyProduct = (productId: string) => {
    console.log("Купить товар:", productId);
  };

  const handleSellProduct = () => {
    console.log("Продать товар");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl font-bold mb-2 blue-gradient bg-clip-text text-transparent"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Магазин
            </h1>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Покупай и продавай мотоэкипировку, запчасти и аксессуары
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Icon name="Filter" className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
            <Button
              className="bg-accent hover:bg-accent/90"
              onClick={handleSellProduct}
            >
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              Продать
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Фильтры */}
          <div className="lg:col-span-1">
            <ShopFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              filters={filters}
              handleFilterChange={handleFilterChange}
              clearFilters={clearFilters}
              categories={categories}
            />
          </div>

          {/* Товары */}
          <div className="lg:col-span-3">
            <ProductList
              products={sortedProducts}
              onContactSeller={handleContactSeller}
              onBuyProduct={handleBuyProduct}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
