import { useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '../../services/slices/feedSlice';
import { selectFeedOrders } from '../../services/selectors/feedSelectors';

const POLL_INTERVAL = 5000;

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);

  useEffect(() => {
    dispatch(fetchOrders());

    const intervalId = setInterval(() => {
      dispatch(fetchOrders());
    }, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
