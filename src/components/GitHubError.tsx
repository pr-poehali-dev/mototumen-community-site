import React from 'react';
import Icon from '@/components/ui/icon';

interface GitHubErrorProps {
  onClose?: () => void;
  onRetry?: () => void;
}

export default function GitHubError({ onClose, onRetry }: GitHubErrorProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          <h2 className="text-white text-xl font-semibold mb-4">
            Подключение GitHub
          </h2>
          
          <div className="w-12 h-12 mx-auto mb-4 text-red-500">
            <Icon name="X" size={48} className="w-full h-full" />
          </div>
          
          <p className="text-gray-300 mb-2">
            Не удалось подключить GitHub.
          </p>
          
          <div className="bg-red-900/30 border border-red-800 rounded-md p-3 mb-6">
            <p className="text-red-400 text-sm">
              Connection failed after 5 attempts: 403
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Повторить
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}