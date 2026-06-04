import { Task } from '../types';

export const generateId = (tasksList: Task[] = []): string => {
  const tanIds = tasksList
    .map(t => t.id)
    .filter(id => /^TAN44\d+$/.test(id))
    .map(id => parseInt(id.replace('TAN44', ''), 10));
  if (tanIds.length === 0) return 'TAN44001';
  const maxId = Math.max(...tanIds);
  const nextId = maxId + 1;
  const paddedNum = String(nextId).padStart(3, '0');
  return `TAN44${paddedNum}`;
};

export const generateUid = (): string => Math.random().toString(36).substring(2, 9);

export const getNow = (): string => new Date().toISOString();

export const getNextDayISO = (): string => new Date(Date.now() + 86400000).toISOString();

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatWhatsAppNumber = (phone: string | null | undefined): string => {
  if (!phone) return '';
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
};
