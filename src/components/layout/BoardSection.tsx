import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface BoardItem {
  title: string;
  author: string;
  date: string;
  category: string;
  location?: string;
  price?: string;
  type: "rideshare" | "service" | "announcement";
  description: string;
}

const boardData: BoardItem[] = [
  {
    title: "Ищу попутчиков на Алтай",
    author: "Алексей М.",
    date: "10 апреля",
    category: "Путешествия",
    location: "Тюмень → Алтай",
    type: "rideshare",
    description:
      "Планирую поездку на Алтай в июле. Ищу компанию для совместного путешествия.",
  },
  {
    title: "Техническое обслуживание мотоциклов",
    author: "Сервис Мото+",
    date: "9 апреля",
    category: "ТО и ремонт",
    price: "₽2,000",
    location: "ул. Механическая, 15",
    type: "service",
    description:
      "Качественное ТО вашего мотоцикла. Диагностика, замена масла, настройка.",
  },
  {
    title: "Продаю мотоцикл Honda CBR600",
    author: "Дмитрий К.",
    date: "8 апреля",
    category: "Продажа",
    price: "₽450,000",
    location: "Тюмень",
    type: "announcement",
    description:
      "Продается Honda CBR600RR 2018 года. Состояние отличное, не бита.",
  },
  {
    title: "Ищу инструктора по вождению",
    author: "Анна С.",
    date: "7 апреля",
    category: "Обучение",
    price: "₽1,500",
    location: "Тюмень",
    type: "service",
    description:
      "Начинающий мотоциклист ищет опытного инструктора для дополнительных занятий.",
  },
  {
    title: "Совместная поездка на дачу",
    author: "Максим Р.",
    date: "6 апреля",
    category: "Путешествия",
    location: "Тюмень → Заречный",
    type: "rideshare",
    description: "Еду на дачу в выходные, есть свободное место для попутчика.",
  },
  {
    title: "Продаю мотоэкипировку",
    author: "Игорь М.",
    date: "5 апреля",
    category: "Продажа",
    price: "₽8,500",
    location: "Тюмень",
    type: "announcement",
    description: "Комплект мотоэкипировки: шлем, куртка, перчатки. Размер L.",
  },
];

const getTypeColor = (type: string): string => {
  switch (type) {
    case "rideshare":
      return "bg-blue-500";
    case "service":
      return "bg-green-500";
    case "announcement":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

const getTypeLabel = (type: string): string => {
  switch (type) {
    case "rideshare":
      return "Попутчики";
    case "service":
      return "Услуги";
    case "announcement":
      return "Объявления";
    default:
      return "Прочее";
  }
};

const BoardSection: React.FC = () => {
  const handleViewAllAnnouncements = () => {
    // TODO: Navigate to board page
    console.log("View all announcements clicked");
  };

  const handleContactUser = (author: string) => {
    // TODO: Implement contact functionality
    console.log(`Contact ${author}`);
  };

  const handleViewDetails = (title: string) => {
    // TODO: Implement view details functionality
    console.log(`View details for ${title}`);
  };

  return (
    <section className="py-12 sm:py-16 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Доска объявлений
          </h2>
          <p
            className="text-zinc-400 text-base sm:text-lg"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            Последние объявления от участников сообщества
          </p>
        </div>

        {/* Board Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {boardData.map((item, index) => (
            <Card
              key={index}
              className="bg-zinc-800 border-zinc-700 hover-scale animate-fade-in"
            >
              <CardHeader className="pb-3 p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    className={`${getTypeColor(item.type)} text-white text-xs`}
                  >
                    {getTypeLabel(item.type)}
                  </Badge>
                  <span className="text-xs text-zinc-400">{item.date}</span>
                </div>
                <CardTitle
                  className="text-white text-base sm:text-lg leading-tight"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  {item.title}
                </CardTitle>
                <p
                  className="text-zinc-400 text-sm line-clamp-2"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  {item.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0 p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="User" className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-300">{item.author}</span>
                  </div>

                  {item.location && (
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" className="h-4 w-4 text-zinc-400" />
                      <span className="text-zinc-300 truncate">
                        {item.location}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Icon name="Tag" className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-300">{item.category}</span>
                  </div>

                  {item.price && (
                    <div className="flex items-center gap-2">
                      <Icon name="DollarSign" className="h-4 w-4 text-accent" />
                      <span className="text-accent font-bold">
                        {item.price}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-zinc-700"
                    onClick={() => handleContactUser(item.author)}
                  >
                    <Icon name="MessageCircle" className="h-4 w-4 mr-1" />
                    Написать
                  </Button>
                  <Button
                    size="sm"
                    className="bg-accent hover:bg-accent/90"
                    onClick={() => handleViewDetails(item.title)}
                  >
                    <Icon name="ExternalLink" className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-6 sm:mt-8">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white w-full sm:w-auto"
            onClick={handleViewAllAnnouncements}
          >
            <Icon name="Plus" className="h-5 w-5 mr-2" />
            Посмотреть все объявления
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BoardSection;
