import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { getFeedsThunk } from '../../services/slices/order-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.orders.feed);
  const isLoading = useSelector((state) => state.orders.isLoading);

  useEffect(() => {
    dispatch(getFeedsThunk());
  }, [dispatch]);

  const handleRefreshFeed = () => {
    dispatch(getFeedsThunk());
  };

  if (isLoading && !feed?.orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={feed?.orders || []} handleGetFeeds={handleRefreshFeed} />
  );
};
