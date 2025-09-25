import {
  HOURS_NEW_RAIN,
  HOURS_NEW_SNOW,
  PALETTE_SCHEMAS,
  PROVIDER,
  TMeteodataSource,
  TPaletteSchema,
  TRainHour,
  TSnowHour,
} from '@app/utils/consts';
import dayjs, { Dayjs } from 'dayjs';
type MapViewState = any;
export type TPaletteItem = {
  color: number[];
  value: number;
}[];

export type TPalette = Partial<Record<TPaletteSchema, TPaletteItem>>;
export type TPaletteSchemaAll = Record<number, TPaletteSchema>;
const compareTwoDates = (_date1: Dayjs, _date2: Dayjs) => true;

//
// ──────────────────────────── PRIMITIVES ────────────────────────────
//

/** Проверка: объект (и не null) */
export const isValidObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

/** Проверка: boolean */
export const isValidBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

/** Проверка: число (и не NaN) */
export const isValidNumber = (value: unknown): value is number =>
  typeof value === 'number' && !isNaN(value);

/** Проверка: строка (не пустая) */
export const isValidString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '';

//
// ──────────────────────────── ARRAYS ────────────────────────────
//

/** Массив строк */
export const isValidStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

/** Массив строк из двух элементов */
export const isValidStringArraySize2 = (value: unknown): value is string[] =>
  isValidStringArray(value) && value.length === 2;

/** Массив чисел */
export const isValidNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'number' && !isNaN(item));

//
// ──────────────────────────── MAP / OBJECT STRUCTURES ────────────────────────────
//

/** Map<number, { key, value, name, enabled }> */
export const isValidEventsMap = (
  value: unknown,
): value is Map<number, { key: number; value: string; name: string; enabled: boolean }> => {
  if (!(value instanceof Map)) return false;

  for (const [key, obj] of value.entries()) {
    if (
      typeof key !== 'number' ||
      typeof obj !== 'object' ||
      obj === null ||
      typeof obj.key !== 'number' ||
      typeof obj.value !== 'string' ||
      typeof obj.name !== 'string' ||
      typeof obj.enabled !== 'boolean'
    ) {
      return false;
    }
  }

  return true;
};

//
// ──────────────────────────── DOMAIN-SPECIFIC ────────────────────────────
//

/** Провайдер метеоданных */
export const isValidProvider = (value: unknown): value is TMeteodataSource =>
  typeof value === 'string' && (Object.values(PROVIDER) as readonly string[]).includes(value);

/** Цветовая схема */
export const isValidPaletteSchema = (value: unknown): value is TPaletteSchema =>
  typeof value === 'string' && (PALETTE_SCHEMAS as readonly string[]).includes(value);

/** Объект с цветовыми схемами */
export const isValidPaletteSchemaAll = (value: unknown): value is TPaletteSchemaAll =>
  isValidObject(value) &&
  Object.values(value).every((item) => PALETTE_SCHEMAS.includes(item as TPaletteSchema));

/** Часы снегопада */
export const isValidSnowHour = (value: unknown): value is TSnowHour =>
  isValidNumber(value) && HOURS_NEW_SNOW.includes(value as TSnowHour);

/** Часы дождя */
export const isValidRainHour = (value: unknown): value is TRainHour =>
  isValidNumber(value) && HOURS_NEW_RAIN.includes(value as TRainHour);

//
// ──────────────────────────── DATE/TIME ────────────────────────────
//

/** Валидный dayjs объект */
export const isValidDayjs = (value: unknown): value is Dayjs =>
  dayjs.isDayjs(value) && value.isValid();

/** Dayjs и больше, чем вчера */
export const isValidScaleDay = (value: unknown): value is Dayjs =>
  dayjs.isDayjs(value) && value.isValid() && compareTwoDates(value, dayjs().add(-1, 'day'));

//
// ──────────────────────────── OTHER ────────────────────────────
//

/** DeckGL view state */
export const isValidViewState = (value: unknown): value is MapViewState =>
  isValidObject(value) && 'longitude' in value && 'latitude' in value && 'zoom' in value;
