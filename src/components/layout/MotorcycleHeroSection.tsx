import React from 'react';
import Icon from '@/components/ui/icon';

const MotorcycleHeroSection: React.FC = () => {
  const stats = [
    {
      number: "10 ЛЕТ",
      description: "ВОЗРАСТ НАШЕГО КЛУБА"
    },
    {
      number: "23 ПРОЕКТА", 
      description: "СОЗДАНО КЛУБОМ ЗА ВСЁ ВРЕМЯ"
    },
    {
      number: "СТРАНЫ СНГ",
      description: "ДОСТУПНОСТЬ ПО ВСЕЙ ТЕРРИТОРИИ"
    },
    {
      number: "153 БАЙКА",
      description: "ВЫЕХАЛО С НАШЕГО ГАРАЖА"
    }
  ];

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{
          backgroundImage: `url('/img/c8c904f1-5b19-4b3e-a23a-25f5b5c4f67d.jpg')`
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
            <div className="w-80 h-80 rounded-full border-4 border-yellow-400 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              {/* Inner circle with logo */}
              <div className="w-60 h-60 rounded-full bg-gray-800 border-4 border-gray-600 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full bg-yellow-400 flex items-center justify-center">
                  <Icon name="Zap" size={60} className="text-black" />
                </div>
              </div>
            </div>
            
            {/* Top badge */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-yellow-400 text-black px-6 py-2 font-bold text-sm tracking-wider">
                SKIF
              </div>
            </div>
            
            {/* Bottom badge */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-yellow-400 text-black px-6 py-2 font-bold text-sm tracking-wider">
                NOMAD
              </div>
            </div>
            
            {/* Side badges */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
              <div className="bg-yellow-400 text-black px-3 py-6 font-bold text-xs tracking-wider writing-mode-vertical">
                1%
              </div>
            </div>
            
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
              <div className="bg-yellow-400 text-black px-3 py-6 font-bold text-xs tracking-wider">
                MC
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Stats */}
        <div className="flex-1 flex flex-col justify-center space-y-12 pl-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-right">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-sm lg:text-base text-gray-400 tracking-wider">
                {stat.description}
              </div>
              {/* Orange accent line */}
              <div className="w-16 h-0.5 bg-orange-500 ml-auto mt-2"></div>
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