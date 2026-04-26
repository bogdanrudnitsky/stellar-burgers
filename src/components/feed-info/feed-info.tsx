import { FC, useMemo } from 'react';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { TOrder } from '@utils-types';

export const FeedInfo: FC = () => {
  const feed = useSelector((state: RootState) => state.orders.feed);
  const orders = feed?.orders || [];

  const readyOrders = useMemo(
    () =>
      orders
        .filter((order: TOrder) => order.status === 'done')
        .map((order: TOrder) => order.number)
        .slice(0, 20),
    [orders]
  );

  const pendingOrders = useMemo(
    () =>
      orders
        .filter((order: TOrder) => order.status === 'pending')
        .map((order: TOrder) => order.number)
        .slice(0, 20),
    [orders]
  );

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total: feed?.total || 0, totalToday: feed?.totalToday || 0 }}
    />
  );
};
