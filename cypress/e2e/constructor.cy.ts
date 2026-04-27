// тест для проверки конструктора бургера в Cypress
describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Отключаем оверлей Webpack DevServer
    cy.visit('/', {
      onBeforeLoad(win) {
        const style = win.document.createElement('style');
        style.innerHTML = '#webpack-dev-server-client-overlay { display: none !important; }';
        win.document.head.appendChild(style);
      }
    });
    
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.wait('@getIngredients');
    cy.contains('Соберите бургер').should('exist');
    cy.wait(500);
  });

  // Закрытие модалки через Escape
  const closeModal = () => {
    cy.get('body').type('{esc}', { force: true });
  };

  // Добавление ингредиента через модалку
  const addIngredient = (name: string) => {
    cy.contains(name).click({ force: true });
    cy.contains('Детали ингредиента').should('exist');
    cy.contains('Добавить').click({ force: true });
    closeModal();
  };

  // 1. Добавление булки
  it('должен добавить булку в конструктор', () => {
    addIngredient('Краторная булка');
    cy.contains(/Краторная булка.*верх/i, { timeout: 5000 }).should('exist');
    cy.contains(/Краторная булка.*низ/i, { timeout: 5000 }).should('exist');
  });

  // 2. Добавление начинки
  it('должен добавить начинку в конструктор', () => {
    addIngredient('Соус Spicy-X');
    cy.contains('Соус Spicy-X', { timeout: 5000 }).should('exist');
  });

  // 3. Открытие модалки ингредиента
  it('должен открыть модальное окно ингредиента', () => {
    cy.contains('Краторная булка').click({ force: true });
    cy.contains('Детали ингредиента').should('exist');
    closeModal();
  });

  // 4. Закрытие модалки по Escape
  it('должен закрыть модальное окно по Escape', () => {
    cy.contains('Краторная булка').click({ force: true });
    cy.contains('Детали ингредиента').should('exist');
    cy.get('body').type('{esc}', { force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });

  // 5. Создание заказа (требует авторизации)
  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'fake-token');
      localStorage.setItem('refreshToken', 'fake-refresh-token');
      
      cy.intercept('GET', '**/api/auth/user', {
        statusCode: 200,
        body: { success: true, user: { email: 'test@test.com', name: 'Test User' } }
      }).as('getUser');
      
      cy.intercept('POST', '**/api/orders', {
        statusCode: 200,
        body: { success: true, order: { number: 12345 }, name: 'Тестовый бургер' }
      }).as('createOrder');
      
      cy.reload();
      cy.wait('@getIngredients');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });

    // 5.1 Создание заказа и проверка номера
    it('должен создать заказ и показать номер', () => {
      addIngredient('Краторная булка');
      addIngredient('Соус Spicy-X');
      
      cy.contains('Оформить заказ').click({ force: true });
      cy.wait('@createOrder', { timeout: 10000 });
      cy.contains('12345', { timeout: 5000 }).should('exist');
      closeModal();
    });

    // 5.2 Очистка конструктора после заказа
    it('должен очистить конструктор после создания заказа', () => {
      addIngredient('Краторная булка');
      addIngredient('Соус Spicy-X');
      
      cy.contains('Оформить заказ').click({ force: true });
      cy.wait('@createOrder', { timeout: 10000 });
      closeModal();
      
      // Проверяем, что конструктор пуст
      // Проверяем отсутствие булки
      cy.contains(/Краторная булка.*верх/i, { timeout: 1000 }).should('not.exist');
      cy.contains(/Краторная булка.*низ/i, { timeout: 1000 }).should('not.exist');
      // Проверяем отсутствие начинки
      cy.contains('Соус Spicy-X', { timeout: 1000 }).should('not.exist');
    });
  });
});