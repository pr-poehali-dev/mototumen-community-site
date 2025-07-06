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
              <a href="#ads" className="hover:text-accent transition-colors">
                Объявления
              </a>
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

      {/* Main Content Tabs */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="shop" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-zinc-800 border-zinc-700">
              <TabsTrigger
                value="shop"
                className="data-[state=active]:bg-accent data-[state=active]:text-white"
              >
                <Icon name="ShoppingBag" className="h-4 w-4 mr-2" />
                Магазин
              </TabsTrigger>
              <TabsTrigger
                value="service"
                className="data-[state=active]:bg-accent data-[state=active]:text-white"
              >
                <Icon name="Wrench" className="h-4 w-4 mr-2" />
                Сервис
              </TabsTrigger>
              <TabsTrigger
                value="schools"
                className="data-[state=active]:bg-accent data-[state=active]:text-white"
              >
                <Icon name="GraduationCap" className="h-4 w-4 mr-2" />
                Мотошколы
              </TabsTrigger>
              <TabsTrigger
                value="ads"
                className="data-[state=active]:bg-accent data-[state=active]:text-white"
              >
                <Icon name="Megaphone" className="h-4 w-4 mr-2" />
                Объявления
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shop" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Card
                    key={item}
                    className="bg-zinc-800 border-zinc-700 hover-scale animate-fade-in"
                  >
                    <CardHeader>
                      <div className="w-full h-48 bg-zinc-700 rounded-lg mb-4 flex items-center justify-center">
                        <Icon
                          name="Package"
                          className="h-12 w-12 text-zinc-500"
                        />
                      </div>
                      <CardTitle
                        className="text-white"
                        style={{ fontFamily: "Oswald, sans-serif" }}
                      >
                        Мотоэкипировка
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        Шлемы, куртки, перчатки и другая защитная экипировка
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className="bg-accent/20 text-accent"
                          >
                            -15%
                          </Badge>
                          <span
                            className="text-2xl font-bold text-accent"
                            style={{ fontFamily: "Oswald, sans-serif" }}
                          >
                            ₽5,999
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-zinc-700"
                        >
                          <Icon name="ShoppingCart" className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="service" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Техническое обслуживание",
                    icon: "Settings",
                    price: "₽2,500",
                  },
                  {
                    title: "Диагностика двигателя",
                    icon: "Search",
                    price: "₽1,200",
                  },
                  { title: "Замена масла", icon: "Droplets", price: "₽800" },
                  {
                    title: "Ремонт тормозов",
                    icon: "AlertTriangle",
                    price: "₽3,500",
                  },
                  {
                    title: "Настройка карбюратора",
                    icon: "Cog",
                    price: "₽1,800",
                  },
                  { title: "Замена шин", icon: "Circle", price: "₽1,500" },
                ].map((service, index) => (
                  <Card
                    key={index}
                    className="bg-zinc-800 border-zinc-700 hover-scale animate-fade-in"
                  >
                    <CardHeader>
                      <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                        <Icon
                          name={service.icon as any}
                          className="h-8 w-8 text-accent"
                        />
                      </div>
                      <CardTitle
                        className="text-white"
                        style={{ fontFamily: "Oswald, sans-serif" }}
                      >
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        Профессиональный сервис с гарантией качества
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-2xl font-bold text-accent"
                          style={{ fontFamily: "Oswald, sans-serif" }}
                        >
                          {service.price}
                        </span>
                        <Button
                          size="sm"
                          className="bg-accent hover:bg-accent/90"
                        >
                          Записаться
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="schools" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Курс для начинающих",
                    duration: "40 часов",
                    price: "₽25,000",
                  },
                  {
                    title: "Повышение категории",
                    duration: "20 часов",
                    price: "₽15,000",
                  },
                  {
                    title: "Экстремальное вождение",
                    duration: "16 часов",
                    price: "₽35,000",
                  },
                ].map((course, index) => (
                  <Card
                    key={index}
                    className="bg-zinc-800 border-zinc-700 hover-scale animate-fade-in"
                  >
                    <CardHeader>
                      <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                        <Icon
                          name="GraduationCap"
                          className="h-8 w-8 text-accent"
                        />
                      </div>
                      <CardTitle
                        className="text-white"
                        style={{ fontFamily: "Oswald, sans-serif" }}
                      >
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        Обучение с опытными инструкторами • {course.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-2xl font-bold text-accent"
                          style={{ fontFamily: "Oswald, sans-serif" }}
                        >
                          {course.price}
                        </span>
                        <Button
                          size="sm"
                          className="bg-accent hover:bg-accent/90"
                        >
                          Записаться
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ads" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Honda CBR600RR 2019",
                    type: "Продажа",
                    price: "₽450,000",
                  },
                  {
                    title: "Yamaha MT-07 2021",
                    type: "Продажа",
                    price: "₽520,000",
                  },
                  {
                    title: "BMW R1250GS 2020",
                    type: "Продажа",
                    price: "₽1,200,000",
                  },
                  {
                    title: "Kawasaki Ninja 400",
                    type: "Аренда",
                    price: "₽2,000/день",
                  },
                  {
                    title: "Комплект зимней экипировки",
                    type: "Продажа",
                    price: "₽15,000",
                  },
                  {
                    title: "Мотоботы Alpinestars",
                    type: "Продажа",
                    price: "₽8,500",
                  },
                ].map((ad, index) => (
                  <Card
                    key={index}
                    className="bg-zinc-800 border-zinc-700 hover-scale animate-fade-in"
                  >
                    <CardHeader>
                      <div className="w-full h-32 bg-zinc-700 rounded-lg mb-4 flex items-center justify-center">
                        <Icon name="Bike" className="h-12 w-12 text-zinc-500" />
                      </div>
                      <CardTitle
                        className="text-white"
                        style={{ fontFamily: "Oswald, sans-serif" }}
                      >
                        {ad.title}
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        <Badge
                          variant="outline"
                          className="mr-2 border-accent text-accent"
                        >
                          {ad.type}
                        </Badge>
                        Отличное состояние
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-2xl font-bold text-accent"
                          style={{ fontFamily: "Oswald, sans-serif" }}
                        >
                          {ad.price}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-zinc-700"
                        >
                          <Icon name="MessageCircle" className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
              <Button className="bg-accent hover:bg-accent/90 text-white w-full">
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
