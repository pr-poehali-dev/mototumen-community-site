import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import PageLayout from "@/components/layout/PageLayout";

const Shop = () => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Обновляем время каждую минуту
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Обновляем каждую минуту

    return () => clearInterval(timer);
  }, []);

  // Проверяем статус работы магазина
  const getShopStatus = () => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // График работы: ежедневно 10:00-20:00
    const openTime = 10 * 60; // 10:00 в минутах
    const closeTime = 20 * 60; // 20:00 в минутах

    const isOpen =
      currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime;

    return {
      isOpen,
      status: isOpen ? "Открыто" : "Закрыто",
      color: isOpen ? "text-green-400" : "text-red-400",
      dotColor: isOpen ? "bg-green-400" : "bg-red-400",
      nextChange: isOpen ? "Закроется в 20:00" : "Откроется в 10:00",
    };
  };

  const shopStatus = getShopStatus();
  return (
    <PageLayout>
      {/* Hero Section for Shop */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url(/img/ce03d6a4-3520-4714-ab06-885f5ee38544.jpg)",
          }}
        ></div>

        {/* Content */}
        <div className="container mx-auto relative z-20">
          <div className="max-w-3xl">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 text-shadow animate-fade-in"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              МОТО
              <span className="text-accent">МАГАЗИН</span>
            </h1>

            <p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-300 mb-6 md:mb-8 animate-fade-in"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Мотосалоны и магазины Тюмени
            </p>
          </div>
        </div>
      </section>

      {/* Магазины */}
      <section className="py-6 sm:py-8 md:py-16 px-4">
        <div className="container mx-auto">
          {/* Сетка карточек - 2x2 на мобильных, адаптивно на больших экранах */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {/* Карточка Motomax */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
              {/* Статус в правом верхнем углу */}
              <div className="absolute top-2 right-2 z-10">
                <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-sm">
                  <div
                    className={`w-1.5 h-1.5 ${shopStatus.dotColor} rounded-full`}
                  ></div>
                  <span
                    className={`text-xs font-medium ${shopStatus.color === "text-green-400" ? "text-green-600" : "text-red-600"}`}
                  >
                    {shopStatus.status}
                  </span>
                </div>
              </div>

              {/* Логотип/Изображение */}
              <div className="relative h-28 md:h-36 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Icon
                  name="Bike"
                  className="h-8 md:h-12 w-8 md:w-12 text-white"
                />
                <div className="absolute bottom-1.5 left-1.5 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5">
                  <span className="text-white text-xs font-medium">
                    Мотосалон
                  </span>
                </div>
              </div>

              {/* Основной контент */}
              <div className="p-2.5 md:p-4">
                {/* Заголовок и рейтинг */}
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="text-sm md:text-lg font-bold text-gray-900 font-['Oswald'] truncate">
                    Motomax
                  </h3>
                  <div className="flex items-center gap-0.5 ml-1">
                    <Icon
                      name="Star"
                      className="h-3 md:h-4 w-3 md:w-4 text-yellow-400 fill-current"
                    />
                    <span className="text-xs md:text-sm font-semibold text-gray-700">
                      5.0
                    </span>
                  </div>
                </div>

                {/* Краткое описание - только на больших экранах */}
                <p className="hidden md:block text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                  Интернет-магазин и сеть мотосалонов в Тюмени, Челябинске и
                  Кургане
                </p>

                {/* Компактная информация */}
                <div className="space-y-1 md:space-y-2 mb-2 md:mb-4">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Icon
                      name="MapPin"
                      className="h-2.5 md:h-3 w-2.5 md:w-3 text-blue-500 flex-shrink-0"
                    />
                    <span className="truncate text-xs">Одесская, 1/66</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Icon
                      name="Clock"
                      className="h-2.5 md:h-3 w-2.5 md:w-3 text-blue-500 flex-shrink-0"
                    />
                    <span className="text-xs">10-20</span>
                  </div>
                </div>

                {/* Кнопка сайта */}
                <a
                  href="https://motomax.su/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-2"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm py-1.5 md:py-2.5 rounded-lg md:rounded-xl font-medium transition-all">
                    <Icon
                      name="Globe"
                      className="h-3 md:h-4 w-3 md:w-4 mr-1 md:mr-2"
                    />
                    <span className="hidden md:inline">Перейти на сайт</span>
                    <span className="md:hidden">Сайт</span>
                  </Button>
                </a>

                {/* Контакты */}
                <div className="flex justify-between items-center">
                  <a
                    href="tel:+79199402311"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Icon name="Phone" className="h-3 w-3" />
                    <span className="text-xs">Звонок</span>
                  </a>

                  {/* Социальные сети */}
                  <div className="flex gap-1">
                    <a
                      href="https://t.me/79199402311"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                      title="Telegram"
                    >
                      <Icon name="Send" className="h-2.5 w-2.5 text-white" />
                    </a>

                    <a
                      href="https://vk.com/1motomax"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                      title="ВКонтакте"
                    >
                      <span className="text-white font-bold text-xs">VK</span>
                    </a>

                    <a
                      href="https://wa.me/79199402311?text=Обращение+из+Яндекс+Карт%0AЗдравствуйте!+Меня+заинтересовало+ваше+предложение"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-6 h-6 bg-green-500 hover:bg-green-600 rounded transition-colors"
                      title="WhatsApp"
                    >
                      <Icon
                        name="MessageCircle"
                        className="h-2.5 w-2.5 text-white"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Дублируем еще 3 карточки для демонстрации сетки */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
              <div className="absolute top-2 right-2 z-10">
                <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  <span className="text-xs font-medium text-red-600">
                    Закрыто
                  </span>
                </div>
              </div>
              <div className="relative h-28 md:h-36 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <Icon
                  name="Car"
                  className="h-8 md:h-12 w-8 md:w-12 text-white"
                />
                <div className="absolute bottom-1.5 left-1.5 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5">
                  <span className="text-white text-xs font-medium">
                    Автосалон
                  </span>
                </div>
              </div>
              <div className="p-2.5 md:p-4">
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="text-sm md:text-lg font-bold text-gray-900 font-['Oswald'] truncate">
                    Автомир
                  </h3>
                  <div className="flex items-center gap-0.5 ml-1">
                    <Icon
                      name="Star"
                      className="h-3 md:h-4 w-3 md:w-4 text-yellow-400 fill-current"
                    />
                    <span className="text-xs md:text-sm font-semibold text-gray-700">
                      4.8
                    </span>
                  </div>
                </div>
                <p className="hidden md:block text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                  Продажа и обслуживание автомобилей в Тюмени
                </p>
                <div className="space-y-1 md:space-y-2 mb-2 md:mb-4">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Icon
                      name="MapPin"
                      className="h-2.5 md:h-3 w-2.5 md:w-3 text-red-500 flex-shrink-0"
                    />
                    <span className="truncate text-xs">Ленина, 15</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Icon
                      name="Clock"
                      className="h-2.5 md:h-3 w-2.5 md:w-3 text-red-500 flex-shrink-0"
                    />
                    <span className="text-xs">9-18</span>
                  </div>
                </div>
                <a href="#" className="block mb-2">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm py-1.5 md:py-2.5 rounded-lg md:rounded-xl font-medium transition-all">
                    <Icon
                      name="Globe"
                      className="h-3 md:h-4 w-3 md:w-4 mr-1 md:mr-2"
                    />
                    <span className="hidden md:inline">Перейти на сайт</span>
                    <span className="md:hidden">Сайт</span>
                  </Button>
                </a>
                <div className="flex justify-between items-center">
                  <a
                    href="tel:+79123456789"
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
                  >
                    <Icon name="Phone" className="h-3 w-3" />
                    <span className="text-xs">Звонок</span>
                  </a>
                  <div className="flex gap-1">
                    <a
                      href="#"
                      className="flex items-center justify-center w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                    >
                      <Icon name="Send" className="h-2.5 w-2.5 text-white" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                      <span className="text-white font-bold text-xs">VK</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
              <div className="absolute top-2 right-2 z-10">
                <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-xs font-medium text-green-600">
                    Открыто
                  </span>
                </div>
              </div>
              <div className="relative h-28 md:h-36 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Icon
                  name="Wrench"
                  className="h-8 md:h-12 w-8 md:w-12 text-white"
                />
                <div className="absolute bottom-1.5 left-1.5 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5">
                  <span className="text-white text-xs font-medium">
                    Автосервис
                  </span>
                </div>
              </div>
              <div className="p-2.5 md:p-4">
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="text-sm md:text-lg font-bold text-gray-900 font-['Oswald'] truncate">
                    СТО-Мастер
                  </h3>
                  <div className="flex items-center gap-0.5 ml-1">
                    <Icon
                      name="Star"
                      className="h-3 md:h-4 w-3 md:w-4 text-yellow-400 fill-current"
                    />
                    <span className="text-xs md:text-sm font-semibold text-gray-700">
                      4.9
                    </span>
                  </div>
                </div>
                <p className="hidden md:block text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                  Профессиональный ремонт автомобилей
                </p>
                <div className="space-y-1 md:space-y-2 mb-2 md:mb-4">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Icon
                      name="MapPin"
                      className="h-2.5 md:h-3 w-2.5 md:w-3 text-green-500 flex-shrink-0"
                    />
                    <span className="truncate text-xs">50 лет ВЛКСМ, 7</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Icon
                      name="Clock"
                      className="h-2.5 md:h-3 w-2.5 md:w-3 text-green-500 flex-shrink-0"
                    />
                    <span className="text-xs">8-20</span>
                  </div>
                </div>
                <a href="#" className="block mb-2">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm py-1.5 md:py-2.5 rounded-lg md:rounded-xl font-medium transition-all">
                    <Icon
                      name="Globe"
                      className="h-3 md:h-4 w-3 md:w-4 mr-1 md:mr-2"
                    />
                    <span className="hidden md:inline">Перейти на сайт</span>
                    <span className="md:hidden">Сайт</span>
                  </Button>
                </a>
                <div className="flex justify-between items-center">
                  <a
                    href="tel:+79876543210"
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
                  >
                    <Icon name="Phone" className="h-3 w-3" />
                    <span className="text-xs">Звонок</span>
                  </a>
                  <div className="flex gap-1">
                    <a
                      href="#"
                      className="flex items-center justify-center w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                    >
                      <Icon name="Send" className="h-2.5 w-2.5 text-white" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-6 h-6 bg-green-500 hover:bg-green-600 rounded transition-colors"
                    >
                      <Icon
                        name="MessageCircle"
                        className="h-2.5 w-2.5 text-white"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
              <div className="absolute top-2 right-2 z-10">
                <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span className="text-xs font-medium text-orange-600">
                    Скоро
                  </span>
                </div>
              </div>
              <div className="relative h-28 md:h-36 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Icon
                  name="ShoppingBag"
                  className="h-8 md:h-12 w-8 md:w-12 text-white"
                />
                <div className="absolute bottom-1.5 left-1.5 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5">
                  <span className="text-white text-xs font-medium">
                    Запчасти
                  </span>
                </div>
              </div>
              <div className="p-2.5 md:p-4">
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="text-sm md:text-lg font-bold text-gray-900 font-['Oswald'] truncate">
                    АвтоДеталь
                  </h3>
                  <div className="flex items-center gap-0.5 ml-1">
                    <Icon
                      name="Star"
                      className="h-3 md:h-4 w-3 md:w-4 text-yellow-400 fill-current"
                    />
                    <span className="text-xs md:text-sm font-semibold text-gray-700">
                      4.7
                    </span>
                  </div>
                </div>
                <p className="hidden md:block text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                  Магазин автозапчастей и аксессуаров
                </p>
                <div className="space-y-1 md:space-y-2 mb-2 md:mb-4">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Icon
                      name="MapPin"
                      className="h-2.5 md:h-3 w-2.5 md:w-3 text-orange-500 flex-shrink-0"
                    />
                    <span className="truncate text-xs">Московский тр., 2</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Icon
                      name="Clock"
                      className="h-2.5 md:h-3 w-2.5 md:w-3 text-orange-500 flex-shrink-0"
                    />
                    <span className="text-xs">9-19</span>
                  </div>
                </div>
                <a href="#" className="block mb-2">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs md:text-sm py-1.5 md:py-2.5 rounded-lg md:rounded-xl font-medium transition-all">
                    <Icon
                      name="Globe"
                      className="h-3 md:h-4 w-3 md:w-4 mr-1 md:mr-2"
                    />
                    <span className="hidden md:inline">Перейти на сайт</span>
                    <span className="md:hidden">Сайт</span>
                  </Button>
                </a>
                <div className="flex justify-between items-center">
                  <a
                    href="tel:+79555123456"
                    className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium"
                  >
                    <Icon name="Phone" className="h-3 w-3" />
                    <span className="text-xs">Звонок</span>
                  </a>
                  <div className="flex gap-1">
                    <a
                      href="#"
                      className="flex items-center justify-center w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                    >
                      <Icon name="Send" className="h-2.5 w-2.5 text-white" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                      <span className="text-white font-bold text-xs">VK</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Shop;
