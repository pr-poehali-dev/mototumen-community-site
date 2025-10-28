import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AdminPasswordVerifyProps {
  onVerified: () => void;
  adminApi: string;
  token: string;
  userName?: string;
}

export const AdminPasswordVerify: React.FC<AdminPasswordVerifyProps> = ({ onVerified, adminApi, token, userName }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${adminApi}?action=verify-my-admin-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        onVerified();
      } else {
        setError('Неверный пароль');
        setPassword('');
      }
    } catch (err) {
      setError('Ошибка проверки пароля');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setResetLoading(true);
    setError('');

    try {
      const res = await fetch(`${adminApi}?action=request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        }
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResetRequested(true);
      } else {
        setError(data.error || 'Ошибка запроса');
      }
    } catch (err) {
      setError('Не удалось отправить запрос');
    } finally {
      setResetLoading(false);
    }
  };

  if (resetRequested) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card p-8 rounded-lg shadow-xl max-w-md w-full border border-border">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
              <Icon name="CheckCircle" className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Запрос отправлен</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Ваш запрос на сброс пароля отправлен CEO. Ждите подтверждения.
            </p>
            <p className="text-xs text-muted-foreground">
              После одобрения вам нужно будет установить новый пароль при входе.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card p-8 rounded-lg shadow-xl max-w-md w-full border border-border">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
            <Icon name="Shield" className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Вход в админку</h2>
          <p className="text-sm text-muted-foreground">
            Введите пароль администратора для доступа к панели управления
          </p>
          {userName && (
            <p className="text-xs text-muted-foreground mt-2">
              Привет, {userName}! 👋
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Пароль администратора</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              disabled={loading}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded flex items-start gap-2">
              <Icon name="AlertCircle" className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            onClick={handleVerify}
            disabled={loading || !password}
            className="w-full"
          >
            {loading ? 'Проверка...' : 'Войти'}
          </Button>

          <Button
            variant="ghost"
            onClick={handleForgotPassword}
            disabled={resetLoading}
            className="w-full text-sm"
          >
            {resetLoading ? (
              'Отправка запроса...'
            ) : (
              <>
                <Icon name="HelpCircle" className="w-4 h-4 mr-2" />
                Забыли пароль? Запросить сброс у CEO
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};