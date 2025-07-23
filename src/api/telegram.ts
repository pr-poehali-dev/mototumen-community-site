export interface TelegramChannelData {
  memberCount: number;
  title: string;
  error?: string;
}

export async function getTelegramChannelData(channelUsername: string): Promise<TelegramChannelData> {
  try {
    // Используем публичный API для получения информации о канале
    // В production следует использовать серверный endpoint с Telegram Bot API
    const response = await fetch(`https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}/getChat?chat_id=@${channelUsername}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch channel data');
    }
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.description || 'Telegram API error');
    }
    
    // Получаем количество участников
    const membersResponse = await fetch(`https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}/getChatMemberCount?chat_id=@${channelUsername}`);
    const membersData = await membersResponse.json();
    
    return {
      memberCount: membersData.ok ? membersData.result : 400,
      title: data.result.title || 'MotoTyumen',
    };
    
  } catch (error) {
    console.warn('Failed to fetch Telegram data:', error);
    // Fallback значения при ошибке
    return {
      memberCount: 400,
      title: 'MotoTyumen',
      error: 'Failed to sync with Telegram'
    };
  }
}

// Кэш для данных канала (обновляется каждые 10 минут)
let cachedData: TelegramChannelData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 минут

export async function getCachedTelegramData(): Promise<TelegramChannelData> {
  const now = Date.now();
  
  if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedData;
  }
  
  const data = await getTelegramChannelData('MotoTyumen');
  cachedData = data;
  lastFetchTime = now;
  
  return data;
}