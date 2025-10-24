interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.cleanup();
  }

  private cleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.limits.entries()) {
        if (now > entry.resetTime) {
          this.limits.delete(key);
        }
      }
    }, this.windowMs);
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    if (!entry || now > entry.resetTime) {
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return { allowed: true, remaining: this.maxRequests - 1, resetTime: now + this.windowMs };
    }

    if (entry.count >= this.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    entry.count++;
    return { allowed: true, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime };
  }

  reset(identifier: string) {
    this.limits.delete(identifier);
  }
}

export const authRateLimiter = new RateLimiter(5, 60000);
export const apiRateLimiter = new RateLimiter(30, 60000);
export const adminRateLimiter = new RateLimiter(50, 60000);

export const checkRateLimit = (identifier: string, limiter: RateLimiter = apiRateLimiter) => {
  const result = limiter.check(identifier);
  
  if (!result.allowed) {
    const waitTime = Math.ceil((result.resetTime - Date.now()) / 1000);
    throw new Error(`Rate limit exceeded. Try again in ${waitTime} seconds`);
  }
  
  return result;
};
