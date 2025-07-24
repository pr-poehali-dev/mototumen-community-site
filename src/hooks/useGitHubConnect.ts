import { useState } from 'react';

export interface GitHubConnectOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useGitHubConnect(options?: GitHubConnectOptions) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Симуляция попытки подключения к GitHub
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Симуляция ошибки 403 после 5 попыток
      const shouldFail = Math.random() > 0.3;
      
      if (shouldFail) {
        throw new Error('Connection failed after 5 attempts: 403');
      }
      
      options?.onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      options?.onError?.(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const retry = () => {
    setError(null);
    connect();
  };

  const clearError = () => {
    setError(null);
  };

  return {
    connect,
    retry,
    clearError,
    isConnecting,
    error,
    hasError: !!error
  };
}