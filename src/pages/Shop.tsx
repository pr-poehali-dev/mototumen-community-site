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
          {/* Компактная карточка Motomax в стиле Озон */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden max-w-xs mx-auto relative group">
            {/* Статус в правом верхнем углу */}
            <div className="absolute top-3 right-3 z-10">
              <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                <div
                  className={`w-2 h-2 ${shopStatus.dotColor} rounded-full`}
                ></div>
                <span
                  className={`text-xs font-medium ${shopStatus.color === "text-green-400" ? "text-green-600" : "text-red-600"}`}
                >
                  {shopStatus.status}
                </span>
              </div>
            </div>

            {/* Логотип/Изображение */}
            <div className="relative h-44 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Icon name="Bike" className="h-14 w-14 text-white" />
              <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-white text-xs font-medium">
                  Мотосалон
                </span>
              </div>
            </div>

            {/* Основной контент */}
            <div className="p-4">
              {/* Заголовок и рейтинг */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 font-['Oswald'] truncate">
                  Motomax
                </h3>
                <div className="flex items-center gap-1 ml-2">
                  <Icon
                    name="Star"
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    5.0
                  </span>
                </div>
              </div>

              {/* Краткое описание */}
              <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                Интернет-магазин и сеть мотосалонов в Тюмени, Челябинске и
                Кургане
              </p>

              {/* Компактная информация */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Icon
                    name="MapPin"
                    className="h-3 w-3 text-blue-500 flex-shrink-0"
                  />
                  <span className="truncate">ул. Одесская, 1, стр. 66</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Icon
                    name="Clock"
                    className="h-3 w-3 text-blue-500 flex-shrink-0"
                  />
                  <span>10:00–20:00</span>
                  <span className="text-gray-400">•</span>
                  <span>ежедневно</span>
                </div>
              </div>

              {/* Кнопка сайта */}
              <a
                href="https://motomax.su/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 rounded-xl font-medium transition-all">
                  <Icon name="Globe" className="h-4 w-4 mr-2" />
                  Перейти на сайт
                </Button>
              </a>

              {/* Контакты */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <a
                  href="tel:+79199402311"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Icon name="Phone" className="h-3.5 w-3.5" />
                  <span className="text-xs">Позвонить</span>
                </a>

                {/* Социальные сети */}
                <div className="flex gap-2">
                  <a
                    href="https://t.me/79199402311"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-7 h-7 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                    title="Telegram"
                  >
                    <Icon name="Send" className="h-3 w-3 text-white" />
                  </a>

                  <a
                    href="https://vk.com/1motomax"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    title="ВКонтакте"
                  >
                    <span className="text-white font-bold text-xs">VK</span>
                  </a>

                  <a
                    href="https://wa.me/79199402311?text=Обращение+из+Яндекс+Карт%0AЗдравствуйте!+Меня+заинтересовало+ваше+предложение"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-7 h-7 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                    title="WhatsApp"
                  >
                    <Icon name="MessageCircle" className="h-3 w-3 text-white" />
                  </a>
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
