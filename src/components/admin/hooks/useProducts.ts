import { useState } from "react";
import { Product } from "../types";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Мотоэкипировка",
      description: "Шлемы, куртки, перчатки и другая защитная экипировка",
      price: 5999,
      discount: 15,
      category: "equipment",
      inStock: true,
    },
    {
      id: "2",
      name: "Мотошлем AGV",
      description: "Профессиональный шлем для спорта и города",
      price: 25000,
      category: "helmets",
      inStock: true,
    },
  ]);

  const saveProduct = (product: Product) => {
    if (product.id) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts([...products, { ...product, id: Date.now().toString() }]);
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return {
    products,
    saveProduct,
    deleteProduct,
  };
};
