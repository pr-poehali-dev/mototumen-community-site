import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Announcement {
  id?: number;
  title: string;
  description: string;
  category: string;
  image: string;
  author: string;
  contact: string;
  price: string;
  location: string;
  status: string;
}

const API_URL = "https://functions.poehali.dev/5b8dbbf1-556a-43c8-b39c-e8096eebd5d4";

export const AnnouncementsAdminTab: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?type=announcements`);
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error loading announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleSave = async () => {
    if (!editingAnnouncement) return;

    try {
      setLoading(true);
      const method = editingAnnouncement.id ? "PUT" : "POST";
      await fetch(`${API_URL}?type=announcements`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAnnouncement),
      });
      
      await loadAnnouncements();
      setEditingAnnouncement(null);
    } catch (error) {
      console.error("Error saving announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnnouncement = () => {
    setEditingAnnouncement({
      title: "",
      description: "",
      category: "Общее",
      image: "",
      author: "",
      contact: "",
      price: "",
      location: "",
      status: "active",
    });
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Объявления ({announcements.length})</h3>
        <Button onClick={handleNewAnnouncement} className="bg-accent hover:bg-accent/90">
          <Icon name="Plus" className="h-4 w-4 mr-2" />
          Добавить объявление
        </Button>
      </div>

      {editingAnnouncement && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">
              {editingAnnouncement.id ? "Редактировать" : "Новое"} объявление
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Заголовок"
              value={editingAnnouncement.title}
              onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Textarea
              placeholder="Описание"
              value={editingAnnouncement.description}
              onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, description: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Категория"
              value={editingAnnouncement.category}
              onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, category: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Автор"
              value={editingAnnouncement.author}
              onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, author: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Контакт"
              value={editingAnnouncement.contact}
              onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, contact: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Цена"
              value={editingAnnouncement.price}
              onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, price: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Input
              placeholder="Местоположение"
              value={editingAnnouncement.location}
              onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, location: e.target.value })}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700">
                <Icon name="Save" className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
              <Button onClick={() => setEditingAnnouncement(null)} variant="outline">
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {loading && announcements.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">Загрузка...</p>
        ) : announcements.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">Нет объявлений</p>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{announcement.title}</h4>
                    <p className="text-sm text-zinc-400">{announcement.category}</p>
                    <p className="text-sm text-zinc-500 mt-1">{announcement.price}</p>
                  </div>
                  <Button
                    onClick={() => setEditingAnnouncement(announcement)}
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
