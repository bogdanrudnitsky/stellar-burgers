import {
  orderReducer,
  orderBurgerThunk,
  getFeedsThunk,
  getOrdersThunk,
  closeOrder
} from './order-slice';
import { TOrder } from '@utils-types';

// тест для проверки заказов в Redux
describe('order slice', () => {
  const initialState = {
    orderRequest: false,
    orderModalData: null,
    orders: [],
    isLoading: false,
    error: null,
    feed: null,
    shouldResetConstructor: false
  };

  const mockOrder: TOrder = {
    _id: '1',
    status: 'done',
    name: 'Тестовый бургер',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    number: 12345,
    ingredients: ['1', '2']
  };

  // тест для проверки, что при pending запросе заказа isLoading становится true
  it('should set orderRequest to true on orderBurger pending', () => {
    const action = { type: orderBurgerThunk.pending.type };
    const newState = orderReducer(initialState, action);
    expect(newState.orderRequest).toBe(true);
    expect(newState.isLoading).toBe(true);
  });

  // тест для проверки, что при успешном создании заказа сохраняется номер заказа
  it('should set orderModalData on orderBurger fulfilled', () => {
    const action = {
      type: orderBurgerThunk.fulfilled.type,
      payload: { order: mockOrder, ingredientIds: ['1', '2'] }
    };
    const newState = orderReducer(initialState, action);
    expect(newState.orderRequest).toBe(false);
    expect(newState.orderModalData?.number).toBe(12345);
    expect(newState.shouldResetConstructor).toBe(true);
  });

  // тест для проверки, что модалка закрывается и очищается
  it('should close order modal', () => {
    const stateWithOrder = {
      ...initialState,
      orderModalData: mockOrder,
      orderRequest: true
    };
    const action = closeOrder();
    const newState = orderReducer(stateWithOrder, action);
    expect(newState.orderModalData).toBeNull();
    expect(newState.orderRequest).toBe(false);
  });

  // тест для проверки, что при pending запросе ленты isLoading становится true
  it('should set isLoading to true on getFeeds pending', () => {
    const action = { type: getFeedsThunk.pending.type };
    const newState = orderReducer(initialState, action);
    expect(newState.isLoading).toBe(true);
  });

  // тест для проверки, что при успешном получении ленты данные сохраняются
  it('should set feed data on getFeeds fulfilled', () => {
    const mockFeed = {
      orders: [mockOrder],
      total: 1,
      totalToday: 1
    };
    const action = { type: getFeedsThunk.fulfilled.type, payload: mockFeed };
    const newState = orderReducer(initialState, action);
    expect(newState.feed).toEqual(mockFeed);
  });

  // тест для проверки, что при получении заказов пользователя они сохраняются
  it('should set orders on getOrders fulfilled', () => {
    const action = {
      type: getOrdersThunk.fulfilled.type,
      payload: [mockOrder]
    };
    const newState = orderReducer(initialState, action);
    expect(newState.orders.length).toBe(1);
  });
});
