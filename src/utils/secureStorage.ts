const STORAGE_PREFIX = 'mtfr_';
const TOKEN_KEY = `${STORAGE_PREFIX}token`;
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

interface StorageItem {
  value: string;
  timestamp: number;
}

export const secureStorage = {
  setToken: (token: string) => {
    const item: StorageItem = {
      value: token,
      timestamp: Date.now()
    };
    localStorage.setItem(TOKEN_KEY, JSON.stringify(item));
  },

  getToken: (): string | null => {
    try {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (!stored) return null;

      const item: StorageItem = JSON.parse(stored);
      
      if (Date.now() - item.timestamp > SESSION_TIMEOUT) {
        secureStorage.removeToken();
        return null;
      }

      return item.value;
    } catch {
      return null;
    }
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  clear: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },

  setItem: (key: string, value: string) => {
    const item: StorageItem = {
      value,
      timestamp: Date.now()
    };
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(item));
  },

  getItem: (key: string, maxAge?: number): string | null => {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!stored) return null;

      const item: StorageItem = JSON.parse(stored);
      
      if (maxAge && Date.now() - item.timestamp > maxAge) {
        secureStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch {
      return null;
    }
  },

  removeItem: (key: string) => {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  }
};
