// Настройка Jest для работы с React и TypeScript
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@components$': '<rootDir>/src/components',
    '^@pages$': '<rootDir>/src/pages'
  }
};