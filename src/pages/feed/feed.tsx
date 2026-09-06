import { useEffect, useState } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { selectFeedOrders } from '../../services/selectors/feedSelectors';

const POLL_INTERVAL = 5000;

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchFeeds()).finally(() => setIsInitialLoading(false));

    const intervalId = setInterval(() => {
      dispatch(fetchFeeds());
    }, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isInitialLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
