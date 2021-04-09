module.exports = {
  meta: {
    messages: {
      noJestResetMocks: 'Ne pas utiliser les méthodes de reset de mock (mockReset, mockClear, mockRestore). Jest est configuré pour reset tous les mocks a chaque test.',
    },
  },
  create: context => ({
    CallExpression: node => {
      const wrongValues = ['mockReset', 'mockClear', 'mockRestore']

      if(node.callee.name === undefined) return

      const usesMockMethod = wrongValues.find(name => node.callee.name.includes(name)) !== undefined
      if (usesMockMethod) {
        context.report({
          data: {
            name: node.callee.name,
          },
          node,
          messageId: 'noJestResetMocks',
        })
      }
    },
  }),
}
