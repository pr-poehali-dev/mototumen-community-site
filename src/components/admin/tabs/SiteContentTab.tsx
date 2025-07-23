import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";

interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
  };
  stats: {
    users: number;
    events: number;
    rides: number;
    communities: number;
  };
  about: {
    title: string;
    description: string;
  };
  contacts: {
    phone: string;
    email: string;
    address: string;
    telegram: string;
  };
}

export const SiteContentTab: React.FC = () => {
  const [content, setContent] = useState<SiteContent>({
    hero: {
      title: "МОТОТЮМЕНЬ",
      subtitle: "Сообщество мотоциклистов Тюмени",
      description:
        "Объединяем любителей мотоциклов для совместных поездок, событий и общения",
      buttonText: "Присоединиться к сообществу",
    },
    stats: {
      users: 1250,
      events: 85,
      rides: 320,
      communities: 15,
    },
    about: {
      title: "О нас",
      description:
        "Мы - активное сообщество мотоциклистов города Тюмени. Организуем поездки, встречи, помогаем друг другу и делимся опытом. Наша миссия - объединить всех любителей мотоциклов региона.",
    },
    contacts: {
      phone: "+7 (3452) 123-456",
      email: "info@mototyumen.ru",
      address: "г. Тюмень, ул. Республики, 142",
      telegram: "@mototyumen",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const handleSave = () => {
    setIsEditing(false);
    setEditingSection(null);
    // Здесь бы был вызов API для сохранения данных
    console.log("Сохранение контента сайта:", content);
  };

  const handleEdit = (section: string) => {
    setIsEditing(true);
    setEditingSection(section);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingSection(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Контент сайта</h3>
          <p className="text-sm text-zinc-400">
            Редактирование основного контента сайта
          </p>
        </div>
        {isEditing && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <Icon name="X" className="h-4 w-4 mr-2" />
              Отмена
            </Button>
            <Button onClick={handleSave}>
              <Icon name="Save" className="h-4 w-4 mr-2" />
              Сохранить
            </Button>
          </div>
        )}
      </div>

      {/* Hero секция */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Главная секция (Hero)</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit("hero")}
            disabled={isEditing && editingSection !== "hero"}
          >
            <Icon name="Edit" className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300">Заголовок</Label>
              <Input
                value={content.hero.title}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, title: e.target.value },
                  }))
                }
                disabled={!isEditing || editingSection !== "hero"}
                className="bg-zinc-900 border-zinc-600"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Подзаголовок</Label>
              <Input
                value={content.hero.subtitle}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, subtitle: e.target.value },
                  }))
                }
                disabled={!isEditing || editingSection !== "hero"}
                className="bg-zinc-900 border-zinc-600"
              />
            </div>
          </div>
          <div>
            <Label className="text-zinc-300">Описание</Label>
            <Textarea
              value={content.hero.description}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, description: e.target.value },
                }))
              }
              disabled={!isEditing || editingSection !== "hero"}
              className="bg-zinc-900 border-zinc-600"
              rows={3}
            />
          </div>
          <div>
            <Label className="text-zinc-300">Текст кнопки</Label>
            <Input
              value={content.hero.buttonText}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, buttonText: e.target.value },
                }))
              }
              disabled={!isEditing || editingSection !== "hero"}
              className="bg-zinc-900 border-zinc-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Статистика */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Статистика</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit("stats")}
            disabled={isEditing && editingSection !== "stats"}
          >
            <Icon name="Edit" className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-zinc-300">Пользователи</Label>
              <Input
                type="number"
                value={content.stats.users}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    stats: {
                      ...prev.stats,
                      users: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                disabled={!isEditing || editingSection !== "stats"}
                className="bg-zinc-900 border-zinc-600"
              />
            </div>
            <div>
              <Label className="text-zinc-300">События</Label>
              <Input
                type="number"
                value={content.stats.events}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    stats: {
                      ...prev.stats,
                      events: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                disabled={!isEditing || editingSection !== "stats"}
                className="bg-zinc-900 border-zinc-600"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Поездки</Label>
              <Input
                type="number"
                value={content.stats.rides}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    stats: {
                      ...prev.stats,
                      rides: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                disabled={!isEditing || editingSection !== "stats"}
                className="bg-zinc-900 border-zinc-600"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Сообщества</Label>
              <Input
                type="number"
                value={content.stats.communities}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    stats: {
                      ...prev.stats,
                      communities: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                disabled={!isEditing || editingSection !== "stats"}
                className="bg-zinc-900 border-zinc-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* О нас */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">О нас</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit("about")}
            disabled={isEditing && editingSection !== "about"}
          >
            <Icon name="Edit" className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-zinc-300">Заголовок</Label>
            <Input
              value={content.about.title}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  about: { ...prev.about, title: e.target.value },
                }))
              }
              disabled={!isEditing || editingSection !== "about"}
              className="bg-zinc-900 border-zinc-600"
            />
          </div>
          <div>
            <Label className="text-zinc-300">Описание</Label>
            <Textarea
              value={content.about.description}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  about: { ...prev.about, description: e.target.value },
                }))
              }
              disabled={!isEditing || editingSection !== "about"}
              className="bg-zinc-900 border-zinc-600"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Контакты */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Контакты</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit("contacts")}
            disabled={isEditing && editingSection !== "contacts"}
          >
            <Icon name="Edit" className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300">Телефон</Label>
              <Input
                value={content.contacts.phone}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    contacts: { ...prev.contacts, phone: e.target.value },
                  }))
                }
                disabled={!isEditing || editingSection !== "contacts"}
                className="bg-zinc-900 border-zinc-600"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Email</Label>
              <Input
                value={content.contacts.email}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    contacts: { ...prev.contacts, email: e.target.value },
                  }))
                }
                disabled={!isEditing || editingSection !== "contacts"}
                className="bg-zinc-900 border-zinc-600"
              />
            </div>
          </div>
          <div>
            <Label className="text-zinc-300">Адрес</Label>
            <Input
              value={content.contacts.address}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  contacts: { ...prev.contacts, address: e.target.value },
                }))
              }
              disabled={!isEditing || editingSection !== "contacts"}
              className="bg-zinc-900 border-zinc-600"
            />
          </div>
          <div>
            <Label className="text-zinc-300">Telegram</Label>
            <Input
              value={content.contacts.telegram}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  contacts: { ...prev.contacts, telegram: e.target.value },
                }))
              }
              disabled={!isEditing || editingSection !== "contacts"}
              className="bg-zinc-900 border-zinc-600"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
