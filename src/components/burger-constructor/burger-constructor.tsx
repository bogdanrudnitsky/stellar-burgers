import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { orderBurgerThunk } from '../../services/slices/order-slice';
import { clearIngredients } from '../../services/slices/ingredients-slice';
import { closeOrder } from '../../services/slices/order-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const constructorItems = useSelector(
    (state) => state.ingredients.constructorItems
  );
  const orderRequest = useSelector((state) => state.orders.orderRequest);
  const orderModalData = useSelector((state) => state.orders.orderModalData);

  const totalPrice = useMemo(() => {
    const bunPrice = constructorItems.bun?.price || 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum, item) => sum + item.price,
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
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(orderBurgerThunk(ingredientIds));
  };

  const handleCloseModal = () => {
    dispatch(clearIngredients());
    dispatch(closeOrder());
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
