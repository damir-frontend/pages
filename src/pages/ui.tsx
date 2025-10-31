import { pageStore } from './model';
import { PageAdd } from './page-add/ui';
import { PageDelete } from './page-delete/ui';
import { PageMenu } from './page-menu/ui';
import { PresentationButton } from './presentation-button/ui';
import styles from './styles.module.scss';

const setCurrentPage = pageStore.getState().setCurrentPage;

const usePageKeyboardListener = () => { };

export const Pages = () => {
  const pages = pageStore((state) => state.pages);
  const currentPage = pageStore((state) => state.currentPage);
  const visibleButtons = pageStore((state) => state.visibleButtons);
  usePageKeyboardListener();

  return (
    <>
       <PageMenu />
      {visibleButtons && (
        <>
          {pages.map((_page, index) => (
            <div style={{ left: 10 + 45 * index }} className={styles.pageButton} key={index}>
              <a
                className={`${styles.button} ${
                  index === currentPage ? styles.activeButton : ''
                }`}
                onClick={() => {
                  setCurrentPage(index);
                }}
                title={`Страница ${index + 1}`}
              >
                {index + 1}
              </a>
            </div>
          ))}
          <PresentationButton />
          <PageDelete />
          <PageAdd />
          {/* <LoadFile /> */}
          {/* <SaveFile /> */}
        </>
      )}
    </>
  );
};
