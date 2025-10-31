import {
  isValidBoolean,
  isValidEventsMap,
  isValidNumber,
  isValidNumberArray,
  isValidObject,
  isValidProvider,
  isValidRainHour,
  isValidScaleDay,
  isValidSnowHour,
  isValidString,
  isValidStringArraySize2,
  isValidViewState,
} from '@app/shared/utils/validation';
import { MAP_SETTINGS, PROVIDER, TMeteodataSource } from '@app/utils/consts';
import dayjs, { Dayjs } from 'dayjs';
import { getValidatedStorageItem } from '@app/utils/storage-get';

const INITIAL = {
  MAP: { LONGITUDE: 0, LATITUDE: 0, ZOOM: 1 },
  SOURCE: 'meteoinfo',
  CATEGORY_NAME: 'default',
  PALETTE_SCHEMA_ALL: {},
  PALETTE_SCHEMA: 'default',
  PALETTE: {},
  DANGERS_VISIBLE: false,
  WEATHER_GRID_VISIBLE: false,
  ISOLINE_VISIBLE: false,
  DANGERS_HYDROLOGY_VISIBLE: false,
  OPERATION_POINT_VISIBLE: false,
  STATION_VISIBLE: false,
  RAILROAD_VISIBLE: false,
  RAILROAD_POLYGON_VISIBLE: false,
  ROAD_BORDER_VISIBLE: false,
  TOOLTIP_VISIBLE: false,
  GEOCRYOLOGY_LAYERS_VISIBLE: [],
  SNOW_VALUE: 0,
  RAIN_VALUE: 0,
  MODE: 0,
  PARTICLES_VISIBLE: false,
  METEOPOST_VISIBLE: false,
  SEISMOLOGY_LAYER_VISIBLE: 0,
  MAP_LAYER: [],
  HYDROPOST_RZD_VISIBLE: false,
  HYDROPOST_ARCHIVE_VISIBLE: false,
  EVENTS_MAP: [],
  GRID_KEY: 0,
  DELAY: 0,
  SELECTED_HOUR: 0,
  DANGER_TABLE_SPLITTER_SIZE: ['50%', '50%'],
  GRAPH_SPLITTER_SIZE: ['50%', '50%'],
  SHOW_MEASURED_LEVEL: false,
  SHOW_CALCULATED_LEVEL: false,
  SHOW_PRECIPITATION_LEVEL: false,
  SHOW_VOLUME_LEVEL: false,
	SHOW_WASTE_LEVEL: false,
	ROAD_POLYGON_LAYER: [],
  REGION_POLYGON_LAYER:[],
};

export const VECTOR = {
  NULL: 0,
  TEMPERATURE: 1,
  PRECIPITATION: 2,
  HUMIDITY: 3,
  PRESSURE: 4,
  WIND: 5,
} as const;

export type VECTOR = (typeof VECTOR)[keyof typeof VECTOR];

type Store = ((...args: any[]) => any) & {
  getState: Record<string, (v: any) => void>;
};

const createMockStore = (initial: Record<string, any> = {}): Store => {
  const fn = ((..._args: any[]) => {}) as Store;
  fn.getState = new Proxy(initial, {
    get: (target, key: string) => (v: any) => {
      console.log(`Called setter ${key} with`, v);
      target[key] = v;
    },
  });
  return fn;
};




const mapStore = createMockStore(INITIAL.MAP);
const layerStore = createMockStore({});
const railroadDangersStore = createMockStore({});
const weatherGridStore = createMockStore({});
const isolineLayerStore = createMockStore({});
const dangersHydrologyFilterMenuStore = createMockStore({});
const mapProviderSwitcherStore = createMockStore({});
const geocryologyLayerStore = createMockStore({});
const accumulationStore = createMockStore({});
const mapModeStore = createMockStore({});
const particlesLayerStore = createMockStore({});
const meteopostLayerStore = createMockStore({});
const seismologyLayerStore = createMockStore({});
const hydropostStore = createMockStore({});
const dangersStore = createMockStore({});
const isolineStore = createMockStore({});
const splitterStore = createMockStore({});
const workPointGraphStore = createMockStore({});
const datetimeStore = createMockStore({});
const preferencesStore = createMockStore({});
const roadPolygonStore=createMockStore({});

export const getInitialPages = () => {
  const pages = Array.from({ length: 10 }, (_, index) =>
    localStorage.getItem(MAP_SETTINGS + index.toString()),
  ).filter(Boolean); // Убираем `null` и `undefined`

  return pages.length > 0 ? pages : [0]; // Если пусто, добавляем `0`
};

export const roundTimeDownToNearestHour = (date: Dayjs, allowedHours: number[]) => {
  const currentHour = date.hour();
  const prevHour = [...allowedHours].reverse().find((h) => h <= currentHour);

  if (prevHour !== undefined) {
    return date.set('hour', prevHour).set('minute', 0).set('second', 0).set('millisecond', 0);
  } else {
    // Следующий день, первый час из массива
    return date
      .add(-1, 'day')
      .set('hour', allowedHours[allowedHours.length - 1])
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0);
  }
};
export const METEOINFO_HOURS = [3, 9, 15, 21];
export const GFS_HOURS = [0, 3, 6, 9, 12, 15, 18, 21];

export function getRoundedInitialDatetime(source: TMeteodataSource) {
  const hours = source === PROVIDER.METEOINFO ? METEOINFO_HOURS : GFS_HOURS;
  return roundTimeDownToNearestHour(dayjs(), hours);
}

// export const getInitialCurrentPage = () => {
//   localStorage.setItem(MAP_SETTINGS, settings);
// };

// paletteSchemaAll

const isValidCategory = (value: unknown): value is string => isValidString(value); // сократил - без category

type Validator<T> = (value: unknown) => value is T;

type StoreConfig<T, K extends keyof T & string, V> = {
  store: () => T;
  setter: K;
  validator: Validator<V>;
  initial: V;
};

type MapSettingsConfig = Record<
  string,
  | StoreConfig<
      ReturnType<typeof mapStore>,
      'setLongitude' | 'setLatitude' | 'setZoom',
      number
    >
  | StoreConfig<ReturnType<typeof mapStore>, 'setViewState', object>
  | StoreConfig<
      ReturnType<typeof layerStore>,
      'setSelectedSource' | 'handleSelectCategory',
      any
    >
  | StoreConfig<ReturnType<typeof layerStore>, 'setPalette', object>
  | StoreConfig<ReturnType<typeof layerStore>, 'setPaletteSchema', string>
  | StoreConfig<ReturnType<typeof layerStore>, 'setPaletteSchemaAll', object>
  | StoreConfig<ReturnType<typeof railroadDangersStore>, 'setDangersVisible', boolean>
  | StoreConfig<ReturnType<typeof weatherGridStore>, 'setVisible', boolean>
  | StoreConfig<ReturnType<typeof isolineLayerStore>, 'setVisible', boolean>
  | StoreConfig<
      ReturnType<typeof dangersHydrologyFilterMenuStore>,
      'setDangersVisible',
      boolean
    >
  | StoreConfig<
      ReturnType<typeof mapProviderSwitcherStore>,
      | 'setOperatingPointSwitcherVisible'
      | 'setStationsSwitcherVisible'
      | 'setRailroadSwitcherVisible'
      | 'setRailroadPolygonSwitcherVisible'
      | 'setRoadBorderSwitcherVisible'
      | 'setRayerTooltipSwitcherVisible'
      | 'setSelectedMapLayerId',
      boolean | any
    >
  | StoreConfig<ReturnType<typeof geocryologyLayerStore>, 'setSelectedLayers', any>
  | StoreConfig<
      ReturnType<typeof accumulationStore>,
      'setSnowInterval' | 'setRainInterval',
      any
    >
  | StoreConfig<ReturnType<typeof mapModeStore>, 'setSelectedMode', any>
  | StoreConfig<ReturnType<typeof particlesLayerStore>, 'setVisible', boolean>
  | StoreConfig<ReturnType<typeof meteopostLayerStore>, 'setVisible', boolean>
  | StoreConfig<ReturnType<typeof seismologyLayerStore>, 'setSelectedLayers', number>
  | StoreConfig<
      ReturnType<typeof hydropostStore>,
      'setVisibleRzd' | 'setVisibleArchive',
      boolean
    >
  | StoreConfig<ReturnType<typeof dangersStore>, 'setEventsMap', object>
  | StoreConfig<ReturnType<typeof isolineStore>, 'setCurrentIsoline', number>
  | StoreConfig<ReturnType<typeof weatherGridStore>, 'setGridKey', number>
  | StoreConfig<ReturnType<typeof datetimeStore>, 'setSelectedDatetime', Dayjs>
  | StoreConfig<ReturnType<typeof preferencesStore>, 'setMaxDate', Dayjs>
  | StoreConfig<ReturnType<typeof preferencesStore>, 'setDelay', number>
  | StoreConfig<ReturnType<typeof preferencesStore>, 'setSelectedHour', number>
  | StoreConfig<ReturnType<typeof preferencesStore>, 'setSelectedRoads', number[]>
  | StoreConfig<ReturnType<typeof preferencesStore>, 'setSelectedRegions', number[]>
  | StoreConfig<ReturnType<typeof preferencesStore>, 'setDangerSplitterSize', string[]>
  | StoreConfig<ReturnType<typeof preferencesStore>, 'setGraphSplitterSize', string[]>
  | StoreConfig<ReturnType<typeof preferencesStore>, 'setCalculatedLevelSource', string>
  | StoreConfig<ReturnType<typeof preferencesStore>, 'setShowMeasuredLevel', boolean>
  | StoreConfig<ReturnType<typeof preferencesStore>, 'setShowCalculatedLevel', boolean>
  | StoreConfig<ReturnType<typeof preferencesStore>, 'setShowPrecipitationsLevel', boolean>
  | StoreConfig<ReturnType<typeof preferencesStore>, 'setShowWasteLevel', boolean>
  | StoreConfig<ReturnType<typeof preferencesStore>, 'setShowVolumeLevel', boolean>
>;

const lazyInit = <T>(fn: () => T): (() => T) => {
  let instance: T | null = null;
  return () => (instance ??= fn());
};

const mapSettingsConfig: MapSettingsConfig = {
  longitude: {
    store: lazyInit(() => mapStore),
    setter: 'setLongitude',
    validator: isValidNumber as Validator<number>,
    initial: INITIAL.MAP.LONGITUDE,
  },
  latitude: {
    store: lazyInit(() => mapStore),
    setter: 'setLatitude',
    validator: isValidNumber as Validator<number>,
    initial: INITIAL.MAP.LATITUDE,
  },
  zoom: {
    store: lazyInit(() => mapStore),
    setter: 'setZoom',
    validator: isValidNumber as Validator<number>,
    initial: INITIAL.MAP.ZOOM,
  },
  viewState: {
    store: lazyInit(() => mapStore),
    setter: 'setViewState',
    validator: isValidViewState as Validator<object>,
    initial: {
      zoom: INITIAL.MAP.ZOOM,
      latitude: INITIAL.MAP.LATITUDE,
      longitude: INITIAL.MAP.LONGITUDE,
    },
  },
  selectedSource: {
    store: lazyInit(() => layerStore),
    setter: 'setSelectedSource',
    validator: isValidProvider,
    initial: INITIAL.SOURCE,
  },
  selectedCategoryName: {
    store: lazyInit(() => layerStore),
    setter: 'handleSelectCategory',
    validator: isValidCategory, // сократил - без category
    initial: INITIAL.CATEGORY_NAME,
  },
  paletteSchemaAll: {
    store: lazyInit(() => layerStore),
    setter: 'setPaletteSchemaAll',
    validator: isValidObject,
    initial: INITIAL.PALETTE_SCHEMA_ALL,
  },
  paletteSchema: {
    store: lazyInit(() => layerStore),
    setter: 'setPaletteSchema',
    validator: isValidString,
    initial: INITIAL.PALETTE_SCHEMA,
  },
  palette: {
    store: lazyInit(() => layerStore),
    setter: 'setPalette',
    validator: isValidObject,
    initial: INITIAL.PALETTE,
  },
  dangersVisible: {
    store: lazyInit(() => railroadDangersStore),
    setter: 'setDangersVisible',
    validator: isValidBoolean as Validator<boolean>,
    initial: INITIAL.DANGERS_VISIBLE,
  },
  weatherGridVisible: {
    store: lazyInit(() => weatherGridStore),
    setter: 'setVisible',
    validator: isValidBoolean as Validator<boolean>,
    initial: INITIAL.WEATHER_GRID_VISIBLE,
  },
  isolineVisible: {
    store: lazyInit(() => isolineLayerStore),
    setter: 'setVisible',
    validator: isValidBoolean as Validator<boolean>,
    initial: INITIAL.ISOLINE_VISIBLE,
  },
  dangersHydrologyVisible: {
    store: lazyInit(() => dangersHydrologyFilterMenuStore),
    setter: 'setDangersVisible',
    validator: isValidBoolean as Validator<boolean>,
    initial: INITIAL.DANGERS_HYDROLOGY_VISIBLE,
  },
  operatingPointSwitcherVisible: {
    store: lazyInit(() => mapProviderSwitcherStore),
    setter: 'setOperatingPointSwitcherVisible',
    validator: isValidBoolean as Validator<boolean>,
    initial: INITIAL.OPERATION_POINT_VISIBLE,
  },
  stationsSwitcherVisible: {
    store: lazyInit(() => mapProviderSwitcherStore),
    setter: 'setStationsSwitcherVisible',
    validator: isValidBoolean as Validator<boolean>,
    initial: INITIAL.STATION_VISIBLE,
  },
  railroadSwitcherVisible: {
    store: lazyInit(() => mapProviderSwitcherStore),
    setter: 'setRailroadSwitcherVisible',
    validator: isValidBoolean as Validator<boolean>,
    initial: INITIAL.RAILROAD_VISIBLE,
  },
  railroadPolygonSwitcherVisible: {
    store: lazyInit(() => mapProviderSwitcherStore),
    setter: 'setRailroadPolygonSwitcherVisible',
    validator: isValidBoolean as Validator<boolean>,
    initial: INITIAL.RAILROAD_POLYGON_VISIBLE,
  },
  roadBorderSwitcherVisible: {
    store: lazyInit(() => mapProviderSwitcherStore),
    setter: 'setRoadBorderSwitcherVisible',
    validator: isValidBoolean as Validator<boolean>,
    initial: INITIAL.ROAD_BORDER_VISIBLE,
  },
  layerTooltipSwitcherVisible: {
    store: lazyInit(() => mapProviderSwitcherStore),
    setter: 'setRayerTooltipSwitcherVisible',
    validator: isValidBoolean as Validator<boolean>,
    initial: INITIAL.TOOLTIP_VISIBLE,
  },
  geocryologySelectedLayers: {
    store: lazyInit(() => geocryologyLayerStore),
    setter: 'setSelectedLayers',
    validator: isValidNumberArray,
    initial: INITIAL.GEOCRYOLOGY_LAYERS_VISIBLE,
  },
  snowInterval: {
    store: lazyInit(() => accumulationStore),
    setter: 'setSnowInterval',
    validator: isValidSnowHour,
    initial: INITIAL.SNOW_VALUE,
  },
  rainInterval: {
    store: lazyInit(() => accumulationStore),
    setter: 'setRainInterval',
    validator: isValidRainHour,
    initial: INITIAL.RAIN_VALUE,
  },
  selectedModeId: {
    store: lazyInit(() => mapModeStore),
    setter: 'setSelectedMode',
    validator: isValidNumber as Validator<number>,
    initial: INITIAL.MODE,
  },
  particlesVisible: {
    store: lazyInit(() => particlesLayerStore),
    setter: 'setVisible',
    validator: isValidBoolean as Validator<boolean>,
    initial: INITIAL.PARTICLES_VISIBLE,
  },
  meteopostVisible: {
    store: lazyInit(() => meteopostLayerStore),
    setter: 'setVisible',
    validator: isValidBoolean as Validator<boolean>,
    initial: INITIAL.METEOPOST_VISIBLE,
  },
  seismologySelectedLayerId: {
    store: lazyInit(() => seismologyLayerStore),
    setter: 'setSelectedLayers',
    validator: isValidNumber as Validator<number>,
    initial: INITIAL.SEISMOLOGY_LAYER_VISIBLE,
  },
  selectedMapLayerId: {
    store: lazyInit(() => mapProviderSwitcherStore),
    setter: 'setSelectedMapLayerId',
    validator: isValidNumberArray,
    initial: INITIAL.MAP_LAYER,
  },
  rzd: {
    store: lazyInit(() => hydropostStore),
    setter: 'setVisibleRzd',
    validator: isValidBoolean,
    initial: INITIAL.HYDROPOST_RZD_VISIBLE,
  },
  archive: {
    store: lazyInit(() => hydropostStore),
    setter: 'setVisibleArchive',
    validator: isValidBoolean,
    initial: INITIAL.HYDROPOST_ARCHIVE_VISIBLE,
  },
  eventsMap: {
    store: lazyInit(() => dangersStore),
    setter: 'setEventsMap',
    validator: isValidEventsMap,
    initial: new Map(INITIAL.EVENTS_MAP),
  },
  currentIsoline: {
    store: lazyInit(() => isolineStore),
    setter: 'setCurrentIsoline',
    validator: isValidNumber,
    initial: VECTOR.PRESSURE,
  },
  gridKey: {
    store: lazyInit(() => weatherGridStore),
    setter: 'setGridKey',
    validator: isValidNumber,
    initial: INITIAL.GRID_KEY,
  },
  selectedDatetime: {
    store: lazyInit(() => datetimeStore),
    setter: 'setSelectedDatetime',
    validator: isValidScaleDay,
    initial: getRoundedInitialDatetime(PROVIDER.METEOINFO),
  },
  maxDate: {
    store: lazyInit(() => preferencesStore),
    setter: 'setMaxDate',
    validator: isValidScaleDay,
    initial: getRoundedInitialDatetime(PROVIDER.METEOINFO),
  },
  delay: {
    store: lazyInit(() => preferencesStore),
    setter: 'setDelay',
    validator: isValidNumber,
    initial: INITIAL.DELAY,
  },
  selectedHour: {
    store: lazyInit(() => preferencesStore),
    setter: 'setSelectedHour',
    validator: isValidNumber,
    initial: INITIAL.SELECTED_HOUR,
  },
  selectedRoads: {
    store: lazyInit(() => roadPolygonStore),
    setter: 'setSelectedRoads',
    validator: isValidNumberArray,
    initial: INITIAL.ROAD_POLYGON_LAYER,
  },
  selectedRegions: {
    store: lazyInit(() => roadPolygonStore),
    setter: 'setSelectedRegions',
    validator: isValidNumberArray,
    initial: INITIAL.REGION_POLYGON_LAYER,
  },
  dangerSplitterSize: {
    store: lazyInit(() => splitterStore),
    setter: 'setDangerSplitterSize',
    validator: isValidStringArraySize2,
    initial: INITIAL.DANGER_TABLE_SPLITTER_SIZE,
  },
  graphSplitterSize: {
    store: lazyInit(() => splitterStore),
    setter: 'setGraphSplitterSize',
    validator: isValidStringArraySize2,
    initial: INITIAL.GRAPH_SPLITTER_SIZE,
  },
  calculatedLevelSource: {
    store: lazyInit(() => workPointGraphStore),
    setter: 'setCalculatedLevelSource',
    validator: isValidProvider,
    initial: PROVIDER.METEOINFO,
  },
  showMeasuredLevel: {
    store: lazyInit(() => workPointGraphStore),
    setter: 'setShowMeasuredLevel',
    validator: isValidBoolean,
    initial: INITIAL.SHOW_MEASURED_LEVEL,
  },
  showCalculatedLevel: {
    store: lazyInit(() => workPointGraphStore),
    setter: 'setShowCalculatedLevel',
    validator: isValidBoolean,
    initial: INITIAL.SHOW_CALCULATED_LEVEL,
  },
  showPrecipitationsLevel: {
    store: lazyInit(() => workPointGraphStore),
    setter: 'setShowPrecipitationsLevel',
    validator: isValidBoolean,
    initial: INITIAL.SHOW_PRECIPITATION_LEVEL,
  },
  showVolumeLevel: {
    store: lazyInit(() => workPointGraphStore),
    setter: 'setShowVolumeLevel',
    validator: isValidBoolean,
    initial: INITIAL.SHOW_VOLUME_LEVEL,
  },
  showWasteLevel: {
    store: lazyInit(() => workPointGraphStore),
    setter: 'setShowWasteLevel',
    validator: isValidBoolean,
    initial: INITIAL.SHOW_WASTE_LEVEL,
  },
};

export const loadSettingsFromLocalStorage = () => {
  Object.entries(mapSettingsConfig).forEach(([key, { store, setter, validator, initial }]) => {
    const value = getValidatedStorageItem(key, validator, initial);
    (typeof store === 'function' ? store() : store).getState()[setter](value);
  });
};
