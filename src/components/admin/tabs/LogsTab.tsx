import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  source?: string;
  details?: any;
}

const LogsTab: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (!isPaused && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const addLog = (level: LogEntry['level'], message: string, source?: string, details?: any) => {
    const newLog: LogEntry = {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toISOString(),
      level,
      message,
      source,
      details
    };
    
    setLogs(prev => {
      const updated = [...prev, newLog];
      if (updated.length > 500) {
        return updated.slice(-500);
      }
      return updated;
    });
  };

  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    console.log = (...args) => {
      originalConsoleLog(...args);
      addLog('info', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), 'console.log', args);
    };

    console.warn = (...args) => {
      originalConsoleWarn(...args);
      addLog('warning', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), 'console.warn', args);
    };

    console.error = (...args) => {
      originalConsoleError(...args);
      addLog('error', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), 'console.error', args);
    };

    const handleFetch = () => {
      addLog('info', 'HTTP запрос выполнен', 'fetch');
    };

    window.addEventListener('fetch', handleFetch);

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
      addLog('info', `Запрос: ${url}`, 'fetch');
      
      try {
        const response = await originalFetch(...args);
        const status = response.status;
        
        if (status >= 200 && status < 300) {
          addLog('success', `Ответ ${status}: ${url}`, 'fetch');
        } else if (status >= 400) {
          addLog('error', `Ошибка ${status}: ${url}`, 'fetch');
        } else {
          addLog('warning', `Статус ${status}: ${url}`, 'fetch');
        }
        
        return response;
      } catch (error) {
        addLog('error', `Ошибка запроса: ${url} - ${error}`, 'fetch', error);
        throw error;
      }
    };

    window.addEventListener('error', (event) => {
      addLog('error', `Ошибка: ${event.message}`, 'window.error', event);
    });

    window.addEventListener('unhandledrejection', (event) => {
      addLog('error', `Необработанное отклонение: ${event.reason}`, 'promise.reject', event.reason);
    });

    addLog('success', 'Мониторинг логов запущен', 'system');

    return () => {
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
      window.removeEventListener('fetch', handleFetch);
      window.fetch = originalFetch;
    };
  }, []);

  const filteredLogs = logs.filter(log => filter === 'all' || log.level === filter);

  const clearLogs = () => {
    setLogs([]);
    addLog('info', 'Логи очищены', 'system');
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'success': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'AlertCircle';
      case 'warning': return 'AlertTriangle';
      case 'success': return 'CheckCircle';
      default: return 'Info';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-[#004488]' : ''}
          >
            Все ({logs.length})
          </Button>
          <Button
            size="sm"
            variant={filter === 'info' ? 'default' : 'outline'}
            onClick={() => setFilter('info')}
            className={filter === 'info' ? 'bg-blue-600' : ''}
          >
            <Icon name="Info" className="h-3 w-3 mr-1" />
            Info
          </Button>
          <Button
            size="sm"
            variant={filter === 'success' ? 'default' : 'outline'}
            onClick={() => setFilter('success')}
            className={filter === 'success' ? 'bg-green-600' : ''}
          >
            <Icon name="CheckCircle" className="h-3 w-3 mr-1" />
            Success
          </Button>
          <Button
            size="sm"
            variant={filter === 'warning' ? 'default' : 'outline'}
            onClick={() => setFilter('warning')}
            className={filter === 'warning' ? 'bg-yellow-600' : ''}
          >
            <Icon name="AlertTriangle" className="h-3 w-3 mr-1" />
            Warning
          </Button>
          <Button
            size="sm"
            variant={filter === 'error' ? 'default' : 'outline'}
            onClick={() => setFilter('error')}
            className={filter === 'error' ? 'bg-red-600' : ''}
          >
            <Icon name="AlertCircle" className="h-3 w-3 mr-1" />
            Error
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPaused(!isPaused)}
            className="border-dark-700"
          >
            <Icon name={isPaused ? 'Play' : 'Pause'} className="h-3 w-3 mr-1" />
            {isPaused ? 'Продолжить' : 'Пауза'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={clearLogs}
            className="border-dark-700 text-red-400 hover:text-red-300"
          >
            <Icon name="Trash2" className="h-3 w-3 mr-1" />
            Очистить
          </Button>
        </div>
      </div>

      <div 
        ref={logsContainerRef}
        className="bg-dark-800/50 rounded-lg border border-dark-700 p-4 h-[600px] overflow-y-auto font-mono text-sm"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <Icon name="FileText" className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Логи отсутствуют</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div 
                key={log.id}
                className={`p-3 rounded border ${getLevelColor(log.level)} flex gap-3 items-start`}
              >
                <Icon name={getLevelIcon(log.level)} className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs opacity-60">
                      {new Date(log.timestamp).toLocaleTimeString('ru-RU')}
                    </span>
                    {log.source && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {log.source}
                      </Badge>
                    )}
                  </div>
                  <div className="break-words">{log.message}</div>
                  {log.details && typeof log.details === 'object' && (
                    <details className="mt-2 text-xs opacity-70">
                      <summary className="cursor-pointer hover:opacity-100">Детали</summary>
                      <pre className="mt-2 p-2 bg-black/20 rounded overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Icon name="Activity" className="h-3 w-3" />
        <span>Отображено: {filteredLogs.length} из {logs.length} логов</span>
        {isPaused && (
          <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">
            На паузе
          </Badge>
        )}
      </div>
    </div>
  );
};

export default LogsTab;
