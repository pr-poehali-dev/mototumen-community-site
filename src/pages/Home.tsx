import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

export const Home = () => {
  const features = [
    {
      icon: "Store",
      title: "Магазин",
      description:
        "Широкий ассортимент мотоэкипировки, запчастей и аксессуаров",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: "Wrench",
      title: "Сервис",
      description: "Профессиональный ремонт и обслуживание мотоциклов",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: "GraduationCap",
      title: "Мотошколы",
      description: "Обучение вождению и повышение квалификации",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: "MessageSquare",
      title: "Объявления",
      description: "Купля-продажа мотоциклов и запчастей",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const events = [
    {
      date: "15 июля",
      title: "Летний мотослёт",
      location: "Парк Гагарина",
      participants: 89,
    },
    {
      date: "22 июля",
      title: "Покатушки по области",
      location: "Сборная площадь",
      participants: 34,
    },
    {
      date: "29 июля",
      title: "Техническая учёба",
      location: "Мотоклуб",
      participants: 56,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 px-4 bg-gradient-to-r from-dark-900 via-dark-800 to-orange-900/20">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto text-center">
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 text-shadow font-['Oswald']">
              МОТО<span className="text-orange-500">ТЮМЕНЬ</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Городское мотосообщество объединяет байкеров Тюмени и области
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 w-full sm:w-auto"
            >
              <Icon name="Send" className="mr-2 h-5 w-5" />
              Войти через Telegram
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 sm:px-8 py-3 w-full sm:w-auto"
            >
              <Icon name="Users" className="mr-2 h-5 w-5" />О сообществе
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-white font-['Oswald']">
            Возможности платформы
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-dark-800 border-dark-700 hover:bg-dark-700 transition-all duration-300 hover-scale"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-3 sm:mb-4`}
                  >
                    <Icon
                      name={feature.icon as any}
                      className="h-6 w-6 sm:h-8 sm:w-8"
                    />
                  </div>
                  <CardTitle className="text-white text-lg sm:text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-400 text-center text-sm sm:text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 sm:py-16 px-4 bg-dark-900/50">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Oswald']">
              Ближайшие события
            </h2>
            <Button
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white w-full sm:w-auto"
            >
              Все события
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {events.map((event, index) => (
              <Card
                key={index}
                className="bg-dark-800 border-dark-700 hover:bg-dark-700 transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge className="bg-orange-500 text-white text-xs sm:text-sm">
                      {event.date}
                    </Badge>
                    <div className="flex items-center text-gray-400">
                      <Icon name="Users" className="h-4 w-4 mr-1" />
                      <span className="text-sm">{event.participants}</span>
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg sm:text-xl leading-tight">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-gray-400">
                    <Icon
                      name="MapPin"
                      className="h-4 w-4 mr-2 flex-shrink-0"
                    />
                    <span className="text-sm sm:text-base">
                      {event.location}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500">
                1,247
              </div>
              <div className="text-gray-400 text-sm sm:text-base">
                Участников
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500">
                89
              </div>
              <div className="text-gray-400 text-sm sm:text-base">
                Мероприятий
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500">
                156
              </div>
              <div className="text-gray-400 text-sm sm:text-base">Товаров</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500">
                23
              </div>
              <div className="text-gray-400 text-sm sm:text-base">Сервиса</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-['Oswald'] px-4">
            Присоединяйтесь к нашему сообществу!
          </h2>
          <p className="text-lg sm:text-xl text-orange-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Станьте частью крупнейшего мотосообщества Тюмени. Общайтесь,
            участвуйте в мероприятиях и развивайтесь вместе с нами.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 px-6 sm:px-8 py-3 w-full sm:w-auto"
            >
              <Icon name="Send" className="mr-2 h-5 w-5" />
              Присоединиться в Telegram
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 px-6 sm:px-8 py-3 w-full sm:w-auto"
            >
              <Icon name="Phone" className="mr-2 h-5 w-5" />
              Связаться с нами
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
