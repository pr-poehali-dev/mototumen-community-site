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
    title: "ЗДЕСЬ МОЖЕТ БЫТЬ ВАШЕ ОБЯВЛЕНИЕ О СОВМЕСТНОМ ПУТИШЕСТВИИ",
    author: "ФИО",
    date: "ДАТА",
    category: "Попутчики",
    location: "МЕСТОПОЛОЖЕНИЕ",
    type: "rideshare",
    description:
      "ПО ВОПРОСАМ РАЗМЕЩЕНИЯ ОБЬЯВЛЕНИЯ ОБРАЩАТЬСЯ В Telegram К @anthony_genevezy",
  },
  {
    title: "ЗДЕСЬ МОЖЕТ БЫТЬ ВАШЕ ОБЯВЛЕНИЕ О ВАШЕМ СЕРВИСЕ.",
    author: "ФИО",
    date: "ДАТА",
    category: "ТО и Сервис",
    location: "МЕСТОПОЛОЖЕНИЕ",
    price: "₽2,000",
    type: "service",
    description:
      "ПО ВОПРОСАМ РАЗМЕЩЕНИЯ ОБЬЯВЛЕНИЯ ОБРАЩАТЬСЯ В Telegram К @anthony_genevezy",
  },
  {
    title: "ЗДЕСЬ МОЖЕТ БЫТЬ ВАШЕ ОБЯВЛЕНИЕ О ПРОДАЖЕ ВАШЕГО МОТОЦИКЛА.",
    author: "ФИО",
    date: "ДАТА",
    category: "Продажа",
    price: "₽450,000",
    location: "МЕСТОПОЛОЖЕНИЕ",
    type: "announcement",
    description:
      "ПО ВОПРОСАМ РАЗМЕЩЕНИЯ ОБЬЯВЛЕНИЯ ОБРАЩАТЬСЯ В Telegram К @anthony_genevezy.",
  },
  {
    title: "ЗДЕСЬ МОЖЕТ БЫТЬ ВАШЕ ОБЯВЛЕНИЕ О ПОИСКЕ ИНСТРУКТОРА ПО ВОЖДЕНИЮ. ",
    author: "ФИО",
    date: "ДАТА",
    category: "Обучение",
    price: "₽1,500",
    location: "МЕСТОПОЛОЖЕНИЕ",
    type: "service",
    description:
      "ПО ВОПРОСАМ РАЗМЕЩЕНИЯ ОБЬЯВЛЕНИЯ ОБРАЩАТЬСЯ В Telegram К @anthony_genevezy.",
  },
  {
    title: "ЗДЕСЬ МОЖЕТ БЫТЬ ВАШЕ ОБЯВЛЕНИЕ О ПРЕДОСТАВЛЕНИИ ВАШЕЙ УСЛУГЕ ПО ЭВАКУАЦИИ МОТОЦИКЛОВ/СНЕГОХОДОВ/КВАДРОЦИКЛОВ.",
    author: "ФИО",
    date: "ДАТА",
    category: "Эвакуатор",
    price: "₽1,500",
    type: "service",
    description:
      "ПО ВОПРОСАМ РАЗМЕЩЕНИЯ ОБЬЯВЛЕНИЯ ОБРАЩАТЬСЯ В Telegram К @anthony_genevezy.",
  },
  {
    title: "ЗДЕСЬ МОЖЕТ БЫТЬ ВАШЕ ОБЯВЛЕНИЕ О ПРОДАЖЕ ВАШЕЙ МОТО-ЭКИПИРОВКИ.",
    author: "ФИО",
    date: "ДАТА",
    category: "Продажа",
    price: "₽12,000",
    location: "МЕСТОПОЛОЖЕНИЕ",
    type: "announcement",
    description:
      "ПО ВОПРОСАМ РАЗМЕЩЕНИЯ ОБЬЯВЛЕНИЯ ОБРАЩАТЬСЯ В Telegram К @anthony_genevezy.",
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
    <section className="py-6 sm:py-8 md:py-16 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Доска PREMIUM объявлений
          </h2>
          <p
            className="text-zinc-400 text-sm sm:text-base md:text-lg"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            Объявления от участников сообщества
          </p>
        </div>

        {/* Board Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {boardData.map((item, index) => (
            <Card
              key={index}
              className="bg-zinc-800 border-zinc-700 hover-scale animate-fade-in"
            >
              <CardHeader className="pb-3 p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    className={`${getTypeColor(item.type)} text-white text-xs`}
                  >
                    {getTypeLabel(item.type)}
                  </Badge>
                  <span className="text-xs text-zinc-400">{item.date}</span>
                </div>
                <CardTitle
                  className="text-white text-sm sm:text-base md:text-lg leading-tight"
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

              <CardContent className="pt-0 p-3 sm:p-4">
                <div className="space-y-2 text-xs sm:text-sm">
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
        <div className="text-center mt-4 sm:mt-6 md:mt-8">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white w-full sm:w-auto"
            onClick={handleViewAllAnnouncements}
          >
            <Icon name="Plus" className="h-5 w-5 mr-2" />
            Перейти ко всем объявлениям
          </Button
                      size="lg"
            className="bg-accent hover:bg-accent/90 text-white w-full sm:w-auto"
            onClick={handleViewAllAnnouncements}
            >
        </div>
      </div>
    </section>
  );
};

export default BoardSection;