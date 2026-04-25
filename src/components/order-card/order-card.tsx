import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';

const MAX_VISIBLE_INGREDIENTS = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const displayData = useMemo(() => {
    if (!ingredients.length) return null;

    const orderIngredients = order.ingredients
      .map((id: string) => ingredients.find((item) => item._id === id))
      .filter((item): item is (typeof ingredients)[0] => Boolean(item));

    const ingredientImages = orderIngredients.map((item) => item.image_mobile);
    const totalAmount = orderIngredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    const ingredientsToShow = orderIngredients.slice(
      0,
      MAX_VISIBLE_INGREDIENTS
    );
    const remains = Math.max(
      0,
      orderIngredients.length - MAX_VISIBLE_INGREDIENTS
    );

    return {
      number: order.number,
      name: order.name,
      status: order.status,
      date: new Date(order.createdAt),
      ingredientsToShow,
      remains,
      total: totalAmount,
      ingredientsInfo: orderIngredients
    };
  }, [order, ingredients]);

  if (!displayData) {
    return null;
  }

  const orderInfo = {
    _id: order._id,
    number: displayData.number,
    name: displayData.name,
    status: displayData.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    ingredients: order.ingredients,
    ingredientsInfo: displayData.ingredientsInfo,
    ingredientsToShow: displayData.ingredientsToShow,
    remains: displayData.remains,
    total: displayData.total,
    date: displayData.date
  };

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={MAX_VISIBLE_INGREDIENTS}
      locationState={{ background: location }}
    />
  );
});
