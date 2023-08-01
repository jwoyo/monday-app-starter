module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
  ignorePatterns: [
    'build.js',
    '/dist/**/*', // Ignore built files.
  ],
  extends: ['custom'],
};
