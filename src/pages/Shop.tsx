import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import ShopFilters from "@/components/shop/ShopFilters";
import ProductList from "@/components/shop/ProductList";
import { useProductFilters } from "@/hooks/useProductFilters";
import { mockProducts } from "@/data/mockProducts";
import PageLayout from "@/components/layout/PageLayout";
import { useAuth } from "@/hooks/useAuth";

const Shop = () => {
  const {
    user,
    isAuthenticated,
    isAdmin,
    handleAuth,
    handleLogout,
    handleAdminLogin,
    handleAdminLogout,
    setShowAdminLogin,
    setShowAdminPanel,
  } = useAuth();

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

  return (
    <PageLayout
      user={user}
      isAuthenticated={isAuthenticated}
      isAdmin={isAdmin}
      onAuth={handleAuth}
      onLogout={handleLogout}
      onShowAdminLogin={() => setShowAdminLogin(true)}
      onShowAdminPanel={() => setShowAdminPanel(true)}
    >
      {/* Hero Section for Shop */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url(/img/ce03d6a4-3520-4714-ab06-885f5ee38544.jpg)",
          }}
        ></div>

        {/* Content */}
        <div className="container mx-auto relative z-20">
          <div className="max-w-3xl">
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 text-shadow animate-fade-in"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              МОТО
              <span className="text-accent">МАГАЗИН</span>
            </h1>

            <p
              className="text-xl md:text-2xl text-zinc-300 mb-8 animate-fade-in"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Покупай и продавай мотоэкипировку, запчасти и аксессуары
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white"
                onClick={() =>
                  document
                    .getElementById("shop-content")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Icon name="ShoppingBag" className="h-5 w-5 mr-2" />
                Смотреть товары
              </Button>

              <Button
                size="lg"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                onClick={clearFilters}
              >
                <Icon name="Filter" className="h-5 w-5 mr-2" />
                Все категории
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Content */}
      <section id="shop-content" className="py-16 px-4">
        <div className="container mx-auto">
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
              <div className="mb-6">
                <h2
                  className="text-2xl font-bold mb-2 text-white"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Товары ({sortedProducts.length})
                </h2>
                <p className="text-zinc-400">
                  Найдено товаров: {sortedProducts.length}
                </p>
              </div>

              <ProductList
                products={sortedProducts}
                onContactSeller={handleContactSeller}
                onBuyProduct={handleBuyProduct}
              />
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Shop;
