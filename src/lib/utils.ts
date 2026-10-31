import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function estimateReadingTime(text: string): number {
  if (!text) return 1;
  const clean = text.replace(/<[^>]*>?/gm, '');
  const wordCount = clean.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function formatDate(dateStringOrDate: string | Date, lang: 'so' | 'en' = 'so'): string {
  if (!dateStringOrDate) return '';
  const date = new Date(dateStringOrDate);
  if (isNaN(date.getTime())) return '';

  const monthsSo = [
    'Jannaayo', 'Febraayo', 'Maarso', 'Abriil', 'May', 'Juun',
    'Luulyo', 'Ogosto', 'Sebtembar', 'Oktoobar', 'Nofembar', 'Diseembar'
  ];

  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const day = date.getDate();
  const year = date.getFullYear();
  const month = lang === 'so' ? monthsSo[date.getMonth()] : monthsEn[date.getMonth()];

  if (lang === 'so') {
    return `${day} ${month}, ${year}`;
  }
  return `${month} ${day}, ${year}`;
}

export function formatTimeAgo(dateStringOrDate: string | Date, lang: 'so' | 'en' = 'so'): string {
  if (!dateStringOrDate) return '';
  const date = new Date(dateStringOrDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return lang === 'so' ? 'Hadda' : 'Just now';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return lang === 'so' ? `${diffInMinutes} daqiiqo ka hor` : `${diffInMinutes}m ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return lang === 'so' ? `${diffInHours} saac ka hor` : `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return lang === 'so' ? `${diffInDays} maalmood ka hor` : `${diffInDays}d ago`;
  }
  return formatDate(date, lang);
}

