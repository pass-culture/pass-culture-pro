import React from 'react'
import { shallow } from 'enzyme'

import MediationItem from '../MediationItem'
import { Field, Form } from 'pass-culture-shared'

describe('src | components | pages | Offer | MediationItem', () => {
  let props

  beforeEach(() => {
    props = {
      mediation: {
        id: 'AE',
        isActive: true,
        thumbUrl: 'http://example.com/image.jpg',
      }
    }
  })

  describe('snapshot', () => {
    it('should match snapshot', () => {
      // when
      const wrapper = shallow(<MediationItem {...props} />)

      // then
      expect(wrapper).toBeDefined()
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('render', () => {
    it('should render a Form component with the right props', () => {
      // when
      const wrapper = shallow(<MediationItem {...props} />)

      // then
      const form = wrapper.find(Form)
      expect(form).toHaveLength(1)
      expect(form.prop('action')).toBe('/mediations/AE')
      expect(form.prop('handleSuccessNotification')).toBe(null)
      expect(form.prop('isAutoSubmit')).toBe(true)
      expect(form.prop('name')).toBe('mediation-AE')
      expect(form.prop('patch')).toEqual({id: 'AE', isActive: true, thumbUrl: 'http://example.com/image.jpg'})
      expect(form.prop('Tag')).toBe('li')
    })

    it('should render an img element with right props', () => {
      // when
      const wrapper = shallow(<MediationItem {...props} />)

      // then
      const img = wrapper.find('img')
      expect(img).toHaveLength(1)
      expect(img.prop('alt')).toBe('accroche-AE')
      expect(img.prop('disabled')).toBe(false)
      expect(img.prop('src')).toBe('http://example.com/image.jpg')
    })

    it('should render a Field component with the right props', () => {
      // when
      const wrapper = shallow(<MediationItem {...props} />)

      // then
      const field = wrapper.find(Field)
      expect(field.prop('name')).toBe('isActive')
      expect(field.prop('type')).toBe('checkbox')
    })
  })
})
