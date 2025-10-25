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
import { useMediaUpload } from "@/hooks/useMediaUpload";
import Icon from "@/components/ui/icon";

interface ProductFormProps {
  product?: Product;
  onSave: (product: Product) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSave,
}) => {
  const { uploadFile, uploading } = useMediaUpload();
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    let imageUrl = formData.image;

    if (imageFile) {
      const uploadResult = await uploadFile(imageFile, { 
        folder: 'products' 
      });
      
      if (uploadResult) {
        imageUrl = uploadResult.url;
      }
    }

    onSave({ ...formData, image: imageUrl });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image">Фото товара</Label>
        <div className="mt-2">
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-lg border border-zinc-700"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              >
                <Icon name="X" className="h-4 w-4" />
              </button>
            </div>
          )}
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="bg-zinc-800 border-zinc-700"
          />
        </div>
      </div>

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
        disabled={uploading}
        className="w-full bg-accent hover:bg-accent/90"
      >
        {uploading ? (
          <>
            <Icon name="Loader" className="mr-2 h-4 w-4 animate-spin" />
            Загрузка...
          </>
        ) : (
          <>{product ? "Обновить" : "Создать"} товар</>
        )}
      </Button>
    </div>
  );
};