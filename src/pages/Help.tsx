import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  description: string;
  category: string;
  available: string;
  priority: "high" | "medium" | "low";
}

interface EvacuationService {
  id: string;
  name: string;
  phone: string;
  description: string;
  coverage: string;
  price: string;
  rating: number;
  responseTime: string;
  features: string[];
}

interface LegalService {
  id: string;
  name: string;
  phone: string;
  email?: string;
  description: string;
  specialization: string[];
  experience: string;
  price: string;
  rating: number;
  consultationFree: boolean;
}

const Help = () => {
  const [activeTab, setActiveTab] = useState("emergency");

  const emergencyContacts: EmergencyContact[] = [
    {
      id: "1",
      name: "Служба экстренного реагирования",
      phone: "112",
      description: "Единый номер экстренных служб",
      category: "Экстренные службы",
      available: "24/7",
      priority: "high",
    },
    {
      id: "2",
      name: "Скорая помощь",
      phone: "103",
      description: "Медицинская помощь при авариях",
      category: "Медицинская помощь",
      available: "24/7",
      priority: "high",
    },
    {
      id: "3",
      name: "Пожарная служба",
      phone: "101",
      description: "При пожаре или задымлении",
      category: "Пожарная служба",
      available: "24/7",
      priority: "high",
    },
    {
      id: "4",
      name: "Полиция",
      phone: "102",
      description: "При ДТП, кражах, нарушениях",
      category: "Полиция",
      available: "24/7",
      priority: "high",
    },
    {
      id: "5",
      name: "ГИБДД Тюмень",
      phone: "+7 (3452) 46-84-92",
      description: "Дежурная часть ГИБДД",
      category: "ГИБДД",
      available: "24/7",
      priority: "medium",
    },
    {
      id: "6",
      name: "Газовая служба",
      phone: "104",
      description: "При запахе газа, утечке",
      category: "Газовая служба",
      available: "24/7",
      priority: "high",
    },
    {
      id: "7",
      name: 'Служба эвакуации "Автоспас"',
      phone: "+7 (3452) 555-911",
      description: "Эвакуация мотоциклов и автомобилей",
      category: "Эвакуация",
      available: "24/7",
      priority: "medium",
    },
    {
      id: "8",
      name: "Техпомощь на дороге",
      phone: "+7 (3452) 444-777",
      description: "Выездная техническая помощь",
      category: "Техпомощь",
      available: "8:00-22:00",
      priority: "low",
    },
  ];

  const evacuationServices: EvacuationService[] = [
    {
      id: "1",
      name: "Эвакуатор 24/7",
      phone: "+7 (3452) 555-911",
      description:
        "Профессиональная эвакуация мотоциклов и автомобилей. Опытные водители, современное оборудование.",
      coverage: "Тюмень и область (до 50 км)",
      price: "от 2000 ₽",
      rating: 4.8,
      responseTime: "15-30 мин",
      features: [
        "24/7",
        "Спецплатформы для мотоциклов",
        "Страховка груза",
        "Наличный/безналичный расчет",
      ],
    },
    {
      id: "2",
      name: "Автоспас Тюмень",
      phone: "+7 (3452) 777-999",
      description:
        "Быстрая эвакуация и техпомощь на дороге. Работаем со всеми видами транспорта.",
      coverage: "Тюмень (в пределах ЕКАД)",
      price: "от 1500 ₽",
      rating: 4.6,
      responseTime: "20-40 мин",
      features: [
        "Круглосуточно",
        "Техпомощь на месте",
        "Мобильная диагностика",
        "Запчасти в наличии",
      ],
    },
    {
      id: "3",
      name: "Мото-Эвакуатор",
      phone: "+7 (3452) 333-555",
      description:
        "Специализируемся на эвакуации мотоциклов. Знаем все особенности транспортировки мототехники.",
      coverage: "Тюмень и пригород",
      price: "от 1800 ₽",
      rating: 4.9,
      responseTime: "10-25 мин",
      features: [
        "Специализация на мотоциклах",
        "Мягкие крепления",
        "Защита от повреждений",
        "Консультации",
      ],
    },
    {
      id: "4",
      name: "Техпомощь Профи",
      phone: "+7 (3452) 666-111",
      description:
        "Выездная техническая помощь и эвакуация. Собственная служба диагностики.",
      coverage: "Тюмень и область",
      price: "от 2500 ₽",
      rating: 4.5,
      responseTime: "25-45 мин",
      features: [
        "Выездная диагностика",
        "Мелкий ремонт на месте",
        "Запчасти",
        "Гарантия на работы",
      ],
    },
  ];

  const legalServices: LegalService[] = [
    {
      id: "1",
      name: 'Юридическая фирма "Автоправо"',
      phone: "+7 (3452) 555-123",
      email: "info@autopravo-tmn.ru",
      description:
        "Специализируемся на делах, связанных с ДТП, страховыми выплатами и автоправом.",
      specialization: [
        "ДТП",
        "Страховые споры",
        "Лишение прав",
        "Административные нарушения",
      ],
      experience: "8 лет",
      price: "от 3000 ₽",
      rating: 4.7,
      consultationFree: true,
    },
    {
      id: "2",
      name: "Адвокат Петров А.В.",
      phone: "+7 (3452) 777-456",
      email: "petrov.av@lawyer.ru",
      description:
        "Защита прав автомобилистов и мотоциклистов. Опыт работы в судах всех инстанций.",
      specialization: [
        "Уголовные дела",
        "Административные дела",
        "Возмещение ущерба",
      ],
      experience: "12 лет",
      price: "от 5000 ₽",
      rating: 4.9,
      consultationFree: false,
    },
    {
      id: "3",
      name: 'Коллегия адвокатов "Защита"',
      phone: "+7 (3452) 333-789",
      email: "info@defense-law.ru",
      description: "Комплексная правовая защита участников дорожного движения.",
      specialization: ["ДТП", "Автострахование", "Техосмотр", "Регистрация ТС"],
      experience: "15 лет",
      price: "от 4000 ₽",
      rating: 4.6,
      consultationFree: true,
    },
    {
      id: "4",
      name: 'Юридическая помощь "Мото-Лига"',
      phone: "+7 (3452) 888-222",
      email: "help@moto-liga.ru",
      description:
        "Специализируемся на правовой поддержке мотоциклистов. Понимаем специфику мототранспорта.",
      specialization: [
        "Мотоциклы",
        "Тюнинг",
        "Сезонная эксплуатация",
        "Мотосообщества",
      ],
      experience: "5 лет",
      price: "от 2500 ₽",
      rating: 4.8,
      consultationFree: true,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Экстренно";
      case "medium":
        return "Важно";
      case "low":
        return "Обычно";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold mb-2 blue-gradient bg-clip-text text-transparent"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Помощь
          </h1>
          <p
            className="text-muted-foreground"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            Экстренные службы, эвакуация и юридическая поддержка
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="emergency">Экстренные службы</TabsTrigger>
            <TabsTrigger value="evacuation">Эвакуация</TabsTrigger>
            <TabsTrigger value="legal">Юридическая помощь</TabsTrigger>
          </TabsList>

          <TabsContent value="emergency" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyContacts.map((contact) => (
                <Card
                  key={contact.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        className={`${getPriorityColor(contact.priority)} text-white`}
                      >
                        {getPriorityText(contact.priority)}
                      </Badge>
                      <Badge variant="outline">{contact.category}</Badge>
                    </div>
                    <CardTitle
                      className="text-lg"
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      {contact.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-muted-foreground mb-4"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      {contact.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Icon name="Phone" className="h-4 w-4 text-accent" />
                        <span className="font-bold text-accent text-lg">
                          {contact.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon
                          name="Clock"
                          className="h-4 w-4 text-muted-foreground"
                        />
                        <span>{contact.available}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1 bg-accent hover:bg-accent/90"
                        onClick={() =>
                          window.open(`tel:${contact.phone}`, "_self")
                        }
                      >
                        <Icon name="Phone" className="h-4 w-4 mr-2" />
                        Позвонить
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Icon name="MessageCircle" className="h-4 w-4 mr-2" />
                        Написать
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="evacuation" className="mt-8">
            <div className="space-y-6">
              {evacuationServices.map((service) => (
                <Card
                  key={service.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon name="Star" className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{service.rating}</span>
                      </div>
                      <Badge className="bg-accent text-white">
                        {service.responseTime}
                      </Badge>
                    </div>
                    <CardTitle
                      className="text-xl"
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      {service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-muted-foreground mb-4"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      {service.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Icon
                            name="MapPin"
                            className="h-4 w-4 text-muted-foreground"
                          />
                          <span>{service.coverage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon
                            name="DollarSign"
                            className="h-4 w-4 text-accent"
                          />
                          <span className="font-bold text-accent">
                            {service.price}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Icon
                            name="Phone"
                            className="h-4 w-4 text-muted-foreground"
                          />
                          <span className="font-bold">{service.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon
                            name="Clock"
                            className="h-4 w-4 text-muted-foreground"
                          />
                          <span>Прибытие: {service.responseTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Особенности:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-accent hover:bg-accent/90"
                        onClick={() =>
                          window.open(`tel:${service.phone}`, "_self")
                        }
                      >
                        <Icon name="Phone" className="h-4 w-4 mr-2" />
                        Вызвать эвакуатор
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Icon name="MessageCircle" className="h-4 w-4 mr-2" />
                        Написать
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="legal" className="mt-8">
            <div className="space-y-6">
              {legalServices.map((service) => (
                <Card
                  key={service.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon name="Star" className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{service.rating}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          Опыт: {service.experience}
                        </Badge>
                        {service.consultationFree && (
                          <Badge className="bg-green-500 text-white">
                            Бесплатная консультация
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle
                      className="text-xl"
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      {service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-muted-foreground mb-4"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      {service.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Icon
                            name="Phone"
                            className="h-4 w-4 text-muted-foreground"
                          />
                          <span className="font-bold">{service.phone}</span>
                        </div>
                        {service.email && (
                          <div className="flex items-center gap-2">
                            <Icon
                              name="Mail"
                              className="h-4 w-4 text-muted-foreground"
                            />
                            <span>{service.email}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Icon
                            name="DollarSign"
                            className="h-4 w-4 text-accent"
                          />
                          <span className="font-bold text-accent">
                            {service.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon
                            name="Award"
                            className="h-4 w-4 text-muted-foreground"
                          />
                          <span>Опыт: {service.experience}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Специализация:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.specialization.map((spec, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-accent hover:bg-accent/90"
                        onClick={() =>
                          window.open(`tel:${service.phone}`, "_self")
                        }
                      >
                        <Icon name="Phone" className="h-4 w-4 mr-2" />
                        Позвонить
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Icon name="MessageCircle" className="h-4 w-4 mr-2" />
                        Написать
                      </Button>
                      {service.consultationFree && (
                        <Button variant="outline">
                          <Icon name="Calendar" className="h-4 w-4 mr-2" />
                          Консультация
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Help;
