import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () =>
  getFeedsApi()
);

export const fetchOrders = createAsyncThunk('feed/fetchOrders', async () =>
  getOrdersApi()
);

export const fetchOrderByNumber = createAsyncThunk(
  'feed/fetchOrderByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить ленту';
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить заказы';
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        const exists = state.orders.some(
          (order) => order.number === action.payload.orders[0].number
        );
        if (!exists) {
          state.orders.push(action.payload.orders[0]);
        }
      });
  }
});

export default feedSlice.reducer;
