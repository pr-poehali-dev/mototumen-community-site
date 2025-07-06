import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icon from "@/components/ui/icon";
import { Product } from "../types";
import { ProductForm } from "../forms/ProductForm";

interface ProductsTabProps {
  products: Product[];
  onSave: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  onSave,
  onDelete,
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (product: Product) => {
    onSave(product);
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          Управление товарами
        </h3>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAdd}
              className="bg-accent hover:bg-accent/90"
            >
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              Добавить товар
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingProduct ? "Редактировать" : "Добавить"} товар
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct || undefined}
              onSave={handleSave}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{product.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Icon name="MoreHorizontal" className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                    <DropdownMenuItem onClick={() => handleEdit(product)}>
                      <Icon name="Edit" className="h-4 w-4 mr-2" />
                      Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(product.id)}
                      className="text-red-400"
                    >
                      <Icon name="Trash2" className="h-4 w-4 mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="text-zinc-400">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {product.discount && (
                    <Badge
                      variant="secondary"
                      className="bg-accent/20 text-accent"
                    >
                      -{product.discount}%
                    </Badge>
                  )}
                  <span className="text-xl font-bold text-accent">
                    ₽{product.price.toLocaleString()}
                  </span>
                </div>
                <Badge variant={product.inStock ? "default" : "destructive"}>
                  {product.inStock ? "В наличии" : "Нет в наличии"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
