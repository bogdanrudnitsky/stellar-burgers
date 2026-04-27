import store, { rootReducer } from './store';
import { ingredientReducer } from './slices/ingredients-slice';
import { orderReducer } from './slices/order-slice';
import { userReducer } from './slices/user-slice';

// тест для проверки, что rootReducer правильно объединяет все слайсы
describe('rootReducer', () => {
  // тест для проверки, что при пустом экшене возвращается начальное состояние
  it('should return initial state for unknown action', () => {
    const initialState = {
      ingredients: ingredientReducer(undefined, { type: 'UNKNOWN' }),
      orders: orderReducer(undefined, { type: 'UNKNOWN' }),
      user: userReducer(undefined, { type: 'UNKNOWN' })
    };
    const newState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(newState).toEqual(initialState);
  });

  // тест для проверки, что store создаётся корректно
  it('should create store with correct structure', () => {
    expect(store.getState()).toHaveProperty('ingredients');
    expect(store.getState()).toHaveProperty('orders');
    expect(store.getState()).toHaveProperty('user');
  });
});
