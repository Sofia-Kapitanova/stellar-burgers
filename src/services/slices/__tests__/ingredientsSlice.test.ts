import ingredientsReducer, {
  fetchIngredients,
  initialState
} from './../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  }
];

describe('тесты редьюсера ingredientsSlice', () => {
  test('должен вернуть initialState на неизвестный экшен', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  test('fetchIngredients.pending — включает лоадер и сбрасывает ошибку', () => {
    const state = ingredientsReducer(
      { ...initialState, error: 'предыдущая ошибка' },
      fetchIngredients.pending('requestId')
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fetchIngredients.fulfilled — выключает лоадер и записывает данные', () => {
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      fetchIngredients.fulfilled(mockIngredients, 'requestId')
    );
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  test('fetchIngredients.rejected — выключает лоадер и записывает ошибку', () => {
    const error = new Error('Не удалось загрузить ингредиенты');
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      fetchIngredients.rejected(error, 'requestId')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });
});
