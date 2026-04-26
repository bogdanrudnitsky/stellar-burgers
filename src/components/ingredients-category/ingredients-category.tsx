import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const constructorItems = useSelector(
    (state: RootState) => state.ingredients.constructorItems
  );

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    if (constructorItems.bun) {
      counters[constructorItems.bun._id] = 2;
    }

    constructorItems.ingredients.forEach((item: TConstructorIngredient) => {
      counters[item._id] = (counters[item._id] || 0) + 1;
    });

    return counters;
  }, [constructorItems]);

  return (
    <IngredientsCategoryUI
      ref={ref}
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
    />
  );
});
