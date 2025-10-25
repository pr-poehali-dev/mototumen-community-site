import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { AdminSecurityLogs } from './AdminSecurityLogs';
import { AdminPasswordSettings } from './AdminPasswordSettings';
import { AdminDocuments } from './AdminDocuments';

interface SettingsMenuProps {
  adminApi: string;
}

type SettingSection = 'logs' | 'password' | 'documents';

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ adminApi }) => {
  const [activeSection, setActiveSection] = useState<SettingSection>('logs');

  const menuItems = [
    {
      id: 'logs' as SettingSection,
      icon: 'FileText',
      label: 'Логи',
      description: 'Журнал событий безопасности и подозрительной активности'
    },
    {
      id: 'password' as SettingSection,
      icon: 'Lock',
      label: 'Аккаунт',
      description: 'Обновление пароля администратора'
    },
    {
      id: 'documents' as SettingSection,
      icon: 'Shield',
      label: 'Документы',
      description: 'Редактирование политики конфиденциальности, соглашения и disclaimer'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap justify-start">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all min-w-[120px] ${
              activeSection === item.id
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-card border-border hover:bg-accent'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              activeSection === item.id ? 'bg-primary/20' : 'bg-primary/10'
            }`}>
              <Icon name={item.icon as any} className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-center">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-border pt-6">
        {activeSection === 'logs' && (
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Icon name="FileText" className="w-6 h-6" />
              Логи безопасности
            </h2>
            <p className="text-muted-foreground mb-6">
              История попыток взлома и подозрительной активности. Всего событий: 0
            </p>
            <AdminSecurityLogs adminApi={adminApi} />
          </div>
        )}

        {activeSection === 'password' && (
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Icon name="Lock" className="w-6 h-6" />
              Пароль администратора
            </h2>
            <p className="text-muted-foreground mb-6">
              Измените пароль для доступа к админ-панели
            </p>
            <AdminPasswordSettings adminApi={adminApi} />
          </div>
        )}

        {activeSection === 'documents' && (
          <div>
            <AdminDocuments />
          </div>
        )}
      </div>
    </div>
  );
};