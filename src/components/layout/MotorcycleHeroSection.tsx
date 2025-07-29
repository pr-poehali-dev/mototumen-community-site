import React from 'react';

const MotorcycleHeroSection: React.FC = () => {

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