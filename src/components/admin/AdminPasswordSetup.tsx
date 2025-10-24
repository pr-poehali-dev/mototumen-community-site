import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AdminPasswordSetupProps {
  onPasswordSet: () => void;
  adminApi: string;
}

export const AdminPasswordSetup: React.FC<AdminPasswordSetupProps> = ({ onPasswordSet, adminApi }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${adminApi}?action=admin-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passwordAction: 'setup', password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onPasswordSet();
      } else {
        setError(data.error || 'Ошибка установки пароля');
      }
    } catch (err) {
      setError('Не удалось установить пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card p-8 rounded-lg shadow-xl max-w-md w-full border border-border">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Icon name="Lock" className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Установка пароля администратора</h2>
          <p className="text-sm text-muted-foreground">
            Это ваш первый вход в админку. Установите пароль для защиты панели управления.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Новый пароль</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Подтвердите пароль</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите пароль"
              disabled={loading}
              onKeyDown={(e) => e.key === 'Enter' && handleSetup()}
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded flex items-start gap-2">
              <Icon name="AlertCircle" className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            onClick={handleSetup}
            disabled={loading || !password || !confirmPassword}
            className="w-full"
          >
            {loading ? 'Установка...' : 'Установить пароль'}
          </Button>
        </div>
      </div>
    </div>
  );
};
