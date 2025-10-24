export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
};

export const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Пароль должен быть не менее 6 символов');
  }
  
  if (password.length > 128) {
    errors.push('Пароль слишком длинный');
  }
  
  return { valid: errors.length === 0, errors };
};

export const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  return input.trim().slice(0, maxLength);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};

export const preventXSS = (obj: any): any => {
  if (typeof obj === 'string') {
    return sanitizeHtml(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(preventXSS);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = preventXSS(value);
    }
    return sanitized;
  }
  
  return obj;
};
