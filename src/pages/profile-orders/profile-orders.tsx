import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { getOrdersThunk } from '../../services/slices/order-slice';
import { Preloader } from '@ui';
import { RootState } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const isLoading = useSelector((state: RootState) => state.orders.isLoading);

  useEffect(() => {
    dispatch(getOrdersThunk());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
