import form from '../form'
import getSirenInformation from '../../components/pages/Offerer/OffererCreation/decorators/getSirenInformation';
import get from 'lodash.get';

jest.mock('pass-culture-shared', () => ({
  form: () => {
    return {
      user: {
        name: 'John',
      },
    }
  },
}))

jest.mock('../../components/pages/Offerer/OffererCreation/decorators/getSirenInformation', () => {
  return {
    getSirenInformation: () => ({
      address: '1 rue de San Antonio',
      city: 'Los Angeles',
      latitude: 12.6,
      longitude: 34.9,
      name: 'OCTO',
      postalCode: '75019',
      ["siren"]: '123456789'
    })

  }
})

describe('reducers | form', () => {
  it('should preserve informations from pass-culture-shared', () => {
    // when
    const newState = form({}, { type: '' })

    // then
    expect(newState).toStrictEqual({ user: { name: 'John' } })
  })

  it('should', () => {
    // when
    const newState = form(
      {},
      {
        patch: { siren: '123456789' },
        type: 'MERGE_FORM_USER_SIREN',
      }
    )

    // then
    expect(newState).toStrictEqual({
      user: {
        address: '1 rue de San Antonio',
        city: 'Los Angeles',
        latitude: 12.6,
        longitude: 34.9,
        name: 'OCTO',
        postalCode: '75019',
        ["siren"]: '123456789'
      },
    })
  })
})
