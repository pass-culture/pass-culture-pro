import React from 'react'
import Siren from '../Siren'
import { mount } from 'enzyme'
import { Form } from 'react-final-form'

jest.mock('../../../../Offerer/OffererCreation/decorators/getSirenInformation', () => {
  const getSirenInformation = jest.fn().mockReturnValue({ name: 'mon ptit nom' })

  return getSirenInformation
})

describe('src | components | pages | Signup | Field | Siren', () => {
  describe('render', () => {
    it('should', async () => {
      // given

      // when
      const wrapper = mount(
        <Form
          initialValues={null}
          onSubmit={jest.fn()}
          render={({ handleSubmit }) => (
            <form>
              <Siren />
              <button
                onClick={handleSubmit}
                type="submit"
              >
                {'Submit'}
              </button>
            </form>
          )}
        />
      )

      const sirenInput = wrapper.find('input')
      sirenInput.simulate('change', { event: { target: { value: 1223 } } })

      // then
      const wrappedSiren = wrapper.find(Siren)
      expect(wrappedSiren.state().fetchedName).toBe('mon ptit nom')
      expect(wrapper.find('.display-name').text()).toBe('mon ptit nom')
    })
  })
})
