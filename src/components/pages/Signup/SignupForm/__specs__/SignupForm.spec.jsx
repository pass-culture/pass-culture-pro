import React from 'react'
import SignupForm from '../SignupForm'
import { shallow } from 'enzyme'
import { NavLink } from 'react-router-dom'
import Email from '../Fields/Email'
import Password from '../Fields/Password'
import LastName from '../Fields/LastName'
import FirstName from '../Fields/FirstName'
import PhoneNumber from '../Fields/PhoneNumber'
import Siren from '../Fields/Siren'
import Newsletter from '../Fields/Newsletter'
import JoinSurvey from '../Fields/JoinSurvey'
import ConditionGeneralUtilisation from '../Fields/ConditionGeneralUtilisation'

describe('src | components | pages | Signup', () => {
  let props

  beforeEach(() => {
    props = {
      errors: [],
      offererName: 'super structure',
      patch: {},
    }
  })

  describe('render', () => {
    it('should render a disabled submit button when required inputs are not filled', () => {
      // Given
      props.pristine = false
      props.invalid = true

      // when
      const wrapper = shallow(<SignupForm {...props} />)

      // then
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.prop('disabled')).toBe(true)
    })

    it('should render a Field component for email with the right props', () => {
      // when
      const wrapper = shallow(<SignupForm {...props} />)

      // then
      const field = wrapper.find(Email)
      expect(field).toHaveLength(1)
    })

    it('should render a Field component for password with the right props', () => {
      // when
      const wrapper = shallow(<SignupForm {...props} />)

      // then
      const field = wrapper.find(Password)
      expect(field).toHaveLength(1)
    })

    it('should render a Field component for lastname with the right props', () => {
      // when
      const wrapper = shallow(<SignupForm {...props} />)

      // then
      const field = wrapper.find(LastName)
      expect(field).toHaveLength(1)
    })

    it('should render a Field component for firstname with the right props', () => {
      // when
      const wrapper = shallow(<SignupForm {...props} />)

      // then
      const field = wrapper.find(FirstName)
      expect(field).toHaveLength(1)
    })

    it('should render a Field component for phone number with the right props', () => {
      // when
      const wrapper = shallow(<SignupForm {...props} />)

      // then
      const field = wrapper.find(PhoneNumber)
      expect(field).toHaveLength(1)
    })

    it('should render a Field component for siren with the right props', () => {
      // when
      const wrapper = shallow(<SignupForm {...props} />)

      // then
      const field = wrapper.find(Siren)
      expect(field).toHaveLength(1)
    })

    it('should render a Field component for newsletter agreement with the right props', () => {
      // when
      const wrapper = shallow(<SignupForm {...props} />)

      // then
      const field = wrapper.find(Newsletter)
      expect(field).toHaveLength(1)
    })

    it('should render a Field component for contact agreement with the right props', () => {
      // when
      const wrapper = shallow(<SignupForm {...props} />)

      // then
      const field = wrapper.find(JoinSurvey)
      expect(field).toHaveLength(1)
    })

    it('should render a Field component for cgu agreement with the right props', () => {
      // when
      const wrapper = shallow(<SignupForm {...props} />)

      // then
      const field = wrapper.find(ConditionGeneralUtilisation)
      expect(field).toHaveLength(1)
    })

    it('should render a NavLink component with the right props', () => {
      // when
      const wrapper = shallow(<SignupForm {...props} />)

      // then
      const navLink = wrapper.find(NavLink)
      expect(navLink).toHaveLength(1)
      expect(navLink.prop('className')).toBe('button is-secondary')
      expect(navLink.prop('to')).toBe('/connexion')
    })

    it('should render a SubmitButton component with the right props', () => {
      // when
      const wrapper = shallow(<SignupForm {...props} />)

      // then
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton).toHaveLength(1)
      expect(submitButton.prop('className')).toBe('button is-primary is-outlined')
      expect(submitButton.prop('type')).toBe('submit')
      expect(submitButton.text()).toBe('Créer')
    })
  })
})
