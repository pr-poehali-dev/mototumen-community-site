import Header from "@/components/Header";
import Footer from "@/components/layout/Footer";
import Icon from "@/components/ui/icon";

const Emergency = () => {
  const emergencyServices = [
    { name: "Скорая помощь", number: "103" },
    { name: "Полиция", number: "102" },
    { name: "МЧС", number: "101" },
    { name: "Единый номер экстренных служб", number: "112" },
  ];

  const evacuators = [
    { name: 'Мото-Помощь (круглосуточно)', number: '+7 (912) 345-67-89' },
    { name: 'Эвакуатор "Два колеса"', number: '+7 (922) 123-45-67' },
    { name: 'Техпомощь на дороге', number: '+7 (3452) 11-22-33' },
  ];

  const legal = [
    { name: 'Мотоадвокат (ДТП, споры со страховыми)', number: '+7 (912) 987-65-43' },
    { name: 'Центр защиты прав водителей', number: '+7 (3452) 55-66-77' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-8">Экстренные контакты</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-6 border-2 border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Ambulance" className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-red-700 dark:text-red-400">Экстренные службы</h2>
            </div>
            <div className="space-y-3">
              {emergencyServices.map((service, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">{service.name}</span>
                  <a 
                    href={`tel:${service.number}`}
                    className="text-2xl font-bold text-red-600 dark:text-red-400 hover:text-red-700"
                  >
                    {service.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Wrench" className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400">Эвакуаторы и помощь</h2>
            </div>
            <div className="space-y-3">
              {evacuators.map((service, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{service.name}</span>
                  <a 
                    href={`tel:${service.number.replace(/[^0-9+]/g, '')}`}
                    className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 whitespace-nowrap ml-2"
                  >
                    {service.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-6 border-2 border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Scale" className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-bold text-amber-700 dark:text-amber-400">Юридическая помощь</h2>
          </div>
          <div className="space-y-3">
            {legal.map((service, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{service.name}</span>
                <a 
                  href={`tel:${service.number.replace(/[^0-9+]/g, '')}`}
                  className="text-lg font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 whitespace-nowrap ml-2"
                >
                  {service.number}
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Emergency;