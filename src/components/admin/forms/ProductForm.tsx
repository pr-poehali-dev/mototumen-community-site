import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "../types";

interface ProductFormProps {
  product?: Product;
  onSave: (product: Product) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSave,
}) => {
  const [formData, setFormData] = useState<Product>(
    product || {
      id: "",
      name: "",
      description: "",
      price: 0,
      discount: 0,
      category: "",
      inStock: true,
    },
  );

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Название</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-zinc-800 border-zinc-700"
          />
        </div>
        <div>
          <Label htmlFor="category">Категория</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="equipment">Экипировка</SelectItem>
              <SelectItem value="helmets">Шлемы</SelectItem>
              <SelectItem value="parts">Запчасти</SelectItem>
              <SelectItem value="accessories">Аксессуары</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="bg-zinc-800 border-zinc-700"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Цена (₽)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseInt(e.target.value) })
            }
            className="bg-zinc-800 border-zinc-700"
          />
        </div>
        <div>
          <Label htmlFor="discount">Скидка (%)</Label>
          <Input
            id="discount"
            type="number"
            value={formData.discount || 0}
            onChange={(e) =>
              setFormData({ ...formData, discount: parseInt(e.target.value) })
            }
            className="bg-zinc-800 border-zinc-700"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="inStock"
          checked={formData.inStock}
          onChange={(e) =>
            setFormData({ ...formData, inStock: e.target.checked })
          }
          className="w-4 h-4 text-accent"
        />
        <Label htmlFor="inStock">В наличии</Label>
      </div>
      <Button
        onClick={handleSubmit}
        className="w-full bg-accent hover:bg-accent/90"
      >
        {product ? "Обновить" : "Создать"} товар
      </Button>
    </div>
  );
};
