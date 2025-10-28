import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BoardItem {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  image?: string;
  price?: number;
  location?: string;
  contact: string;
  type: "rideshare" | "service" | "announcement";
  status: "active" | "closed";
}

interface CreateBoardItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<BoardItem>;
  onFormChange: (field: string, value: any) => void;
  onSubmit: () => void;
  categories: string[];
}

export default function CreateBoardItemDialog({
  isOpen,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  categories,
}: CreateBoardItemDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Icon name="Plus" className="h-4 w-4 mr-2" />
          Создать объявление
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать объявление</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">Тип объявления</Label>
            <Select
              value={formData.type || "announcement"}
              onValueChange={(value) => onFormChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rideshare">Попутчик</SelectItem>
                <SelectItem value="service">Услуга</SelectItem>
                <SelectItem value="announcement">Объявление</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => onFormChange("title", e.target.value)}
              placeholder="Введите название"
            />
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => onFormChange("description", e.target.value)}
              placeholder="Расскажите подробнее"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="category">Категория</Label>
            <Select
              value={formData.category || ""}
              onValueChange={(value) => onFormChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
                <SelectItem value="new">Другая категория</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Цена (₽)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ""}
                onChange={(e) =>
                  onFormChange("price", parseInt(e.target.value) || undefined)
                }
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="location">Местоположение</Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) => onFormChange("location", e.target.value)}
                placeholder="Город, адрес"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contact">Контакт</Label>
            <Input
              id="contact"
              value={formData.contact || ""}
              onChange={(e) => onFormChange("contact", e.target.value)}
              placeholder="Telegram, телефон или email"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onSubmit} className="flex-1">
              Опубликовать
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
