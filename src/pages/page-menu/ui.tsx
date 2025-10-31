import documentIcon from '@assets/documents.svg';
import { pageStore } from '../model';
import styles from './styles.module.scss';

const setVisibleButtons = pageStore.getState().setVisibleButtons;

export const PageMenu = () => {
  const visibleButtons = pageStore((state) => state.visibleButtons);

  return (
    <div className={styles.switcher}>
      <div
        className={`${visibleButtons ? styles.selectedWrapper : styles.wrapper}`}
        onClick={() => setVisibleButtons(!visibleButtons)}
        title={`${
          visibleButtons ? 'Вернуться в стандартный режим' : 'Настройка режима доклада'
        }`}
      >
        <img
          src={`${visibleButtons ? documentIcon : documentIcon}`}
          alt='Меню работы со страницами'
        />
      </div>
    </div>
  );
};
