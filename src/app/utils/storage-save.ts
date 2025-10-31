import { pageStore } from '../../pages/model';
import { MAP_SETTINGS } from './consts';
import { convertForStorage } from './storage-serializer';

export const saveLocalStorage = (item: object) =>
  localStorage.setItem(
    MAP_SETTINGS,
    JSON.stringify(
      Object.assign(
        JSON.parse(localStorage.getItem(MAP_SETTINGS) || '{}'),
        convertForStorage(item),
      ),
    ),
  );

export const saveLocalStorageName = (item: object) => {
  const currentPage = pageStore.getState().currentPage;
  const mapSettingsName = MAP_SETTINGS.concat(currentPage.toString());
  saveLocalStorage(item);
  localStorage.setItem(
    mapSettingsName,
    JSON.stringify(
      Object.assign(
        JSON.parse(localStorage.getItem(mapSettingsName) || '{}'),
        convertForStorage(item),
      ),
    ),
  );
};
