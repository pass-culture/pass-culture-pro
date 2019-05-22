import React from 'react'
import { shallow } from 'enzyme'

import Reimbursements from '../Reimbursements'

describe('src | components | pages | Reimbursements', () => {
  describe('snapshot', () => {
    it('should match snapshot', () => {
      // when
      const wrapper = shallow(<Reimbursements />)

      // then
      expect(wrapper).toBeDefined()
      expect(wrapper).toMatchSnapshot()
    })
  })
})
