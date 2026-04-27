import {
  userReducer,
  loginUser,
  registerUser,
  logout,
  checkUser,
  setIsAuthChecked,
  setUser,
  clearError
} from './user-slice';
import { TUser } from '@utils-types';

// тест для проверки пользователя в Redux
describe('user slice', () => {
  const initialState = {
    isAuthChecked: false,
    user: null,
    error: undefined
  };

  const mockUser: TUser = {
    email: 'test@test.com',
    name: 'Test User'
  };

  // тест для проверки, что при pending логина isAuthChecked становится true
  it('should set isAuthChecked to true on loginUser pending', () => {
    const action = { type: loginUser.pending.type };
    const newState = userReducer(initialState, action);
    expect(newState.isAuthChecked).toBe(true);
  });

  // тест для проверки, что при успешном логине пользователь сохраняется
  it('should set user on loginUser fulfilled', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: { user: mockUser }
    };
    const newState = userReducer(initialState, action);
    expect(newState.user).toEqual(mockUser);
    expect(newState.error).toBeUndefined();
  });

  // тест для проверки, что при ошибке логина сохраняется сообщение об ошибке
  it('should set error on loginUser rejected', () => {
    const action = {
      type: loginUser.rejected.type,
      error: { message: 'Ошибка входа' }
    };
    const newState = userReducer(initialState, action);
    expect(newState.error).toBe('Ошибка входа');
    expect(newState.isAuthChecked).toBe(false);
  });

  // тест для проверки, что при выходе пользователь удаляется
  it('should clear user on logout fulfilled', () => {
    const stateWithUser = {
      ...initialState,
      user: mockUser,
      isAuthChecked: true
    };
    const action = { type: logout.fulfilled.type };
    const newState = userReducer(stateWithUser, action);
    expect(newState.user).toBeNull();
    expect(newState.isAuthChecked).toBe(true);
  });

  // тест для проверки, что ошибка очищается
  it('should clear error', () => {
    const stateWithError = {
      ...initialState,
      error: 'Какая-то ошибка'
    };
    const action = clearError();
    const newState = userReducer(stateWithError, action);
    expect(newState.error).toBeUndefined();
  });

  // тест для проверки, что пользователь устанавливается вручную
  it('should set user manually', () => {
    const action = setUser(mockUser);
    const newState = userReducer(initialState, action);
    expect(newState.user).toEqual(mockUser);
  });

  // тест для проверки, что статус проверки устанавливается
  it('should set isAuthChecked', () => {
    const action = setIsAuthChecked(true);
    const newState = userReducer(initialState, action);
    expect(newState.isAuthChecked).toBe(true);
  });
});
