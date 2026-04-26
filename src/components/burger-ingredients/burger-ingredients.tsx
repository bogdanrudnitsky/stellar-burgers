import { useState, useRef, FC, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );

  const buns = ingredients.filter((item: TIngredient) => item.type === 'bun');
  const mains = ingredients.filter((item: TIngredient) => item.type === 'main');
  const sauces = ingredients.filter(
    (item: TIngredient) => item.type === 'sauce'
  );

  const [activeTab, setActiveTab] = useState<TTabMode>('bun');

  const bunSectionRef = useRef<HTMLHeadingElement>(null);
  const sauceSectionRef = useRef<HTMLHeadingElement>(null);
  const mainSectionRef = useRef<HTMLHeadingElement>(null);

  const [bunObserverRef, bunInView] = useInView({ threshold: 0.1 });
  const [sauceObserverRef, sauceInView] = useInView({ threshold: 0.1 });
  const [mainObserverRef, mainInView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (bunInView) {
      setActiveTab('bun');
    } else if (sauceInView) {
      setActiveTab('sauce');
    } else if (mainInView) {
      setActiveTab('main');
    }
  }, [bunInView, sauceInView, mainInView]);

  const handleTabClick = (tab: string) => {
    const tabMode = tab as TTabMode;
    setActiveTab(tabMode);
    const sectionRefs = {
      bun: bunSectionRef,
      sauce: sauceSectionRef,
      main: mainSectionRef
    };
    sectionRefs[tabMode].current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={activeTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={bunSectionRef}
      titleSaucesRef={sauceSectionRef}
      titleMainRef={mainSectionRef}
      bunsRef={bunObserverRef}
      saucesRef={sauceObserverRef}
      mainsRef={mainObserverRef}
      onTabClick={handleTabClick}
    />
  );
};
