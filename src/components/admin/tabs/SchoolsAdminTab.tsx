import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface School {
  id?: number;
  name: string;
  description: string;
  category: string;
  image: string;
  rating: number;
  hours: string;
  location: string;
  phone: string;
  price: string;
  website: string;
  courses?: string[];
}

const API_URL = "https://functions.poehali.dev/5b8dbbf1-556a-43c8-b39c-e8096eebd5d4";

export const SchoolsAdminTab: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(false);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?type=schools`);
      const data = await response.json();
      setSchools(data);
    } catch (error) {
      console.error("Error loading schools:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const handleSave = async () => {
    if (!editingSchool) return;

    try {
      setLoading(true);
      const method = editingSchool.id ? "PUT" : "POST";
      const response = await fetch(`${API_URL}?type=schools`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSchool),
      });
      
      if (response.ok) {
        await loadSchools();
        setEditingSchool(null);
      } else {
        const error = await response.json();
        console.error("Error saving school:", error);
        alert("Ошибка сохранения: " + (error.error || "неизвестная ошибка"));
      }
    } catch (error) {
      console.error("Error saving school:", error);
      alert("Не удалось подключиться к серверу");
    } finally {
      setLoading(false);
    }
  };

  const handleNewSchool = () => {
    setEditingSchool({
      name: "",
      description: "",
      category: "Автошкола",
      image: "",
      rating: 0,
      hours: "",
      location: "",
      phone: "",
      price: "",
      website: "",
      courses: [],
    });
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Мотошколы ({schools.length})</h3>
        <Button onClick={handleNewSchool} className="bg-accent hover:bg-accent/90">
          <Icon name="Plus" className="h-4 w-4 mr-2" />
          Добавить школу
        </Button>
      </div>

      {editingSchool && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">
              {editingSchool.id ? "Редактировать" : "Новая"} школа
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Название"
              value={editingSchool.name}
              onChange={(e) => setEditingSchool({ ...editingSchool, name: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Textarea
              placeholder="Описание"
              value={editingSchool.description}
              onChange={(e) => setEditingSchool({ ...editingSchool, description: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Время работы"
              value={editingSchool.hours}
              onChange={(e) => setEditingSchool({ ...editingSchool, hours: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Цена"
              value={editingSchool.price}
              onChange={(e) => setEditingSchool({ ...editingSchool, price: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Местоположение"
              value={editingSchool.location}
              onChange={(e) => setEditingSchool({ ...editingSchool, location: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Телефон"
              value={editingSchool.phone}
              onChange={(e) => setEditingSchool({ ...editingSchool, phone: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700">
                <Icon name="Save" className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
              <Button onClick={() => setEditingSchool(null)} variant="outline">
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {loading && schools.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">Загрузка...</p>
        ) : schools.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">Нет школ</p>
        ) : (
          schools.map((school) => (
            <Card key={school.id} className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{school.name}</h4>
                    <p className="text-sm text-zinc-400">{school.price}</p>
                    <p className="text-sm text-zinc-500 mt-1">{school.location}</p>
                  </div>
                  <Button
                    onClick={() => setEditingSchool(school)}
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