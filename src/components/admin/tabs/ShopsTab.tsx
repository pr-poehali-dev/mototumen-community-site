import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Shop {
  id?: number;
  name: string;
  description: string;
  category: string;
  image: string;
  rating: number;
  location: string;
  phone: string;
  website: string;
}

const API_URL = "https://functions.poehali.dev/5b8dbbf1-556a-43c8-b39c-e8096eebd5d4";

export const ShopsTab: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);

  const loadShops = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?type=shops`);
      const data = await response.json();
      setShops(data);
    } catch (error) {
      console.error("Error loading shops:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShops();
  }, []);

  const handleSave = async () => {
    if (!editingShop) return;

    try {
      setLoading(true);
      const method = editingShop.id ? "PUT" : "POST";
      await fetch(`${API_URL}?type=shops`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingShop),
      });
      
      await loadShops();
      setEditingShop(null);
    } catch (error) {
      console.error("Error saving shop:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewShop = () => {
    setEditingShop({
      name: "",
      description: "",
      category: "Мотомагазин",
      image: "",
      rating: 0,
      location: "",
      phone: "",
      website: "",
    });
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Магазины ({shops.length})</h3>
        <Button onClick={handleNewShop} className="bg-accent hover:bg-accent/90">
          <Icon name="Plus" className="h-4 w-4 mr-2" />
          Добавить магазин
        </Button>
      </div>

      {editingShop && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">
              {editingShop.id ? "Редактировать" : "Новый"} магазин
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Название"
              value={editingShop.name}
              onChange={(e) => setEditingShop({ ...editingShop, name: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Textarea
              placeholder="Описание"
              value={editingShop.description}
              onChange={(e) => setEditingShop({ ...editingShop, description: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Категория"
              value={editingShop.category}
              onChange={(e) => setEditingShop({ ...editingShop, category: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Изображение URL"
              value={editingShop.image}
              onChange={(e) => setEditingShop({ ...editingShop, image: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Местоположение"
              value={editingShop.location}
              onChange={(e) => setEditingShop({ ...editingShop, location: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Телефон"
              value={editingShop.phone}
              onChange={(e) => setEditingShop({ ...editingShop, phone: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Веб-сайт"
              value={editingShop.website}
              onChange={(e) => setEditingShop({ ...editingShop, website: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700">
                <Icon name="Save" className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
              <Button onClick={() => setEditingShop(null)} variant="outline">
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {loading && shops.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">Загрузка...</p>
        ) : shops.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">Нет магазинов</p>
        ) : (
          shops.map((shop) => (
            <Card key={shop.id} className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{shop.name}</h4>
                    <p className="text-sm text-zinc-400">{shop.category}</p>
                    <p className="text-sm text-zinc-500 mt-1">{shop.location}</p>
                  </div>
                  <Button
                    onClick={() => setEditingShop(shop)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-zinc-700"
                  >
                    <Icon name="Edit" className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
