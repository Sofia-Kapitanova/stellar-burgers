import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/selectors/ingredientsSelectors';
import { selectFeedOrders } from '../../services/selectors/feedSelectors';
import { fetchOrderByNumber } from '../../services/slices/feedSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const orders = useSelector(selectFeedOrders);

  const orderFromStore = orders.find((item) => item.number === Number(number));

  useEffect(() => {
    if (!orderFromStore) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [number, orderFromStore, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderFromStore || !ingredients.length) return null;

    const date = new Date(orderFromStore.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderFromStore.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderFromStore,
      ingredientsInfo,
      date,
      total
    };
  }, [orderFromStore, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
