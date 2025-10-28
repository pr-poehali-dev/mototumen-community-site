import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

interface AdminPasswordSettingsProps {
  adminApi: string;
  users: any[];
  onPasswordReset?: () => void;
}

export const AdminPasswordSettings: React.FC<AdminPasswordSettingsProps> = ({ 
  adminApi, 
  users,
  onPasswordReset 
}) => {
  const { user, token } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState<number | null>(null);

  const isCEO = user?.role === 'ceo';
  const adminUsers = users.filter(u => ['admin', 'ceo', 'moderator'].includes(u.role));

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setError('Новый пароль должен быть не менее 6 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${adminApi}?action=change-my-admin-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess('Ваш пароль успешно изменён');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Ошибка смены пароля');
      }
    } catch (err) {
      setError('Не удалось изменить пароль');
    } finally {
      setLoading(false);
    }
  };

  const handleResetUserPassword = async (userId: number, userName: string) => {
    if (!confirm(`Сбросить пароль пользователя ${userName}? Он должен будет установить новый при следующем входе.`)) {
      return;
    }

    setResetLoading(userId);

    try {
      const res = await fetch(`${adminApi}?action=reset-admin-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify({ userId })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(`Пароль пользователя ${userName} сброшен. Он должен установить новый при входе.`);
        onPasswordReset?.();
      } else {
        alert(data.error || 'Ошибка сброса пароля');
      }
    } catch (err) {
      alert('Не удалось сбросить пароль');
    } finally {
      setResetLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Lock" className="w-5 h-5" />
            Мой пароль администратора
          </CardTitle>
          <CardDescription>
            Смените ваш личный пароль для входа в админ-панель
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Текущий пароль</label>
            <Input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Введите текущий пароль"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Новый пароль</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Подтвердите новый пароль</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите новый пароль"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded flex items-start gap-2">
              <Icon name="AlertCircle" className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 text-green-600 dark:text-green-400 text-sm p-3 rounded flex items-start gap-2">
              <Icon name="CheckCircle" className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <Button
            onClick={handleChangePassword}
            disabled={loading || !oldPassword || !newPassword || !confirmPassword}
            className="w-full"
          >
            {loading ? 'Изменение...' : 'Изменить мой пароль'}
          </Button>
        </CardContent>
      </Card>

      {isCEO && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="ShieldAlert" className="w-5 h-5" />
              Управление паролями администраторов
            </CardTitle>
            <CardDescription>
              Только для CEO: сбросьте пароль любого администратора
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {adminUsers.map((adminUser) => (
                <div
                  key={adminUser.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={adminUser.avatar_url || '/img/default-avatar.jpg'}
                      alt={adminUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{adminUser.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {adminUser.role} • {adminUser.has_admin_password ? '🔒 Пароль установлен' : '⚠️ Без пароля'}
                      </p>
                    </div>
                  </div>
                  {adminUser.id !== user?.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetUserPassword(adminUser.id, adminUser.name)}
                      disabled={resetLoading === adminUser.id}
                    >
                      {resetLoading === adminUser.id ? (
                        'Сброс...'
                      ) : (
                        <>
                          <Icon name="RefreshCw" className="w-4 h-4 mr-2" />
                          Сбросить пароль
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
