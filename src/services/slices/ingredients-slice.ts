import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TConstructorIngredient,
  TConstructorItems,
  TIngredient
} from '@utils-types';
import { generateUniqueId } from '../../utils/get-random-id';

type TBurgerIngredients = {
  ingredients: Array<TIngredient>;
  constructorItems: TConstructorItems;
  isLoading: boolean;
  isInit: boolean;
};

const initialState: TBurgerIngredients = {
  ingredients: [],
  isLoading: false,
  isInit: false,
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getIngredients',
  async () => await getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems = {
            ...state.constructorItems,
            bun: { ...action.payload }
          };
        } else {
          state.constructorItems = {
            ...state.constructorItems,
            ingredients: [...state.constructorItems.ingredients, action.payload]
          };
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: generateUniqueId() }
      })
    },
    deleteIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload.id
        );
    },
    moveUpIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const index = state.constructorItems.ingredients.findIndex(
        (arr) => arr.id === action.payload.id
      );
      if (index > 0) {
        const ingredientToMove = state.constructorItems.ingredients[index];
        state.constructorItems.ingredients.splice(index, 1);
        state.constructorItems.ingredients.splice(
          index - 1,
          0,
          ingredientToMove
        );
      }
    },
    moveDounIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const index = state.constructorItems.ingredients.findIndex(
        (arr) => arr.id === action.payload.id
      );
      if (
        index !== -1 &&
        index < state.constructorItems.ingredients.length - 1
      ) {
        const ingredientToMove = state.constructorItems.ingredients[index];
        state.constructorItems.ingredients.splice(index, 1);
        state.constructorItems.ingredients.splice(
          index + 1,
          0,
          ingredientToMove
        );
      }
    },
    clearIngredients: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    }
  },
  selectors: {
    getBuns: (state) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'bun'),
    getMains: (state) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'main'),
    getSauces: (state) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'sauce')
  },
  extraReducers: (builder) => {
    builder.addCase(getIngredientsThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getIngredientsThunk.rejected, (state) => {
      state.isInit = true;
      state.isLoading = false;
    });
    builder.addCase(getIngredientsThunk.fulfilled, (state, { payload }) => {
      state.isInit = true;
      state.isLoading = false;
      state.ingredients = payload;
    });
  }
});

export const { getBuns, getMains, getSauces } = ingredientsSlice.selectors;
export const {
  addIngredient,
  deleteIngredient,
  moveUpIngredient,
  moveDounIngredient,
  clearIngredients
} = ingredientsSlice.actions;
export const ingredientReducer = ingredientsSlice.reducer;
// Добавьте эти экспорты для совместимости
export const fetchIngredients = getIngredientsThunk;
export const addToConstructor = addIngredient;
export const removeFromConstructor = deleteIngredient;
export const moveIngredientUp = moveUpIngredient;
export const moveIngredientDown = moveDounIngredient;
export const resetConstructor = clearIngredients;
