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

  const addIngredient = (name: string) => {
    cy.contains(name)
      .parents('li')
      .find('button')
      .click();
  };

  const getConstructor = () => {
    return cy.contains('Оформить заказ').closest('section');
  };

  const getModal = () => cy.get('#modals');
  const modalShouldBeOpen = () => getModal().children().should('have.length.greaterThan', 0);
  const modalShouldBeClosed = () => getModal().should('not.contain', 'Детали ингредиента');

  it('должен добавить булку в конструктор', () => {
    addIngredient('Краторная булка');
    getConstructor().should('contain', 'Краторная булка N-200i (верх)');
    getConstructor().should('contain', 'Краторная булка N-200i (низ)');
  });

  it('должен добавить начинку в конструктор', () => {
    addIngredient('Соус Spicy-X');
    getConstructor().should('contain', 'Соус Spicy-X');
  });

  it('должен открыть модалку ингредиента с правильными данными', () => {
    cy.contains('Краторная булка').click();
    modalShouldBeOpen();
    getModal().should('contain', 'Детали ингредиента');
    getModal().should('contain', 'Краторная булка');
    getModal().should('contain', 'Калории');
    getModal().should('contain', 'Белки');
  });

  it('закрытие по Escape', () => {
    cy.contains('Краторная булка').click();
    modalShouldBeOpen();
    cy.get('body').type('{esc}');
    modalShouldBeClosed();
  });

  it('закрытие по крестику', () => {
    cy.contains('Краторная булка').click();
    modalShouldBeOpen();
    cy.get('#modals button').first().click();
    modalShouldBeClosed();
  });

  it('закрытие по overlay', () => {
    cy.contains('Краторная булка').click();
    modalShouldBeOpen();
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    modalShouldBeClosed();
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'fake-token');
      localStorage.setItem('refreshToken', 'fake-refresh-token');

      cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');

      cy.reload();
      cy.wait('@getIngredients');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });

    it('должен создать заказ и показать номер в модалке', () => {
      addIngredient('Краторная булка');
      addIngredient('Соус Spicy-X');
      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');
      modalShouldBeOpen();
      getModal().should('contain', '12345');
    });

    it('должен очистить конструктор после создания заказа', () => {
      addIngredient('Краторная булка');
      addIngredient('Соус Spicy-X');
      
      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');
      cy.get('#modals button').first().click();
      cy.wait(1000);
      
      cy.contains('Краторная булка N-200i (верх)').should('not.exist');
      cy.contains('Соус Spicy-X').should('not.exist');
    });
  });
});