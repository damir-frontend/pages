import { MAP_SETTINGS } from './consts';
import { saveLocalStorage } from './storage-save';
import { restoreFromStorage } from './storage-serializer';

/**
 * Универсальная функция проверки значений
 * @param key - ключ localStorage
 * @param validator - функция проверки типа/диапазона значений
 * @param defaultValue - значение по умолчанию, если `value` не прошло проверку
 */

export const getValidatedStorageItem = <T>(
  key: string,
  isValid: (value: unknown) => value is T,
  defaultValue: T,
): T => {
  const returnDefault = (): T => {
    saveLocalStorage({ [key]: defaultValue });
    return defaultValue;
  };

  try {
    const storedSettingsRaw = localStorage.getItem(MAP_SETTINGS);
    if (!storedSettingsRaw) return returnDefault();

    const storedSettings = restoreFromStorage(JSON.parse(storedSettingsRaw));

    if (
      !storedSettings ||
      typeof storedSettings !== 'object' ||
      Array.isArray(storedSettings)
    ) {
      return returnDefault();
    }

    const storedValue = storedSettings[key];
    return isValid(storedValue) ? storedValue : returnDefault();
  } catch {
    return returnDefault();
  }
};
