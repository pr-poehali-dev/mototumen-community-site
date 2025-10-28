import { useState } from 'react';
import Icon from '@/components/ui/icon';

export default function DiagonalRibbon() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-red-600 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <p className="text-white font-medium text-sm md:text-base">
          Платформа доступна, но на данный момент находится в разработке
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:bg-red-700 rounded-full p-1 transition-colors"
          aria-label="Закрыть"
        >
          <Icon name="X" size={20} />
        </button>
      </div>
    </div>
  );
}