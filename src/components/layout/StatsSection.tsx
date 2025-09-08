import React, { useEffect, useState } from "react";
import { getCachedTelegramData, TelegramChannelData } from "@/api/telegram";

interface StatItem {
  value: string;
  label: string;
}

const StatsSection: React.FC = () => {
  const [telegramData, setTelegramData] = useState<TelegramChannelData | null>(
    null,
  );

  useEffect(() => {
    const loadTelegramData = async () => {
      const data = await getCachedTelegramData();
      setTelegramData(data);
    };

    loadTelegramData();
  }, []);

  const statsData: StatItem[] = [
    {
      value: telegramData ? `${telegramData.memberCount}+` : "400+",
      label: "Участников",
    },
    { value: "20+", label: "Мероприятий" },
    { value: "2", label: "Партнеров" },
    { value: "2", label: "года сообществу" },
  ];
  return (
    <section className="relative py-6 sm:py-8 md:py-16 px-4 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: "url(/img/ce03d6a4-3520-4714-ab06-885f5ee38544.jpg)",
        }}
      ></div>

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Decorative Maple Leaves */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div className="absolute top-20 left-1/4 text-red-500 text-2xl opacity-60 animate-pulse">🍁</div>
        <div className="absolute top-32 right-1/3 text-red-500 text-xl opacity-70 animate-bounce">🍁</div>
        <div className="absolute bottom-40 left-1/6 text-red-500 text-3xl opacity-50 animate-pulse">🍁</div>
        <div className="absolute bottom-20 right-1/4 text-red-500 text-xl opacity-80 animate-bounce">🍁</div>
        <div className="absolute top-1/2 right-1/6 text-red-500 text-2xl opacity-60 animate-pulse">🍁</div>
        <div className="absolute top-40 left-2/3 text-red-500 text-xl opacity-70 animate-bounce">🍁</div>
        <div className="absolute bottom-60 right-2/3 text-red-500 text-2xl opacity-50 animate-pulse">🍁</div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center animate-scale-in">
              <div
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-accent mb-2"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                {stat.value}
              </div>
              <div className="text-zinc-400 text-xs sm:text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;