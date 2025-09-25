export const PRESSURE_RATE = 101325 / 760; // 133.321995
export const RHUMB_RATE = 11.25; // 1 румб = 11.25º
export const PROVIDER = {
  METEOINFO: 'meteoinfo',
  GFS: 'gfs',
} as const;
export type TMeteodataSource = (typeof PROVIDER)[keyof typeof PROVIDER];

export const PALETTE_SCHEMAS = ['general', 'alternative', 'custom'] as const;
export type TPaletteSchema = (typeof PALETTE_SCHEMAS)[number];

export const MAP_SETTINGS = 'mapSettings';
export const SETTINGS_FILE = 'settings-storage.json';

export const HOURS_NEW_SNOW = [3, 12, 24, 36, 48, 60, 72, 120] as const;
export const HOURS_NEW_RAIN = [6, 12, 24, 36, 48, 60, 72, 120] as const;

export type TSnowHour = (typeof HOURS_NEW_SNOW)[number];
export type TRainHour = (typeof HOURS_NEW_RAIN)[number];

export const keyNewSnow = 27;
export const keyNewRain = 28;
