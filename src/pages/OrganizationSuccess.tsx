import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const OrganizationSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-6">
          <Icon name="CheckCircle2" size={60} className="text-green-500" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-['Oswald']">
          Заявка успешно отправлена!
        </h1>
        
        <p className="text-lg text-gray-300 mb-6">
          Спасибо за интерес к нашему сообществу! Ваша заявка на регистрацию организации получена и будет рассмотрена администрацией в ближайшее время.
        </p>
        
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Icon name="Clock" className="mr-2" size={24} />
            Что дальше?
          </h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <Icon name="Check" className="text-green-500 mr-2 flex-shrink-0 mt-1" size={20} />
              <span>Администратор проверит вашу заявку в течение 1-3 рабочих дней</span>
            </li>
            <li className="flex items-start">
              <Icon name="Check" className="text-green-500 mr-2 flex-shrink-0 mt-1" size={20} />
              <span>При необходимости с вами свяжутся для уточнения деталей</span>
            </li>
            <li className="flex items-start">
              <Icon name="Check" className="text-green-500 mr-2 flex-shrink-0 mt-1" size={20} />
              <span>После одобрения вы получите доступ к панели управления организацией</span>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-[#004488] hover:bg-[#0055aa] text-white font-semibold"
          >
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            На главную
          </Button>
          <Button
            onClick={() => navigate('/profile')}
            variant="outline"
            className="border-dark-600 text-gray-300 hover:bg-dark-700"
          >
            <Icon name="User" className="mr-2" size={20} />
            Мой профиль
          </Button>
        </div>
        
        <div className="mt-8 text-gray-400 text-sm">
          <p>
            Есть вопросы? Свяжитесь с нами в{" "}
            <a 
              href="https://t.me/+QgiLIa1gFRY4Y2Iy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#004488] hover:underline"
            >
              Telegram
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSuccess;