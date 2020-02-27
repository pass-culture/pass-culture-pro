import isRequired from '../isRequired'

describe('page | Signup | validators | isRequired', () => {
  it('should return undefined when a value is given', () => {
    // when
    const result = isRequired('my value')

    // then
    expect(result).toBeUndefined()
  })

  it('should return a error message when no value is given', () => {
    // when
    const result = isRequired()

    // then
    expect(result).toStrictEqual('Ce champ est obligatoire')
  })
})
