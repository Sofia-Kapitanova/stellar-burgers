import { RootState } from '../store';

export const selectUser = (state: RootState) => state.user.user;

export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;

export const selectUserLoading = (state: RootState) => state.user.loading;

export const selectUserError = (state: RootState) => state.user.error;
