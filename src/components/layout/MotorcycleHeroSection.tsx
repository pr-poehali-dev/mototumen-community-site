import React from 'react';
import Icon from '@/components/ui/icon';

const MotorcycleHeroSection: React.FC = () => {
  const stats = [
    {
      number: "2,847",
      description: "АКТИВНЫХ РАЙДЕРОВ В СООБЩЕСТВЕ",
      icon: "Users"
    },
    {
      number: "127", 
      description: "ГОРОДОВ ПОКРЫТО НАШЕЙ СЕТЬЮ",
      icon: "MapPin"
    },
    {
      number: "89%",
      description: "ДОВОЛЬНЫХ УЧАСТНИКОВ ПОЕЗДОК",
      icon: "Star"
    },
    {
      number: "24/7",
      description: "ПОДДЕРЖКА И ПОМОЩЬ НА ДОРОГАХ",
      icon: "Shield"
    }
  ];

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{
          backgroundImage: `url('/img/f1b076e4-c1e1-43f5-a3f4-265b6e1347a9.jpg')`
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Scratched texture overlay */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-gray-600/10 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between h-screen px-8 lg:px-16">
        {/* Left side - Logo */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <div className="relative">
            {/* Main logo circle */}
            <div className="w-80 h-80 rounded-full border-4 border-orange-500 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              {/* Logo image */}
              <img 
                src="/img/f9317f83-d41c-4033-83e6-99f50b4ae301.jpg" 
                alt="Мотоклуб Лого" 
                className="w-72 h-72 object-cover rounded-full border-4 border-gray-700"
              />
            </div>
            
            {/* Top badge */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-orange-500 text-white px-6 py-2 font-bold text-sm tracking-wider rounded">
                RIDERS
              </div>
            </div>
            
            {/* Bottom badge */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-orange-500 text-white px-6 py-2 font-bold text-sm tracking-wider rounded">
                CLUB
              </div>
            </div>
            
            {/* Side badges */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
              <div className="bg-orange-500 text-white px-3 py-6 font-bold text-xs tracking-wider writing-mode-vertical rounded">
                2024
              </div>
            </div>
            
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
              <div className="bg-orange-500 text-white px-3 py-6 font-bold text-xs tracking-wider rounded">
                RU
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Stats */}
        <div className="flex-1 flex flex-col justify-center space-y-8 pl-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-right group">
              <div className="flex items-center justify-end mb-3">
                <Icon name={stat.icon as any} size={32} className="text-orange-500 mr-4" />
                <div className="text-3xl lg:text-4xl font-bold text-white">
                  {stat.number}
                </div>
              </div>
              <div className="text-sm lg:text-base text-gray-300 tracking-wider font-medium">
                {stat.description}
              </div>
              {/* Animated orange accent line */}
              <div className="w-16 h-1 bg-gradient-to-r from-orange-600 to-orange-400 ml-auto mt-3 rounded group-hover:w-24 transition-all duration-300"></div>
              
              {/* Subtle glow effect */}
              <div className="absolute right-0 w-32 h-16 bg-orange-500/5 rounded-lg -z-10 group-hover:bg-orange-500/10 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative orange dots scattered around */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-orange-500 rounded-full opacity-80"></div>
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-orange-500 rounded-full opacity-60"></div>
      <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-orange-500 rounded-full opacity-70"></div>
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-orange-500 rounded-full opacity-80"></div>
      <div className="absolute top-1/2 left-1/6 w-2 h-2 bg-orange-500 rounded-full opacity-50"></div>
      <div className="absolute top-3/4 right-1/6 w-3 h-3 bg-orange-500 rounded-full opacity-60"></div>

      {/* Plus signs as decorative elements */}
      <div className="absolute top-1/5 right-1/5 text-orange-500 text-2xl opacity-70">+</div>
      <div className="absolute bottom-1/5 left-1/5 text-orange-500 text-xl opacity-60">+</div>
      <div className="absolute top-2/3 left-1/8 text-orange-500 text-lg opacity-50">+</div>
    </section>
  );
};

export default MotorcycleHeroSection;