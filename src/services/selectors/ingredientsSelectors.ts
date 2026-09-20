import { RootState } from '../store';

export const selectIngredients = (state: RootState) => state.ingredients.items;

export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
