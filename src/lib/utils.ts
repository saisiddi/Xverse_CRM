export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function generateId(): string {
  return crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const k = typeof key === 'function' ? key(item) : String(item[key]);
    (acc[k] = acc[k] || []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(array: T[], key: keyof T | ((item: T) => any), direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export function sumBy<T>(array: T[], key: keyof T | ((item: T) => number)): number {
  return array.reduce((sum, item) => sum + (typeof key === 'function' ? key(item) : Number(item[key])), 0);
}

export function averageBy<T>(array: T[], key: keyof T | ((item: T) => number)): number {
  if (array.length === 0) return 0;
  return sumBy(array, key) / array.length;
}

export function uniqueBy<T>(array: T[], key: keyof T | ((item: T) => string)): T[] {
  const seen = new Set<string>();
  return array.filter(item => {
    const k = typeof key === 'function' ? key(item) : String(item[key]);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}