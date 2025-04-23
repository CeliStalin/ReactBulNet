module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest',{
      jsx: 'react-jsx'
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'], 
  transformIgnorePatterns: [
    '/node_modules/(?!(@microsoft/mgt-msal2-provider|@microsoft/mgt-element|react|react-dom|@testing-library)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/fileMock.js'
  }
};