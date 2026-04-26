import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { BurgerIngredients, BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import styles from './constructor-page.module.css';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.ingredients.isLoading);
  const isInit = useSelector((state: any) => state.ingredients.isInit);
  const ingredients = useSelector(
    (state: any) => state.ingredients.ingredients
  );

  console.log('🏗️ ConstructorPage рендер');
  console.log('📊 isLoading:', isLoading);
  console.log('📊 isInit:', isInit);
  console.log('📊 ingredients.length:', ingredients?.length);

  useEffect(() => {
    console.log('🟢 useEffect сработал, isInit=', isInit);
    if (!isInit) {
      console.log('🚀 Вызываем fetchIngredients');
      dispatch(fetchIngredients());
    }
  }, [dispatch, isInit]);

  if (isLoading) {
    console.log('⏳ Показываем Preloader');
    return <Preloader />;
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
