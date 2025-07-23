import React from "react";

const ShopHero: React.FC = () => {
  return (
    <section className="bg-dark-900 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          МОТОМАГАЗИНЫ
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Лучшие магазины мототехники в Тюмени
        </p>
      </div>
    </section>
  );
};

export default ShopHero;