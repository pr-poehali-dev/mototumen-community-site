import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

const BecomeOrganization: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const benefits = [
    {
      icon: "Store",
      title: "Разместите свою карточку",
      description: "Магазин, сервис или мотошкола — покажите себя мотосообществу Тюмени"
    },
    {
      icon: "Users",
      title: "Найдите клиентов",
      description: "Доступ к активному комьюнити мотоциклистов вашего города"
    },
    {
      icon: "MessageCircle",
      title: "Получайте отзывы",
      description: "Пользователи смогут оставлять отзывы и рейтинги вашей организации"
    },
    {
      icon: "TrendingUp",
      title: "Развивайте бизнес",
      description: "Аналитика, статистика просмотров и взаимодействий с вашей карточкой"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Заполните заявку",
      description: "Укажите информацию о вашей организации, контакты и описание услуг"
    },
    {
      number: "2",
      title: "Дождитесь проверки",
      description: "CEO проверит вашу заявку и свяжется с вами для уточнения деталей"
    },
    {
      number: "3",
      title: "Начните работу",
      description: "После одобрения получите доступ к панели управления вашей карточкой"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#004488] rounded-full mb-6">
            <Icon name="Building2" size={40} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-['Oswald']">
            Стать организацией
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Присоединяйтесь к мотосообществу Тюмени как организация и найдите новых клиентов
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center font-['Oswald']">
            Что вы получите
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-dark-800 border border-dark-600 rounded-lg p-6 hover:border-[#004488] transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#004488]/20 rounded-lg flex items-center justify-center">
                    <Icon name={benefit.icon as any} size={24} className="text-[#004488]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center font-['Oswald']">
            Как это работает
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="bg-dark-800 border border-dark-600 rounded-lg p-6 flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[#004488] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#004488] to-[#0066cc] rounded-lg p-8 sm:p-12 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-['Oswald']">
              Готовы начать?
            </h2>
            <p className="text-gray-200 mb-6">
              Заполните заявку и станьте частью мотосообщества Тюмени
            </p>
            <Button
              onClick={() => {
                if (!isAuthenticated) {
                  setShowAuthModal(true);
                } else {
                  navigate('/organization-register');
                }
              }}
              size="lg"
              className="bg-white text-[#004488] hover:bg-gray-100 font-semibold text-lg px-8 py-6"
            >
              <Icon name="Rocket" className="mr-2" size={24} />
              Начать регистрацию
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Есть вопросы? Напишите нам в{" "}
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

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        message="Только авторизованные пользователи могут создать заявку на регистрацию организации"
      />
    </div>
  );
};

export default BecomeOrganization;