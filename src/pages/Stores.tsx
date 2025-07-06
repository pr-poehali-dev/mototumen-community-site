import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import StoreCard from "@/components/stores/StoreCard";
import StoreFilters from "@/components/stores/StoreFilters";
import { useStoreFilters } from "@/hooks/useStoreFilters";
import { mockStores } from "@/data/mockStores";

interface StoresProps {
  onStoreClick: (storeId: string) => void;
}

const Stores: React.FC<StoresProps> = ({ onStoreClick }) => {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    clearFilters,
    categories,
    locations,
    sortedStores,
  } = useStoreFilters(mockStores);

  const handleFollowStore = (storeId: string) => {
    console.log("Подписаться на магазин:", storeId);
  };

  const handleCreateStore = () => {
    console.log("Создать магазин");
  };

  const featuredStores = sortedStores.filter((store) => store.featured);
  const regularStores = sortedStores.filter((store) => !store.featured);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-foreground"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Магазины
            </h1>
            <p
              className="text-sm sm:text-base text-muted-foreground"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Найдите лучшие мотомагазины и сервисы в вашем городе
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <Icon name="Filter" className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
            <Button
              className="bg-accent hover:bg-accent/90 w-full sm:w-auto"
              onClick={handleCreateStore}
            >
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              Создать магазин
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Фильтры */}
          <div className="lg:col-span-1">
            <StoreFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              handleFilterChange={handleFilterChange}
              clearFilters={clearFilters}
              categories={categories}
              locations={locations}
            />
          </div>

          {/* Магазины */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Найдено магазинов: {sortedStores.length}
              </p>
              <div className="flex items-center gap-2 justify-end">
                <Button variant="outline" size="sm">
                  <Icon name="Grid3x3" className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="List" className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Рекомендуемые магазины */}
            {featuredStores.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h2
                  className="text-xl sm:text-2xl font-bold mb-4 text-foreground"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Рекомендуемые
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {featuredStores.map((store) => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      onStoreClick={onStoreClick}
                      onFollowStore={handleFollowStore}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Все магазины */}
            {regularStores.length > 0 && (
              <div>
                <h2
                  className="text-xl sm:text-2xl font-bold mb-4 text-foreground"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Все магазины
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {regularStores.map((store) => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      onStoreClick={onStoreClick}
                      onFollowStore={handleFollowStore}
                    />
                  ))}
                </div>
              </div>
            )}

            {sortedStores.length === 0 && (
              <div className="text-center py-12">
                <Icon
                  name="Store"
                  className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground"
                />
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Магазины не найдены
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Попробуйте изменить параметры поиска или фильтры
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stores;
