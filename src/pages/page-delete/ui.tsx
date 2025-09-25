import minusIcon from '@assets/arrows/zoom-minus.svg';
import { pageStore } from '../model';
import styles from './styles.module.scss';

export const PageDelete = () => {
  const pages = pageStore((state) => state.pages);
  const deletePage = pageStore.getState().deletePage;

  return (
    <div className={styles.switcher}>
      <div
        className={`${styles.wrapper} ${pages.length > 1 ? '' : styles.disable}`}
        onClick={deletePage}
        title='Удалить последнюю страницу'
      >
        <img src={minusIcon} alt='минус: удалить страницу' />
      </div>
    </div>
  );
};
