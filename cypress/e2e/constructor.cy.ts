// cypress/e2e/constructor.cy.ts

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');

    cy.contains('Соберите бургер').should('exist');
  });

  // ✅ Исправлено: кликаем на кнопку "Добавить" для булки
  const addBun = (name: string) => {
    cy.contains(name)
      .parents('li')
      .find('button')
      .click();
  };

  const addIngredient = (name: string) => {
    cy.contains(name)
      .parents('li')
      .find('button')
      .click();
  };

  const getModal = () => {
    return cy.get('#modals');
  };

  const modalShouldBeOpen = () => {
    getModal().children().should('have.length.greaterThan', 0);
  };

  const modalShouldBeClosed = () => {
    getModal().should('not.contain', 'Детали ингредиента');
  };

  // 1. Добавление булки
  it('должен добавить булку в конструктор', () => {
    addBun('Краторная булка');
    cy.contains('Краторная булка N-200i (верх)', { timeout: 5000 }).should('exist');
    cy.contains('Краторная булка N-200i (низ)', { timeout: 5000 }).should('exist');
  });

  // 2. Добавление начинки
  it('должен добавить начинку в конструктор', () => {
    addIngredient('Соус Spicy-X');
    cy.contains('Соус Spicy-X', { timeout: 5000 }).should('exist');
  });

  // 3. Открытие модалки с проверкой данных
  it('должен открыть модалку ингредиента с правильными данными', () => {
    cy.contains('Краторная булка').click();
    modalShouldBeOpen();
    getModal().should('contain', 'Детали ингредиента');
    getModal().should('contain', 'Краторная булка');
    getModal().should('contain', 'Калории');
    getModal().should('contain', 'Белки');
  });

  // 4. Закрытие по Escape
  it('закрытие по Escape', () => {
    cy.contains('Краторная булка').click();
    modalShouldBeOpen();
    cy.get('body').type('{esc}');
    modalShouldBeClosed();
  });

  // 5. Закрытие по крестику
  it('закрытие по крестику', () => {
    cy.contains('Краторная булка').click();
    modalShouldBeOpen();
    cy.get('#modals button').first().click();
    modalShouldBeClosed();
  });

  // 6. Закрытие по оверлей
  it('закрытие по overlay', () => {
    cy.contains('Краторная булка').click();
    modalShouldBeOpen();
    cy.get('[class*="RuQycGaRTQNbnIEC5d3Y"]').click({ force: true });
    modalShouldBeClosed();
  });

  // 7. Создание заказа
  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'fake-token');
      localStorage.setItem('refreshToken', 'fake-refresh-token');

      cy.intercept('GET', '**/api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');

      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');

      cy.reload();
      cy.wait('@getIngredients');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });

    it('должен создать заказ и показать номер в модалке', () => {
      addBun('Краторная булка');
      addIngredient('Соус Spicy-X');

      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');

      modalShouldBeOpen();
      getModal().should('contain', '12345');
    });

    it('должен очистить конструктор после создания заказа', () => {
      addBun('Краторная булка');
      addIngredient('Соус Spicy-X');

      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get('body').type('{esc}');

      cy.contains('Краторная булка N-200i (верх)').should('not.exist');
      cy.contains('Краторная булка N-200i (низ)').should('not.exist');
      cy.contains('Соус Spicy-X').should('not.exist');
    });
  });
});