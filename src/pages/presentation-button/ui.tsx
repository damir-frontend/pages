import presentation from '@assets/presentation.svg';
import styles from './styles.module.scss';

export const PresentationButton = () => {
  const isEnabled = false;

  return (
    <div className={styles.presentation}>
      <div
        className={`${styles.wrapper} ${isEnabled ? '' : styles.disable}`}
        onClick={() => {
          // setShow(false);
          // setVisibleButtons(false);
        }}
        title='Включить режим Доклада'
      >
        <img src={presentation} alt='включить режим доклада' />
      </div>
    </div>
  );
};
