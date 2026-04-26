import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { orderBurgerThunk } from '../../services/slices/order-slice';
import { closeOrder } from '../../services/slices/order-slice';
import { RootState } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.user);
  const constructorItems = useSelector(
    (state: RootState) => state.ingredients.constructorItems
  );
  const orderRequest = useSelector(
    (state: RootState) => state.orders.orderRequest
  );
  const orderModalData = useSelector(
    (state: RootState) => state.orders.orderModalData
  );

  const totalPrice = useMemo(() => {
    const bunPrice = constructorItems.bun?.price || 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice * 2 + ingredientsPrice;
  }, [constructorItems]);

  const handleOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (item: TConstructorIngredient) => item._id
      ),
      constructorItems.bun._id
    ];

    dispatch(orderBurgerThunk(ingredientIds));
  };

  // Очищаем только закрытие модалки, конструктор очищается после успешного заказа через shouldResetConstructor
  const handleCloseModal = () => {
    dispatch(closeOrder());
    navigate(-1);
  };

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};
