const RuleTester = require('eslint').RuleTester

const rule = require('../../../lib/rules/no-jest-reset-mocks')

const parserOptions = require('./parserOptions')

const ruleTester = new RuleTester()

ruleTester.run('no-jest-reset-mocks', rule, {
  valid: [],
  invalid: [
    {
      code: 'mockReset()',
      errors: [
        {
          messageId: 'noJestResetMocks',
        },
      ],
      parserOptions,
    },
    {
      code: 'mockRestore()',
      errors: [
        {
          messageId: 'noJestResetMocks',
        },
      ],
      parserOptions,
    },
    {
      code: 'mockClear()',
      errors: [
        {
          messageId: 'noJestResetMocks',
        },
      ],
      parserOptions,
    },
  ],
})
