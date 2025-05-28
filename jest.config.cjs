// jest.config.js (en la raíz del proyecto)
module.exports = {
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Aquí va, NO en babel.config.cjs
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    // Manejo de archivos CSS/SCSS
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Manejo de archivos de imágenes y otros assets
    '\\.(jpg|jpeg|png|gif|webp|svg)$': 'jest-transform-stub',
  },
};
