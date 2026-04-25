import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useDispatch, useSelector } from '../../services/store';
import { getOrderByNumberThunk } from '../../services/slices/order-slice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const orderNumber = Number(params.number);

  const orderModalData = useSelector((state) => state.orders.orderModalData);
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const isLoading = useSelector((state) => state.orders.isLoading);

  useEffect(() => {
    if (orderNumber && !orderModalData) {
      dispatch(getOrderByNumberThunk(orderNumber));
    }
  }, [dispatch, orderNumber, orderModalData]);

  const preparedOrderInfo = useMemo(() => {
    if (!orderModalData || !ingredients.length) return null;

    const ingredientsInfo: { [key: string]: any & { count: number } } = {};

    if (orderModalData.ingredients && orderModalData.ingredients.length > 0) {
      orderModalData.ingredients.forEach((id: string) => {
        const ingredient = ingredients.find((item) => item._id === id);
        if (ingredient) {
          if (ingredientsInfo[id]) {
            ingredientsInfo[id].count += 1;
          } else {
            ingredientsInfo[id] = {
              ...ingredient,
              count: 1
            };
          }
        }
      });
    }

    let totalCost = 0;
    Object.values(ingredientsInfo).forEach((item) => {
      totalCost += item.price * item.count;
    });

    return {
      _id: orderModalData._id,
      number: orderModalData.number,
      name: orderModalData.name,
      status: orderModalData.status,
      createdAt: orderModalData.createdAt,
      updatedAt: orderModalData.updatedAt,
      ingredients: orderModalData.ingredients,
      ingredientsInfo: ingredientsInfo,
      total: totalCost,
      date: new Date(orderModalData.createdAt)
    };
  }, [orderModalData, ingredients]);

  if (isLoading || !preparedOrderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={preparedOrderInfo} />;
};
