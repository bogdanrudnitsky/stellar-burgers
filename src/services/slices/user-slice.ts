import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

interface User {
  isAuthChecked: boolean;
  user: TUser | null;
  error: string | undefined;
}

export const initialState: User = {
  isAuthChecked: false,
  user: null,
  error: undefined
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  (data: TRegisterData) => registerUserApi(data)
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => await forgotPasswordApi(data)
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) =>
    await resetPasswordApi(data)
);

export const checkUser = createAsyncThunk(
  'user/checkUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((response) => {
          dispatch(setUser(response.user));
        })
        .catch(() => {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => dispatch(setIsAuthChecked(true)));
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>) => await updateUserApi(user)
);

export const logout = createAsyncThunk('user/logout', async () => {
  const response = await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
  return response;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.isAuthChecked = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.error = action.error.message;
      state.isAuthChecked = false;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isAuthChecked = true;
      state.error = undefined;
      state.user = action.payload.user;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.isAuthChecked = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isAuthChecked = false;
      state.error = action.error.message;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isAuthChecked = true;
      state.error = undefined;
      state.user = action.payload.user;
    });
    builder.addCase(logout.pending, (state) => {
      state.error = undefined;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.error = undefined;
      state.user = null;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });
  }
});
export const { setIsAuthChecked, setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
