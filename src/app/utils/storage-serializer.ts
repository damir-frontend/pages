import { isValidObject } from '@app/shared/utils/validation';
import dayjs from 'dayjs';

// Функция для рекурсивного преобразования Map и Set перед сохранением
export const convertForStorage = (value: any): any => {
  if (dayjs.isDayjs(value)) {
    return { __type: 'Dayjs', data: value.toISOString() };
  }
  if (value instanceof Map) {
    return { __type: 'Map', data: Array.from(value.entries()) };
  }
  if (value instanceof Set) {
    return { __type: 'Set', data: Array.from(value) };
  }
  if (Array.isArray(value)) {
    return value.map(convertForStorage);
  }
  if (isValidObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, convertForStorage(v)]),
    );
  }
  return value;
};

// Функция для восстановления Map и Set
export const restoreFromStorage = (value: any): any => {
  if (typeof value === 'object' && value !== null) {
    if (value.__type === 'Dayjs') {
      return dayjs(value.data);
    }
    if (value.__type === 'Map') {
      return new Map(value.data);
    }
    if (value.__type === 'Set') {
      return new Set(value.data);
    }
    if (Array.isArray(value)) {
      return value.map(restoreFromStorage);
    }
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, restoreFromStorage(v)]),
    );
  }
  return value;
};
