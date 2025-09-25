import plusIcon from '@assets/arrows/zoom-plus.svg';
import { MAX_PAGES } from '../consts';
import { pageStore } from '../model';
import styles from './styles.module.scss';

export const PageAdd = () => {
  const pages = pageStore((state) => state.pages);
  const addPage = pageStore.getState().addPage;

  return (
    <div className={styles.switcher}>
      <div
        className={`${styles.wrapper} ${
          pages.length > 0 && pages.length < MAX_PAGES ? '' : styles.disable
        }`}
        onClick={addPage}
        title='Добавить страницу'
      >
        <img src={plusIcon} alt='плюс: добавить страницу' />
      </div>
    </div>
  );
};
