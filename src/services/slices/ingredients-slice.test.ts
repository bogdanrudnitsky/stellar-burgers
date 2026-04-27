import {
  ingredientReducer,
  addIngredient,
  deleteIngredient,
  moveUpIngredient,
  moveDounIngredient,
  clearIngredients,
  getIngredientsThunk
} from './ingredients-slice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

// Моковые данные для тестов
const mockBun: TIngredient = {
  _id: '1',
  name: 'Краторная булка',
  type: 'bun',
  price: 100,
  image: '',
  image_large: '',
  image_mobile: '',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0
};

const mockIngredient: TIngredient = {
  _id: '2',
  name: 'Соус Spicy',
  type: 'sauce',
  price: 50,
  image: '',
  image_large: '',
  image_mobile: '',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0
};

// тест для проверки начального состояния редьюсера
describe('ingredients slice', () => {
  const initialState = {
    ingredients: [],
    constructorItems: { bun: null, ingredients: [] },
    isLoading: false,
    isInit: false
  };

  // тест для проверки, что булка добавляется в конструктор
  it('should add bun to constructor', () => {
    const action = addIngredient(mockBun);
    const newState = ingredientReducer(initialState, action);
    expect(newState.constructorItems.bun).not.toBeNull();
    expect(newState.constructorItems.bun?.type).toBe('bun');
  });

  // тест для проверки, что ингредиент добавляется в начинку
  it('should add ingredient to constructor', () => {
    const action = addIngredient(mockIngredient);
    const newState = ingredientReducer(initialState, action);
    expect(newState.constructorItems.ingredients.length).toBe(1);
    expect(newState.constructorItems.ingredients[0].type).toBe('sauce');
  });

  // тест для проверки, что ингредиент удаляется из конструктора
  it('should delete ingredient from constructor', () => {
    const addAction = addIngredient(mockIngredient);
    let newState = ingredientReducer(initialState, addAction);
    const ingredientId = newState.constructorItems.ingredients[0].id;
    const deleteAction = deleteIngredient(
      newState.constructorItems.ingredients[0]
    );
    newState = ingredientReducer(newState, deleteAction);
    expect(newState.constructorItems.ingredients.length).toBe(0);
  });

  // тест для проверки, что ингредиент перемещается вверх
  it('should move ingredient up', () => {
    const ingredient1 = addIngredient(mockIngredient).payload;
    const ingredient2 = addIngredient(mockIngredient).payload;
    let state = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [ingredient1, ingredient2]
      }
    };
    const action = moveUpIngredient(ingredient2);
    const newState = ingredientReducer(state, action);
    expect(newState.constructorItems.ingredients[0].id).toBe(ingredient2.id);
  });

  // тест для проверки, что конструктор очищается
  it('should clear constructor', () => {
    const addAction = addIngredient(mockBun);
    let newState = ingredientReducer(initialState, addAction);
    newState = ingredientReducer(newState, clearIngredients());
    expect(newState.constructorItems.bun).toBeNull();
    expect(newState.constructorItems.ingredients.length).toBe(0);
  });

  // тест для проверки, что при pending запросе isLoading становится true
  it('should set isLoading to true on pending', () => {
    const action = { type: getIngredientsThunk.pending.type };
    const newState = ingredientReducer(initialState, action);
    expect(newState.isLoading).toBe(true);
  });

  // тест для проверки, что при успешном запросе данные сохраняются и isLoading становится false
  it('should set ingredients and isLoading to false on fulfilled', () => {
    const mockIngredients = [mockBun, mockIngredient];
    const action = {
      type: getIngredientsThunk.fulfilled.type,
      payload: mockIngredients
    };
    const newState = ingredientReducer(initialState, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.isInit).toBe(true);
    expect(newState.ingredients.length).toBe(2);
  });

  // тест для проверки, что при ошибке запроса isLoading становится false
  it('should set isLoading to false on rejected', () => {
    const action = { type: getIngredientsThunk.rejected.type };
    const newState = ingredientReducer(initialState, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.isInit).toBe(true);
  });
});
