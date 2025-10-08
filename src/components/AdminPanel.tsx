import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className="text-2xl font-bold text-white flex items-center"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  <Icon name="Shield" className="h-6 w-6 mr-2 text-accent" />
                  Панель администратора
                </h2>
                <p className="text-zinc-400">Управление содержимым сайта</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-zinc-800"
              >
                <Icon name="X" className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-zinc-700">
                  Управление пользователями
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => handleSectionClick('users-all')}
                    className="h-auto py-4 px-6 bg-zinc-800 hover:bg-blue-900/30 border border-zinc-700 hover:border-blue-500 transition-all flex flex-col items-start gap-2"
                    variant="ghost"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon name="Users" className="h-6 w-6 text-blue-500" />
                      <span className="text-base font-semibold text-white">Все пользователи</span>
                    </div>
                    <p className="text-xs text-zinc-400 text-left">
                      Просмотр и управление всеми пользователями
                    </p>
                  </Button>

                  <Button
                    onClick={() => handleSectionClick('users-roles')}
                    className="h-auto py-4 px-6 bg-zinc-800 hover:bg-green-900/30 border border-zinc-700 hover:border-green-500 transition-all flex flex-col items-start gap-2"
                    variant="ghost"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon name="UserCheck" className="h-6 w-6 text-green-500" />
                      <span className="text-base font-semibold text-white">Роли и права</span>
                    </div>
                    <p className="text-xs text-zinc-400 text-left">
                      Управление ролями и правами доступа
                    </p>
                  </Button>

                  <Button
                    onClick={() => handleSectionClick('users-moderation')}
                    className="h-auto py-4 px-6 bg-zinc-800 hover:bg-red-900/30 border border-zinc-700 hover:border-red-500 transition-all flex flex-col items-start gap-2"
                    variant="ghost"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon name="Shield" className="h-6 w-6 text-red-500" />
                      <span className="text-base font-semibold text-white">Модерация</span>
                    </div>
                    <p className="text-xs text-zinc-400 text-left">
                      Блокировка пользователей и жалобы
                    </p>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-zinc-700">
                  Управление контентом
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => handleSectionClick('content-shops')}
                    className="h-auto py-4 px-6 bg-zinc-800 hover:bg-purple-900/30 border border-zinc-700 hover:border-purple-500 transition-all flex flex-col items-start gap-2"
                    variant="ghost"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon name="Store" className="h-6 w-6 text-purple-500" />
                      <span className="text-base font-semibold text-white">Магазины</span>
                    </div>
                    <p className="text-xs text-zinc-400 text-left">
                      Управление магазинами и товарами
                    </p>
                  </Button>

                  <Button
                    onClick={() => handleSectionClick('content-schools')}
                    className="h-auto py-4 px-6 bg-zinc-800 hover:bg-orange-900/30 border border-zinc-700 hover:border-orange-500 transition-all flex flex-col items-start gap-2"
                    variant="ghost"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon name="GraduationCap" className="h-6 w-6 text-orange-500" />
                      <span className="text-base font-semibold text-white">Мотошколы</span>
                    </div>
                    <p className="text-xs text-zinc-400 text-left">
                      Создание и редактирование мотошкол
                    </p>
                  </Button>

                  <Button
                    onClick={() => handleSectionClick('content-services')}
                    className="h-auto py-4 px-6 bg-zinc-800 hover:bg-yellow-900/30 border border-zinc-700 hover:border-yellow-500 transition-all flex flex-col items-start gap-2"
                    variant="ghost"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon name="Wrench" className="h-6 w-6 text-yellow-500" />
                      <span className="text-base font-semibold text-white">Сервисы</span>
                    </div>
                    <p className="text-xs text-zinc-400 text-left">
                      Управление сервисными центрами
                    </p>
                  </Button>

                  <Button
                    onClick={() => handleSectionClick('content-announcements')}
                    className="h-auto py-4 px-6 bg-zinc-800 hover:bg-indigo-900/30 border border-zinc-700 hover:border-indigo-500 transition-all flex flex-col items-start gap-2"
                    variant="ghost"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon name="Megaphone" className="h-6 w-6 text-indigo-500" />
                      <span className="text-base font-semibold text-white">Объявления</span>
                    </div>
                    <p className="text-xs text-zinc-400 text-left">
                      Управление объявлениями и модерация
                    </p>
                  </Button>

                  <Button
                    onClick={() => handleSectionClick('content-notifications')}
                    className="h-auto py-4 px-6 bg-zinc-800 hover:bg-teal-900/30 border border-zinc-700 hover:border-teal-500 transition-all flex flex-col items-start gap-2"
                    variant="ghost"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon name="Mail" className="h-6 w-6 text-teal-500" />
                      <span className="text-base font-semibold text-white">Уведомления</span>
                    </div>
                    <p className="text-xs text-zinc-400 text-left">
                      Email и SMS рассылки
                    </p>
                  </Button>

                  <Button
                    onClick={() => handleSectionClick('content-settings')}
                    className="h-auto py-4 px-6 bg-zinc-800 hover:bg-gray-700 border border-zinc-700 hover:border-gray-500 transition-all flex flex-col items-start gap-2"
                    variant="ghost"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon name="Settings" className="h-6 w-6 text-gray-400" />
                      <span className="text-base font-semibold text-white">Настройки</span>
                    </div>
                    <p className="text-xs text-zinc-400 text-left">
                      Общие настройки сайта
                    </p>
                  </Button>
                </div>
              </div>
            </div>

            {activeSection && (
              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 text-sm">
                  <Icon name="Info" className="h-4 w-4 inline mr-2" />
                  Выбрана секция: <strong>{activeSection}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
