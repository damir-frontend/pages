import { saveLocalStorage } from '@app/utils/storage-save';
import { MAP_SETTINGS } from '@app/utils/consts';
import { create, TStore } from '@app/utils/zustand';
import { MAX_PAGES } from './consts';
import { getInitialPages } from './utils';

type TState = {
  pages: any[];
  addPage: () => void;
  deletePage: () => void;
  currentPage: number;
  setDefaultCurrentPage: (currentPage: number) => void;
  setCurrentPage: (currentPage: number) => void;
  visibleButtons: boolean;
  setVisibleButtons: (visibleButtons: boolean) => void;
};

export const pageStore: TStore<TState> = create<TState>((set, get) => ({
  pages: getInitialPages(),
  addPage: () => {
    const pages = get().pages;
    if (pages.length < MAX_PAGES) {
      const idNewPage = pages.length;
      const mapSettingsName = MAP_SETTINGS + idNewPage.toString();
      const newPage = localStorage.getItem(MAP_SETTINGS) || '{}';
      localStorage.setItem(mapSettingsName, newPage);
      pages.push(newPage);
      set({ pages: [...pages] });
    }
  },
  deletePage: () => {
    const pages = get().pages;
    // единственную страницу 0 - удалять нельзя
    if (pages.length > 1) {
      const lastPage = pages.length - 1;
      pages.pop();
      let currentPage = get().currentPage;
      if (currentPage >= pages.length) {
        currentPage--;
        saveLocalStorage({ currentPage });
        localStorage.removeItem(MAP_SETTINGS + lastPage.toString());
        set({ pages: [...pages], currentPage });
        get().setCurrentPage(currentPage);
      }
      localStorage.removeItem(MAP_SETTINGS + lastPage.toString());
      set({ pages: [...pages], currentPage });
    }
  },
  currentPage: -10,
  setDefaultCurrentPage: (currentPage) => {
    set({ currentPage });
  },
  setCurrentPage: (currentPage) => {
    if (currentPage < 0 || currentPage >= MAX_PAGES) return;
    const settings = localStorage.getItem(MAP_SETTINGS + currentPage.toString());
    // Записываем данные в localStorage
    if (settings) {
  		localStorage.setItem(MAP_SETTINGS, settings);
	}
	 saveLocalStorage({ currentPage });
    set({ currentPage });
  },
  visibleButtons: false,
  setVisibleButtons: (visibleButtons) => set({ visibleButtons }),
}));
