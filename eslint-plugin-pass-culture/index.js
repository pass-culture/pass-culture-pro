module.exports = {
  rules: {
    'no-mutate-on-merge': require('./lib/rules/no-mutate-on-merge'),
    'no-jest-reset-mocks': require('./lib/rules/no-jest-reset-mocks'),
  },
  configs: {
    recommended: {
      plugins: ['pass-culture'],
      rules: {
        'pass-culture/no-mutate-on-merge': 'error',
        'pass-culture/no-jest-reset-mocks': 'error',
      },
    },
  },
}
