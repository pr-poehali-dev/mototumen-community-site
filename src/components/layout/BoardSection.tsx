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
  contactLink: string; // Новая поле для ссылки "Написать"
  detailsLink: string; // Новая поле для ссылки "Перейти"
}

const boardData: BoardItem[] = [
  // КАРТОЧКА №1
  {
    title: "ЗДЕСЬ МОЖЕТ БЫТЬ ВАШЕ ОБЯВЛЕНИЕ О СОВМЕСТНОМ ПУТИШЕСТВИИ",
    author: "ФИО",
    date: "ДАТА",
    category: "Попутчики",
    location: "МЕСТОПОЛОЖЕНИЕ",
    type: "rideshare",
    description:
      "ПО ВОПРОСАМ РАЗМЕЩЕНИЯ ОБЬЯВЛЕНИЯ ОБРАЩАТЬСЯ В Telegram К @anthony_genevezy",
    contactLink: "https://t.me/anthony_genevezy1",
    detailsLink: "https://t.me/anthony_genevezy_details1",
  },
  // КАРТОЧКА №2
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
    contactLink: "https://t.me/anthony_genevezy2",
    detailsLink: "https://t.me/anthony_genevezy_details2",
  },
  // КАРТОЧКА №3
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
    contactLink: "https://t.me/anthony_genevezy3",
    detailsLink: "https://t.me/anthony_genevezy_details3",
  },
  // КАРТОЧКА №4
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
    contactLink: "https://t.me/anthony_genevezy4",
    detailsLink: "https://t.me/anthony_genevezy_details4",
  },
  // КАРТОЧКА №5
  {
    title:
      "ЗДЕСЬ МОЖЕТ БЫТЬ ВАШЕ ОБЯВЛЕНИЕ О ПРЕДОСТАВЛЕНИИ ВАШЕЙ УСЛУГЕ ПО ЭВАКУАЦИИ МОТОЦИКЛОВ/СНЕГОХОДОВ/КВАДРОЦИКЛОВ.",
    author: "ФИО",
    date: "ДАТА",
    category: "Эвакуатор",
    price: "₽1,500",
    type: "service",
    description:
      "ПО ВОПРОСАМ РАЗМЕЩЕНИЯ ОБЬЯВЛЕНИЯ ОБРАЩАТЬСЯ В Telegram К @anthony_genevezy.",
    contactLink: "https://t.me/anthony_genevezy5",
    detailsLink: "https://t.me/anthony_genevezy_details5",
  },
  // КАРТОЧКА №6
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
    contactLink: "https://t.me/anthony_genevezy6",
    detailsLink: "https://t.me/anthony_genevezy_details6",
  },
];

// ... остальные функции getTypeColor и getTypeLabel без изменений ...

const BoardSection: React.FC = () => {
  const handleViewAllAnnouncements = () => {
    window.open("https://t.me/anthony_genevezy", "_blank");
  };

  return (
    <section className="py-6 sm:py-8 md:py-16 px-4">
      <div className="container mx-auto">
        {/* ... Section Header без изменений ... */}

        {/* Board Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {boardData.map((item, index) => {
            const cardNumber = index + 1;
            return (
              <Card
                key={index}
                className="bg-zinc-800 border-zinc-700 hover-scale animate-fade-in relative"
              >
                {/* Номер карточки */}
                <Badge className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full z-10">
                  {cardNumber}
                </Badge>

                {/* ... CardHeader без изменений ... */}

                <CardContent className="pt-0 p-3 sm:p-4">
                  {/* ... Детали карточки без изменений ... */}

                  <div className="flex gap-2 mt-4">
                    {/* Кнопка "Написать" с уникальной ссылкой для карточки */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-zinc-700"
                      onClick={() => window.open(item.contactLink, "_blank")}
                    >
                      <Icon name="MessageCircle" className="h-4 w-4 mr-1" />
                      Написать
                    </Button>

                    {/* Кнопка "Перейти" с уникальной ссылкой для карточки */}
                    <Button
                      size="sm"
                      className="bg-accent hover:bg-accent/90"
                      onClick={() => window.open(item.detailsLink, "_blank")}
                    >
                      <Icon name="ExternalLink" className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ... View All Button без изменений ... */}
      </div>
    </section>
  );
};

export default BoardSection;
