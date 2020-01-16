import React from 'react'
import { shallow } from 'enzyme'
import Siren from '../Siren'

  describe('src | components | pages | Offerer | OffererCreation | Fields | Siren', () => {
  it('should match snapshot', () => {
    // when
    const wrapper = shallow(<Siren />)

    // then
    expect(wrapper).toMatchSnapshot()
  })
})
