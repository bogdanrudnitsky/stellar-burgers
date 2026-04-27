import { defineConfig } from 'cypress';

// Настройка Cypress для e2e тестирования
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000',
    supportFile: false,
    viewportWidth: 1280,
    viewportHeight: 720
  }
});