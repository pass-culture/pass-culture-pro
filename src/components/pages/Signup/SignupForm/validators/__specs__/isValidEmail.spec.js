import isValidEmail from '../isValidEmail'

describe('page | Signup | validators | isValidEmail', () => {
  it('should return an error message when a wrong email is given', () => {
    // when
    const result = isValidEmail('my value')

    // then
    expect(result).toStrictEqual('Veuillez saisir une adresse email valide')
  })

  it('should return undefined when the email is valid', () => {
    // when
    const result = isValidEmail('test@example.com')

    // then
    expect(result).toBeUndefined()
  })
})
