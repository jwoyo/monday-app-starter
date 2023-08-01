module.exports = {
  extends: [
    'turbo',
    'prettier',
    'google',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    es6: true,
    node: true,
  },
  rules: {
    'max-len': 'off',
    'import/no-unresolved': 'off',
    'valid-jsdoc': ['error', {
      'requireReturnType': false,
      'requireParamDescription': false,
      'requireReturnDescription': false,
      'requireParamType': false,
      'requireReturn': false,
    }],
  },
};
