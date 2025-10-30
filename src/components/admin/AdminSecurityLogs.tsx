import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityLog {
  id: number;
  event_type: string;
  severity: string;
  ip_address: string;
  user_id?: number;
  user_name?: string;
  user_email?: string;
  endpoint: string;
  method: string;
  details: any;
  user_agent: string;
  created_at: string;
}

interface AdminSecurityLogsProps {
  adminApi: string;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-600 text-white';
    case 'high': return 'bg-red-500 text-white';
    case 'medium': return 'bg-yellow-500 text-white';
    case 'low': return 'bg-blue-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'rate_limit': return 'ShieldAlert';
    case 'auth_failed': return 'UserX';
    case 'invalid_token': return 'KeyRound';
    case 'unauthorized_access': return 'Ban';
    case 'xss_attempt': return 'Code';
    case 'sql_injection': return 'Database';
    default: return 'AlertTriangle';
  }
};

const getEventLabel = (eventType: string) => {
  switch (eventType) {
    case 'rate_limit': return 'Превышен лимит запросов';
    case 'auth_failed': return 'Ошибка авторизации';
    case 'invalid_token': return 'Неверный токен';
    case 'unauthorized_access': return 'Несанкционированный доступ';
    case 'xss_attempt': return 'Попытка XSS';
    case 'sql_injection': return 'Попытка SQL инъекции';
    default: return eventType;
  }
};

type LogType = 'security' | 'all';

export const AdminSecurityLogs: React.FC<AdminSecurityLogsProps> = ({ adminApi }) => {
  const { token, user } = useAuth();
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [logType, setLogType] = useState<LogType>('security');
  const limit = 50;

  const isCEO = user?.role === 'ceo';

  useEffect(() => {
    if (!isCEO || !token) return;

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${adminApi}?action=security-logs&page=${page}&limit=${limit}`, {
          headers: { 'X-Auth-Token': token }
        });

        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error('Failed to fetch security logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [adminApi, token, page, isCEO]);

  if (!isCEO) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Icon name="Lock" className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Только главный администратор (CEO) имеет доступ к логам безопасности
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка логов...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={logType === 'security' ? 'default' : 'outline'}
          onClick={() => {
            setLogType('security');
            setPage(1);
          }}
          className="flex items-center gap-2"
        >
          <Icon name="Shield" className="w-4 h-4" />
          Безопасность
        </Button>
        <Button
          variant={logType === 'all' ? 'default' : 'outline'}
          onClick={() => {
            setLogType('all');
            setPage(1);
          }}
          className="flex items-center gap-2"
        >
          <Icon name="FileText" className="w-4 h-4" />
          Все логи
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name={logType === 'security' ? 'Shield' : 'FileText'} className="w-5 h-5" />
            {logType === 'security' ? 'Логи безопасности' : 'Все логи'}
          </CardTitle>
          <CardDescription>
            {logType === 'security' 
              ? `История попыток взлома и подозрительной активности. Всего событий: ${total}`
              : `Полная история всех действий в системе. Всего событий: ${total}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="CheckCircle" className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <p>Подозрительной активности не обнаружено</p>
              </div>
            ) : (
              logs.map((log) => (
                <Card key={log.id} className="border-l-4" style={{
                  borderLeftColor: log.severity === 'critical' ? '#dc2626' : 
                                  log.severity === 'high' ? '#ef4444' : 
                                  log.severity === 'medium' ? '#eab308' : '#3b82f6'
                }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon 
                            name={getEventIcon(log.event_type)} 
                            className="w-4 h-4 flex-shrink-0" 
                          />
                          <span className="font-medium">{getEventLabel(log.event_type)}</span>
                          <Badge className={getSeverityColor(log.severity)}>
                            {log.severity.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Icon name="Globe" className="w-3 h-3" />
                            <span className="font-mono">{log.ip_address}</span>
                          </div>

                          {log.user_name && (
                            <div className="flex items-center gap-2">
                              <Icon name="User" className="w-3 h-3" />
                              <span>{log.user_name} ({log.user_email})</span>
                            </div>
                          )}

                          {log.endpoint && (
                            <div className="flex items-center gap-2">
                              <Icon name="Link" className="w-3 h-3" />
                              <span className="font-mono">{log.method} {log.endpoint}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Icon name="Clock" className="w-3 h-3" />
                            <span>{new Date(log.created_at).toLocaleString('ru-RU')}</span>
                          </div>
                        </div>

                        {log.details && Object.keys(log.details).length > 0 && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm text-primary hover:underline">
                              Детали
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <Icon name="ChevronLeft" className="w-4 h-4 mr-2" />
                Назад
              </Button>

              <span className="text-sm text-muted-foreground">
                Страница {page} из {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Вперёд
                <Icon name="ChevronRight" className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};