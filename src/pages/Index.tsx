import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import TelegramAuth from "@/components/TelegramAuth";
import UserProfile from "@/components/UserProfile";
import AdminLogin from "@/components/AdminLogin";
import AdminPanel from "@/components/AdminPanel";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
}

const Index = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleAuth = (userData: TelegramUser) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleAdminLogin = (adminStatus: boolean) => {
    setIsAdmin(adminStatus);
    setShowAdminLogin(false);
    if (adminStatus) {
      setShowAdminPanel(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setShowAdminPanel(false);
  };

  // Показать экран входа администратора
  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-zinc-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Zap" className="h-8 w-8 text-accent" />
              <div>
                <h1
                  className="text-2xl font-bold"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  МОТОТюмень
                </h1>
                <p className="text-sm text-zinc-400">
                  Городское мотосообщество
                </p>
              </div>
            </div>
            <nav
              className="hidden md:flex space-x-6"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              <a href="#shop" className="hover:text-accent transition-colors">
                Магазин
              </a>
              <a
                href="#service"
                className="hover:text-accent transition-colors"
              >
                Сервис
              </a>
              <a
                href="#schools"
                className="hover:text-accent transition-colors"
              >
                Мотошколы
              </a>
              <a href="#events" className="hover:text-accent transition-colors">
                События
              </a>
              <div className="relative group">
                <a
                  href="#useful"
                  className="hover:text-accent transition-colors cursor-pointer"
                >
                  Полезное
                  <Icon name="ChevronDown" className="h-4 w-4 inline ml-1" />
                </a>
                <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-md shadow-lg z-50 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <a
                    href="#ads"
                    className="block px-4 py-2 hover:bg-accent/10 transition-colors border-b border-border"
                  >
                    Объявления
                  </a>
                  <a
                    href="#lost-found"
                    className="block px-4 py-2 hover:bg-accent/10 transition-colors border-b border-border"
                  >
                    Потеряшки/Находки
                  </a>
                  <a
                    href="#upcoming-events"
                    className="block px-4 py-2 hover:bg-accent/10 transition-colors border-b border-border"
                  >
                    Ближайшие события
                  </a>
                  <a
                    href="#help"
                    className="block px-4 py-2 hover:bg-accent/10 transition-colors border-b border-border"
                  >
                    Помощь
                  </a>
                  <a
                    href="#map"
                    className="block px-4 py-2 hover:bg-accent/10 transition-colors"
                  >
                    Карта маршрутов
                  </a>
                </div>
              </div>
            </nav>
            <div className="flex items-center space-x-3">
              {isAuthenticated && user ? (
                <UserProfile user={user} onLogout={handleLogout} />
              ) : (
                <TelegramAuth
                  onAuth={handleAuth}
                  isAuthenticated={isAuthenticated}
                />
              )}
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-700"
                onClick={() => setShowAdminLogin(true)}
              >
                <Icon name="Settings" className="h-4 w-4" />
              </Button>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-accent text-accent"
                  onClick={() => setShowAdminPanel(true)}
                >
                  <Icon name="Shield" className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url(/img/ce03d6a4-3520-4714-ab06-885f5ee38544.jpg)",
          }}
        ></div>
        <div className="container mx-auto relative z-20">
          <div className="max-w-3xl">
            <h2
              className="text-5xl md:text-7xl font-bold mb-6 text-shadow animate-fade-in"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              МОТО
              <span className="text-accent">СООБЩЕСТВО</span>
              <br />
              ТЮМЕНИ
            </h2>
            <p
              className="text-xl md:text-2xl text-zinc-300 mb-8 animate-fade-in"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Объединяем байкеров города. Магазин, сервис, обучение и общение в
              одном месте.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white"
                onClick={() => window.open("https://t.me/MotoTyumen", "_blank")}
              >
                <Icon name="Users" className="h-5 w-5 mr-2" />
                Присоединиться
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-700 hover:bg-zinc-800"
              >
                <Icon name="Play" className="h-5 w-5 mr-2" />
                Посмотреть видео
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-black/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-scale-in">
              <div
                className="text-4xl font-bold text-accent mb-2"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                1200+
              </div>
              <div className="text-zinc-400">Участников</div>
            </div>
            <div className="text-center animate-scale-in">
              <div
                className="text-4xl font-bold text-accent mb-2"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                150+
              </div>
              <div className="text-zinc-400">Мероприятий</div>
            </div>
            <div className="text-center animate-scale-in">
              <div
                className="text-4xl font-bold text-accent mb-2"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                25
              </div>
              <div className="text-zinc-400">Партнеров</div>
            </div>
            <div className="text-center animate-scale-in">
              <div
                className="text-4xl font-bold text-accent mb-2"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                5
              </div>
              <div className="text-zinc-400">Лет опыта</div>
            </div>
          </div>
        </div>
      </section>

      {/* Board Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4 text-white"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Доска объявлений
            </h2>
            <p
              className="text-zinc-400 text-lg"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Последние объявления от участников сообщества
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
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
                description:
                  "Еду на дачу в выходные, есть свободное место для попутчика.",
              },
              {
                title: "Продаю мотоэкипировку",
                author: "Игорь М.",
                date: "5 апреля",
                category: "Продажа",
                price: "₽8,500",
                location: "Тюмень",
                type: "announcement",
                description:
                  "Комплект мотоэкипировки: шлем, куртка, перчатки. Размер L.",
              },
            ].map((item, index) => {
              const getTypeColor = (type: string) => {
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

              const getTypeLabel = (type: string) => {
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

              return (
                <Card
                  key={index}
                  className="bg-zinc-800 border-zinc-700 hover-scale animate-fade-in"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        className={`${getTypeColor(item.type)} text-white text-xs`}
                      >
                        {getTypeLabel(item.type)}
                      </Badge>
                      <span className="text-xs text-zinc-400">{item.date}</span>
                    </div>
                    <CardTitle
                      className="text-white text-lg leading-tight"
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
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Icon name="User" className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-300">{item.author}</span>
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-2">
                          <Icon
                            name="MapPin"
                            className="h-4 w-4 text-zinc-400"
                          />
                          <span className="text-zinc-300">{item.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Icon name="Tag" className="h-4 w-4 text-zinc-400" />
                        <span className="text-zinc-300">{item.category}</span>
                      </div>
                      {item.price && (
                        <div className="flex items-center gap-2">
                          <Icon
                            name="DollarSign"
                            className="h-4 w-4 text-accent"
                          />
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
                      >
                        <Icon name="MessageCircle" className="h-4 w-4 mr-1" />
                        Написать
                      </Button>
                      <Button
                        size="sm"
                        className="bg-accent hover:bg-accent/90"
                      >
                        <Icon name="ExternalLink" className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white"
            >
              <Icon name="Plus" className="h-5 w-5 mr-2" />
              Посмотреть все объявления
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3
                className="text-xl font-bold mb-4"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                МОТОТюмень
              </h3>
              <p
                className="text-zinc-400 mb-4"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Крупнейшее мотосообщество Тюмени. Объединяем байкеров с 2019
                года.
              </p>
              <div className="flex space-x-4">
                <Icon
                  name="MessageCircle"
                  className="h-6 w-6 text-accent cursor-pointer hover:text-accent/80"
                />
                <Icon
                  name="Instagram"
                  className="h-6 w-6 text-accent cursor-pointer hover:text-accent/80"
                />
                <Icon
                  name="Youtube"
                  className="h-6 w-6 text-accent cursor-pointer hover:text-accent/80"
                />
              </div>
            </div>
            <div>
              <h4
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Услуги
              </h4>
              <ul
                className="space-y-2 text-zinc-400"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Магазин
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Сервис
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Мотошколы
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Объявления
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Контакты
              </h4>
              <ul
                className="space-y-2 text-zinc-400"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                <li>г. Тюмень, ул. Республики, 142</li>
                <li>+7 (3452) 123-456</li>
                <li>info@mototyumen.ru</li>
              </ul>
            </div>
            <div>
              <h4
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Присоединяйтесь
              </h4>
              <p
                className="text-zinc-400 mb-4"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Станьте частью нашего сообщества
              </p>
              <Button
                className="bg-accent hover:bg-accent/90 text-white w-full"
                onClick={() => window.open("https://t.me/MotoTyumen", "_blank")}
              >
                <Icon name="MessageCircle" className="h-4 w-4 mr-2" />
                Telegram канал
              </Button>
            </div>
          </div>
          <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-zinc-400">
            <p style={{ fontFamily: "Open Sans, sans-serif" }}>
              © 2024 МОТОТюмень. Все права защищены.
            </p>
          </div>
        </div>
      </footer>

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </div>
  );
};

export default Index;
