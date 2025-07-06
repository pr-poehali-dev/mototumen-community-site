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
      <section className="relative py-20 px-4 bg-gradient-to-r from-dark-900 via-dark-800 to-orange-900/20">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto text-center">
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-shadow font-['Oswald']">
              МОТО<span className="text-orange-500">ТЮМЕНЬ</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Городское мотосообщество объединяет байкеров Тюмени и области
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
            >
              <Icon name="Send" className="mr-2 h-5 w-5" />
              Войти через Telegram
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3"
            >
              <Icon name="Users" className="mr-2 h-5 w-5" />О сообществе
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white font-['Oswald']">
            Возможности платформы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-dark-800 border-dark-700 hover:bg-dark-700 transition-all duration-300 hover-scale"
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon name={feature.icon as any} className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-white text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-4 bg-dark-900/50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white font-['Oswald']">
              Ближайшие события
            </h2>
            <Button
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            >
              Все события
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <Card
                key={index}
                className="bg-dark-800 border-dark-700 hover:bg-dark-700 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge className="bg-orange-500 text-white">
                      {event.date}
                    </Badge>
                    <div className="flex items-center text-gray-400">
                      <Icon name="Users" className="h-4 w-4 mr-1" />
                      <span className="text-sm">{event.participants}</span>
                    </div>
                  </div>
                  <CardTitle className="text-white">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-gray-400">
                    <Icon name="MapPin" className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-orange-500">1,247</div>
              <div className="text-gray-400">Участников</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-orange-500">89</div>
              <div className="text-gray-400">Мероприятий</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-orange-500">156</div>
              <div className="text-gray-400">Товаров</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-orange-500">23</div>
              <div className="text-gray-400">Сервиса</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-['Oswald']">
            Присоединяйтесь к нашему сообществу!
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Станьте частью крупнейшего мотосообщества Тюмени. Общайтесь,
            участвуйте в мероприятиях и развивайтесь вместе с нами.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3"
            >
              <Icon name="Send" className="mr-2 h-5 w-5" />
              Присоединиться в Telegram
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3"
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
