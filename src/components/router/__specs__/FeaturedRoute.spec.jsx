import { shallow } from 'enzyme'
import React from 'react'
import { Route } from 'react-router-dom'

import NotMatch from 'components/pages/Errors/NoMatch/NoMatch'

import FeaturedRoute from '../FeaturedRoute'

const Foo = () => <div />

describe('src | components | router | FeaturedRoute', () => {
  describe('when features are not yet loaded', () => {
    it('should render null', () => {
      // given
      const props = {
        areFeaturesLoaded: false,
        component: Foo,
        isRouteDisabled: false,
        requestGetFeatures: jest.fn(),
      }

      // when
      const wrapper = shallow(<FeaturedRoute {...props} />)

      // then
      const routeWrapper = wrapper.find(Route)
      expect(routeWrapper).toHaveLength(0)
    })

    it('should call requestGetFeatures', () => {
      // given
      const props = {
        areFeaturesLoaded: false,
        component: Foo,
        isRouteDisabled: false,
        requestGetFeatures: jest.fn(),
      }

      // when
      shallow(<FeaturedRoute {...props} />)

      // then
      expect(props.requestGetFeatures).toHaveBeenCalledTimes(1)
    })
  })

  describe('when features are loaded and disabled', () => {
    it('should render NotMatch', () => {
      // given
      const props = {
        areFeaturesLoaded: true,
        component: Foo,
        isRouteDisabled: true,
        requestGetFeatures: jest.fn(),
      }

      // when
      const wrapper = shallow(<FeaturedRoute {...props} />)

      // then
      const routeWrapper = wrapper.find(Route)
      expect(routeWrapper).toHaveLength(1)
      expect(routeWrapper.props().component).toBe(NotMatch)
      expect(props.requestGetFeatures).toHaveBeenCalledTimes(0)
    })

    it('should not call requestGetFeatures', () => {
      // given
      const props = {
        areFeaturesLoaded: true,
        component: Foo,
        isRouteDisabled: true,
        requestGetFeatures: jest.fn(),
      }

      // when
      shallow(<FeaturedRoute {...props} />)

      // then
      expect(props.requestGetFeatures).toHaveBeenCalledTimes(0)
    })
  })

  describe('when features are loaded and not disabled', () => {
    it('should render Foo', () => {
      // given
      const props = {
        areFeaturesLoaded: true,
        component: Foo,
        isRouteDisabled: false,
        requestGetFeatures: jest.fn(),
      }

      // when
      const wrapper = shallow(<FeaturedRoute {...props} />)

      // then
      const routeWrapper = wrapper.find(Route)
      expect(routeWrapper).toHaveLength(1)
      expect(routeWrapper.props().component).toBe(Foo)
      expect(props.requestGetFeatures).toHaveBeenCalledTimes(0)
    })

    it('should not call requestGetFeatures', () => {
      // given
      const props = {
        areFeaturesLoaded: true,
        component: Foo,
        isRouteDisabled: false,
        requestGetFeatures: jest.fn(),
      }

      // when
      shallow(<FeaturedRoute {...props} />)

      // then
      expect(props.requestGetFeatures).toHaveBeenCalledTimes(0)
    })
  })
})
