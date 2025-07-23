import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  organizer: string;
  status: "upcoming" | "ongoing" | "ended";
}

const UpcomingEvents = () => {
  const [events] = useState<Event[]>([
    {
      id: "1",
      title: 'Мотопробег "Весенний старт"',
      description:
        "Традиционный весенний мотопробег для всех любителей мотоциклов по живописным местам области.",
      date: "2024-04-15",
      time: "10:00",
      location: "Центральная площадь",
      image: "https://picsum.photos/80/80?random=1",
      category: "Мотопробег",
      organizer: "МОТОТюмень",
      status: "upcoming",
    },
    {
      id: "2",
      title: "Мастер-класс по техническому обслуживанию",
      description:
        "Изучаем основы технического обслуживания мотоциклов с опытными механиками.",
      date: "2024-04-20",
      time: "14:00",
      location: "Сервисный центр",
      image: "https://picsum.photos/80/80?random=2",
      category: "Обучение",
      organizer: 'Сервис-центр "Мото+"',
      status: "upcoming",
    },
    {
      id: "3",
      title: "Соревнования по фигурному вождению",
      description:
        "Соревнования на ловкость и мастерство управления мотоциклом.",
      date: "2024-04-25",
      time: "12:00",
      location: "Автодром",
      image: "https://picsum.photos/80/80?random=3",
      category: "Соревнования",
      organizer: 'Мотоклуб "Скорость"',
      status: "upcoming",
    },
    {
      id: "4",
      title: "Встреча байкеров",
      description: "Неформальная встреча местных байкеров для обмена опытом.",
      date: "2024-04-28",
      time: "18:00",
      location: 'Кафе "Байкер"',
      image: "https://picsum.photos/80/80?random=4",
      category: "Встреча",
      organizer: 'Байк-клуб "Дружба"',
      status: "upcoming",
    },
    {
      id: "5",
      title: "Открытие мотосезона",
      description:
        "Официальное открытие мотосезона с парадом и праздничной программой.",
      date: "2024-05-01",
      time: "11:00",
      location: "Городской парк",
      image: "https://picsum.photos/80/80?random=5",
      category: "Праздник",
      organizer: "Администрация города",
      status: "upcoming",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500";
      case "ongoing":
        return "bg-green-500";
      case "ended":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Предстоящее";
      case "ongoing":
        return "Идёт";
      case "ended":
        return "Завершено";
      default:
        return "Неизвестно";
    }
  };

  const isToday = (dateStr: string) => {
    const today = new Date();
    const eventDate = new Date(dateStr);
    return eventDate.toDateString() === today.toDateString();
  };

  const isTomorrow = (dateStr: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const eventDate = new Date(dateStr);
    return eventDate.toDateString() === tomorrow.toDateString();
  };

  const getDateLabel = (dateStr: string) => {
    if (isToday(dateStr)) return "Сегодня";
    if (isTomorrow(dateStr)) return "Завтра";
    return new Date(dateStr).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
    });
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
              Ближайшие события
            </h1>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Что происходит в мире мотоциклов в ближайшее время
            </p>
          </div>
          <Button className="bg-accent hover:bg-accent/90">
            <Icon name="Calendar" className="h-4 w-4 mr-2" />
            Все события
          </Button>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3
                          className="text-lg font-semibold mb-1"
                          style={{ fontFamily: "Oswald, sans-serif" }}
                        >
                          {event.title}
                        </h3>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline">{event.category}</Badge>
                          <Badge
                            className={`${getStatusColor(event.status)} text-white`}
                          >
                            {getStatusText(event.status)}
                          </Badge>
                          {(isToday(event.date) || isTomorrow(event.date)) && (
                            <Badge className="bg-accent text-white">
                              {getDateLabel(event.date)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Icon name="Share" className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-accent hover:bg-accent/90"
                        >
                          Подробнее
                        </Button>
                      </div>
                    </div>

                    <p
                      className="text-sm text-muted-foreground mb-3"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      {event.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center">
                        <Icon
                          name="Calendar"
                          className="h-4 w-4 mr-1 text-accent"
                        />
                        <span>
                          {getDateLabel(event.date)} в {event.time}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Icon
                          name="MapPin"
                          className="h-4 w-4 mr-1 text-accent"
                        />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Icon
                          name="User"
                          className="h-4 w-4 mr-1 text-accent"
                        />
                        <span>{event.organizer}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-8">
            <Icon
              name="Calendar"
              className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
            />
            <h3 className="text-lg font-semibold mb-2">
              Нет предстоящих событий
            </h3>
            <p className="text-muted-foreground">
              Следите за новостями, скоро появятся новые мероприятия
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;
