import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

interface AdminPasswordSettingsProps {
  adminApi: string;
}

export const AdminPasswordSettings: React.FC<AdminPasswordSettingsProps> = ({ adminApi }) => {
  const { user, token } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const isCEO = user?.role === 'ceo';

  const handleChangePassword = async () => {
    if (!isCEO) {
      setError('Только главный администратор может менять пароль');
      return;
    }

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
      const res = await fetch(`${adminApi}?action=admin-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess('Пароль успешно изменён');
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Lock" className="w-5 h-5" />
          Пароль администратора
        </CardTitle>
        <CardDescription>
          {isCEO 
            ? 'Измените пароль для доступа к админ-панели' 
            : 'Только главный администратор (CEO) может менять пароль'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCEO && (
          <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-sm p-3 rounded flex items-start gap-2">
            <Icon name="AlertTriangle" className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>У вас нет прав для изменения пароля администратора</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Текущий пароль</label>
          <Input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Введите текущий пароль"
            disabled={loading || !isCEO}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Новый пароль</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Минимум 6 символов"
            disabled={loading || !isCEO}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Подтвердите новый пароль</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Повторите новый пароль"
            disabled={loading || !isCEO}
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
          disabled={loading || !isCEO || !oldPassword || !newPassword || !confirmPassword}
          className="w-full"
        >
          {loading ? 'Изменение...' : 'Изменить пароль'}
        </Button>
      </CardContent>
    </Card>
  );
};
