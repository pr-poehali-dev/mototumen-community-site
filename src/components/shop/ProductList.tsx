import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface ProductListProps {
  products: Product[];
  onContactSeller?: (productId: string) => void;
  onBuyProduct?: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onContactSeller,
  onBuyProduct,
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon
          name="Package"
          className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
        />
        <h3 className="text-lg font-semibold mb-2">Товары не найдены</h3>
        <p className="text-muted-foreground">
          Попробуйте изменить параметры поиска или фильтры
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Найдено товаров: {products.length}
        </p>
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Icon name="Grid3x3" className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="List" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onContactSeller={onContactSeller}
            onBuyProduct={onBuyProduct}
          />
        ))}
      </div>
    </>
  );
};

export default ProductList;
