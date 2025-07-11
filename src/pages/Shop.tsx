import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import PageLayout from "@/components/layout/PageLayout";

const Shop = () => {
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
          {/* Motomax Card */}
          <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 shadow-xl">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Логотип */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-accent rounded-lg flex items-center justify-center">
                  <Icon name="Bike" className="h-12 w-12 text-white" />
                </div>
              </div>

              {/* Основная информация */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h2
                      className="text-2xl font-bold text-white mb-2"
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      Motomax
                    </h2>

                    {/* Рейтинг */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                      <span className="text-sm text-zinc-400 ml-2">5.0</span>
                    </div>
                  </div>

                  {/* Статус работы */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-400 font-medium">
                      Открыто
                    </span>
                  </div>
                </div>

                {/* Описание */}
                <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
                  Motomax - Интернет-магазин и сеть мотосалонов в Тюмени,
                  Челябинске и Кургане, мы осуществляет продажу мотоциклов,
                  квадроциклов, мото экипировки, разнообразного тюнинга и мото
                  запчастей. Мотомах это дилер крупнейших в России импортеров
                  мото экипировки с собственным современным складском, что
                  позволяет поддерживать в наличии тысячи самых востребованных
                  наименований и оперативно выполнять заявки розничной сети и
                  оптовых клиентов.
                </p>

                {/* Контактная информация */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Icon
                      name="MapPin"
                      className="h-4 w-4 text-accent mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm text-zinc-300">
                      ул. Одесская, 1, стр. 66
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Icon
                      name="Clock"
                      className="h-4 w-4 text-accent mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm text-zinc-300">
                      ежедневно, 10:00–20:00
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Icon
                      name="Phone"
                      className="h-4 w-4 text-accent mt-0.5 flex-shrink-0"
                    />
                    <a
                      href="tel:+79199402311"
                      className="text-sm text-accent hover:text-accent/80 transition-colors"
                    >
                      +7 (919) 940-23-11
                    </a>
                  </div>
                </div>

                {/* Социальные сети */}
                <div className="flex items-center gap-3">
                  <a
                    href="https://t.me/79199402311"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                  >
                    <Icon name="Send" className="h-5 w-5 text-white" />
                  </a>

                  <a
                    href="https://vk.com/1motomax"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                  >
                    <span className="text-white font-bold text-sm">VK</span>
                  </a>

                  <a
                    href="https://wa.me/79199402311?text=Обращение+из+Яндекс+Карт%0AЗдравствуйте!+Меня+заинтересовало+ваше+предложение"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                  >
                    <Icon name="MessageCircle" className="h-5 w-5 text-white" />
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
