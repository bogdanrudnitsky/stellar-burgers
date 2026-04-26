import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface Order {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  feed: {
    orders: TOrder[];
    total: number;
    totalToday: number;
  } | null;
  shouldResetConstructor: boolean;
}

export const getFeedsThunk = createAsyncThunk(
  'feed/getFeed',
  async () => await getFeedsApi()
);

export const getOrdersThunk = createAsyncThunk(
  'orders/getOrders',
  async () => await getOrdersApi()
);

export const orderBurgerThunk = createAsyncThunk(
  'order/orderBurger',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return { ...response, ingredientIds: data };
  }
);

export const getOrderByNumberThunk = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => await getOrderByNumberApi(number)
);

export const initialState: Order = {
  orderRequest: false,
  orderModalData: null,
  orders: [],
  isLoading: false,
  error: null,
  feed: null,
  shouldResetConstructor: false
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrder: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
    },
    resetConstructorAfterOrder: (state) => {
      state.shouldResetConstructor = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.feed = action.payload;
      })
      .addCase(getOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.orderRequest = true;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orders = action.payload;
      })
      .addCase(orderBurgerThunk.pending, (state) => {
        state.isLoading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurgerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.error = action.error.message ?? null;
      })
      .addCase(orderBurgerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.orderModalData = {
          _id: action.payload.order._id,
          status: action.payload.order.status,
          name: action.payload.order.name,
          createdAt: action.payload.order.createdAt,
          updatedAt: action.payload.order.updatedAt,
          number: action.payload.order.number,
          ingredients: action.payload.ingredientIds
        };
        state.shouldResetConstructor = true;
      })
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const order = action.payload.orders[0];
        if (order) {
          state.orderModalData = {
            _id: order._id,
            status: order.status,
            name: order.name,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            number: order.number,
            ingredients: order.ingredients || []
          };
        }
      });
  }
});

export const { closeOrder, resetConstructorAfterOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
