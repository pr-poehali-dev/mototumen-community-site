import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const HeroSection: React.FC = () => {
  const handleJoinCommunity = () => {
    window.open("https://t.me/MotoTyumen", "_blank");
  };

  const handleWatchVideo = () => {
    // TODO: Implement video modal or redirect
    console.log("Watch video clicked");
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: "url(/img/ce03d6a4-3520-4714-ab06-885f5ee38544.jpg)",
        }}
      ></div>

      {/* Content */}
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
              onClick={handleJoinCommunity}
            >
              <Icon name="Users" className="h-5 w-5 mr-2" />
              Присоединиться
            </Button>

            <Button
              size="lg"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              onClick={handleWatchVideo}
            >
              <Icon name="Play" className="h-5 w-5 mr-2" />
              Посмотреть видео
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
