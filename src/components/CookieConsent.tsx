import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/95 backdrop-blur-sm border-t border-zinc-800 animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 flex items-start gap-3">
            <Icon name="Cookie" className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-zinc-100 mb-1">
                <span className="font-semibold">Мы используем cookies</span>
              </p>
              <p className="text-xs text-zinc-400">
                Этот сайт использует файлы cookie для улучшения работы и анализа посещаемости. 
                Продолжая использовать сайт, вы соглашаетесь с использованием cookies.{' '}
                <a href="/privacy" className="text-accent hover:underline">
                  Подробнее
                </a>
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="flex-1 sm:flex-none border-zinc-700 hover:bg-zinc-800"
            >
              Отклонить
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="flex-1 sm:flex-none bg-accent hover:bg-accent/90"
            >
              <Icon name="Check" className="w-4 h-4 mr-2" />
              Принять
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
