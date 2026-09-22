import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'image-url',
  image_mobile: 'image-mobile-url',
  image_large: 'image-large-url'
};

const mockMain: TIngredient = {
  _id: 'main-1',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  proteins: 433,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 1337,
  image: 'image-url',
  image_mobile: 'image-mobile-url',
  image_large: 'image-large-url'
};

describe('тесты редьюсера constructorSlice', () => {
  test('должен вернуть initialState на неизвестный экшен', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  test('addIngredient с булкой — записывает bun', () => {
    const state = constructorReducer(initialState, addIngredient(mockBun));
    expect(state.bun).toEqual({ ...mockBun, id: 'test-uuid' });
    expect(state.ingredients).toHaveLength(0);
  });

  test('addIngredient с начинкой — добавляет в массив ingredients', () => {
    const state = constructorReducer(initialState, addIngredient(mockMain));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({ ...mockMain, id: 'test-uuid' });
  });

  test('removeIngredient — удаляет начинку по id', () => {
    const stateWithIngredient = {
      ...initialState,
      ingredients: [{ ...mockMain, id: 'test-uuid' }]
    };
    const state = constructorReducer(
      stateWithIngredient,
      removeIngredient('test-uuid')
    );
    expect(state.ingredients).toHaveLength(0);
  });

  test('moveIngredient — меняет порядок начинок местами', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        { ...mockMain, id: 'first' },
        { ...mockMain, id: 'second' }
      ]
    };
    const state = constructorReducer(
      stateWithIngredients,
      moveIngredient({ index: 1, direction: 'up' })
    );
    expect(state.ingredients[0].id).toBe('second');
    expect(state.ingredients[1].id).toBe('first');
  });

  test('clearConstructor — очищает bun и ingredients', () => {
    const filledState = {
      bun: { ...mockBun, id: 'test-uuid' },
      ingredients: [{ ...mockMain, id: 'test-uuid' }]
    };
    const state = constructorReducer(filledState, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});
