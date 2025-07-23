import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  description: string;
  available: string;
  type: "emergency" | "evacuation" | "legal";
  location?: string;
}

const EmergencyContacts = () => {
  const [contacts] = useState<EmergencyContact[]>([
    {
      id: "1",
      name: "Служба экстренного реагирования",
      phone: "112",
      description: "Единая служба экстренного реагирования",
      available: "24/7",
      type: "emergency",
    },
    {
      id: "2",
      name: "Скорая помощь",
      phone: "103",
      description: "Медицинская помощь при ДТП и травмах",
      available: "24/7",
      type: "emergency",
    },
    {
      id: "3",
      name: "ГИБДД",
      phone: "102",
      description: "Дорожно-транспортные происшествия",
      available: "24/7",
      type: "emergency",
    },
    {
      id: "4",
      name: "Пожарная служба",
      phone: "101",
      description: "Пожары и чрезвычайные ситуации",
      available: "24/7",
      type: "emergency",
    },
    {
      id: "5",
      name: 'Эвакуатор "Быстрый"',
      phone: "+7 (3452) 555-111",
      description: "Эвакуация мотоциклов и легковых автомобилей",
      available: "24/7",
      type: "evacuation",
      location: "Центральный район",
    },
    {
      id: "6",
      name: 'Эвакуатор "Мото-Помощь"',
      phone: "+7 (3452) 555-222",
      description: "Специализированная эвакуация мотоциклов",
      available: "8:00 - 22:00",
      type: "evacuation",
      location: "Восточный район",
    },
    {
      id: "7",
      name: "Техпомощь на дороге",
      phone: "+7 (3452) 555-333",
      description: "Мелкий ремонт и запуск двигателя",
      available: "9:00 - 21:00",
      type: "evacuation",
      location: "Весь город",
    },
    {
      id: "8",
      name: 'Юридическая консультация "Авто-Право"',
      phone: "+7 (3452) 777-111",
      description: "Помощь при ДТП, оформление документов",
      available: "9:00 - 18:00",
      type: "legal",
      location: "ул. Советская, 15",
    },
    {
      id: "9",
      name: "Адвокат Петров А.В.",
      phone: "+7 (3452) 777-222",
      description: "Защита прав водителей в суде",
      available: "По записи",
      type: "legal",
      location: "пр. Ленина, 23",
    },
    {
      id: "10",
      name: "Страховые консультации",
      phone: "+7 (3452) 777-333",
      description: "Оформление страховых случаев",
      available: "9:00 - 18:00",
      type: "legal",
      location: "ул. Республики, 45",
    },
  ]);

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "emergency":
        return {
          title: "Экстренные службы",
          color: "bg-red-500",
          icon: "AlertTriangle",
        };
      case "evacuation":
        return {
          title: "Эвакуация и помощь",
          color: "bg-blue-500",
          icon: "Truck",
        };
      case "legal":
        return {
          title: "Юридическая помощь",
          color: "bg-amber-600",
          icon: "Scale",
        };
      default:
        return {
          title: "Контакты",
          color: "bg-gray-500",
          icon: "Phone",
        };
    }
  };

  const groupedContacts = contacts.reduce(
    (acc, contact) => {
      if (!acc[contact.type]) {
        acc[contact.type] = [];
      }
      acc[contact.type].push(contact);
      return acc;
    },
    {} as Record<string, EmergencyContact[]>,
  );

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Экстренные контакты
            </h1>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Важные телефоны для экстренных ситуаций на дороге
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedContacts).map(([type, contactList]) => {
            const config = getTypeConfig(type);
            return (
              <div key={type}>
                <div className="flex items-center mb-4">
                  <Icon
                    name={config.icon}
                    className={`h-6 w-6 mr-3 text-white p-1 rounded ${config.color}`}
                  />
                  <h2
                    className="text-2xl font-bold"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    {config.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contactList.map((contact) => (
                    <Card
                      key={contact.id}
                      className={`border-l-4 ${config.color} hover:shadow-lg transition-shadow`}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle
                          className="text-lg"
                          style={{ fontFamily: "Oswald, sans-serif" }}
                        >
                          {contact.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p
                          className="text-sm text-muted-foreground mb-3"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          {contact.description}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm">
                            <Icon
                              name="Clock"
                              className="h-4 w-4 mr-2 text-accent"
                            />
                            <span>{contact.available}</span>
                          </div>
                          {contact.location && (
                            <div className="flex items-center text-sm">
                              <Icon
                                name="MapPin"
                                className="h-4 w-4 mr-2 text-accent"
                              />
                              <span>{contact.location}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-accent">
                            {contact.phone}
                          </div>
                          <Button
                            className={`${config.color} hover:opacity-90`}
                            size="sm"
                            onClick={() => handleCall(contact.phone)}
                          >
                            <Icon name="Phone" className="h-4 w-4 mr-1" />
                            Позвонить
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <div className="flex items-start gap-4">
            <Icon name="Info" className="h-6 w-6 text-accent mt-1" />
            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Важная информация
              </h3>
              <div
                className="space-y-2 text-sm"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                <p>
                  • При ДТП в первую очередь обратитесь в службу экстренного
                  реагирования (112)
                </p>
                <p>
                  • Сохраняйте спокойствие и не покидайте место происшествия
                </p>
                <p>
                  • Зафиксируйте все обстоятельства и получите справку о ДТП
                </p>
                <p>• Для быстрой помощи сохраните эти номера в телефоне</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
