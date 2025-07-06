import React from "react";

interface StatItem {
  value: string;
  label: string;
}

const statsData: StatItem[] = [
  { value: "1200+", label: "Участников" },
  { value: "150+", label: "Мероприятий" },
  { value: "25", label: "Партнеров" },
  { value: "5", label: "Лет опыта" },
];

const StatsSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-black/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center animate-scale-in">
              <div
                className="text-4xl font-bold text-accent mb-2"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                {stat.value}
              </div>
              <div className="text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
