import { shallow } from 'enzyme'
import React from 'react'
import VenueProviderForm from '../VenueProviderForm'
import { Field } from 'react-final-form'
import { HiddenField, TextField } from '../../../../../../layout/form/fields'
import { Icon } from '../../../../../../layout/Icon'

describe('src | components | pages | Venue | VenueProvidersManager', () => {
  let props
  let handleChange
  let handleSubmit

  beforeEach(() => {
    handleChange = jest.fn()
    handleSubmit = jest.fn()
    props = {
      handleChange,
      isCreationMode: false,
      isLoadingMode: false,
      isProviderSelected: false,
      providers: [{id: 'AA'}, {id: 'BB'}],
      venueProviders: [{id: 'AA'}, {id: 'BB'}],
      venueIdAtOfferProviderIsRequired: false,
    }
  })

  it('should render an Icon component with a database picto', () => {
    // when
    const wrapper = shallow(VenueProviderForm({...props})(handleSubmit))

    // then
    const icon = wrapper.find(Icon).first()
    expect(icon).toBeDefined()
    expect(icon.prop('svg')).toBe('picto-db-default')
    expect(icon.prop('alt')).toBe('image d\'une base de données')
  })

  it('should render a HiddenField component with the right props', () => {
    // when
    const wrapper = shallow(VenueProviderForm({...props})(handleSubmit))

    // then
    const hiddenField = wrapper.find(HiddenField)
    expect(hiddenField).toBeDefined()
    expect(hiddenField.prop('name')).toBe('id')
  })

  it('should render a Field component as select input with providers as options when provided', () => {
    // when
    const wrapper = shallow(VenueProviderForm({...props})(handleSubmit))

    // then
    const selectField = wrapper.find(Field)
    expect(selectField).toHaveLength(1)
    expect(selectField.prop('name')).toBe('provider')
    expect(selectField.prop('required')).toBe(true)
  })

  it('should render a TextField component not in read only mode when provider is selected, not in loading mode and provider identifier is required', () => {
    // given
    props.isProviderSelected = true
    props.isLoadingMode = false
    props.venueIdAtOfferProviderIsRequired = true

    // when
    const wrapper = shallow(VenueProviderForm({...props})(handleSubmit))

    // then
    const textField = wrapper.find(TextField)
    expect(textField).toHaveLength(1)
    expect(textField.prop('className')).toBe('field-text fs12')
    expect(textField.prop('label')).toBe('Compte : ')
    expect(textField.prop('name')).toBe('venueIdAtOfferProvider')
    expect(textField.prop('readOnly')).toBe(false)
    expect(textField.prop('required')).toBe(true)
  })

  it('should render a TextField component in read only mode when provider is selected, in loading mode and provider identifier is required', () => {
    // given
    props.isProviderSelected = true
    props.isLoadingMode = true
    props.venueIdAtOfferProviderIsRequired = true

    // when
    const wrapper = shallow(VenueProviderForm({...props})(handleSubmit))

    // then
    const textField = wrapper.find(TextField)
    expect(textField).toHaveLength(1)
    expect(textField.prop('className')).toBe('field-text fs12 field-is-read-only')
    expect(textField.prop('label')).toBe('Compte : ')
    expect(textField.prop('name')).toBe('venueIdAtOfferProvider')
    expect(textField.prop('readOnly')).toBe(true)
    expect(textField.prop('required')).toBe(true)
  })

  it('should render a TextField component in read only mode when provider is selected, not loading mode and provider identifier is not required', () => {
    // given
    props.isProviderSelected = true
    props.isLoadingMode = true
    props.venueIdAtOfferProviderIsRequired = false

    // when
    const wrapper = shallow(VenueProviderForm({...props})(handleSubmit))

    // then
    const textField = wrapper.find(TextField)
    expect(textField).toHaveLength(1)
    expect(textField.prop('className')).toBe('field-text fs12 field-is-read-only')
    expect(textField.prop('label')).toBe('Compte : ')
    expect(textField.prop('name')).toBe('venueIdAtOfferProvider')
    expect(textField.prop('readOnly')).toBe(true)
    expect(textField.prop('required')).toBe(true)
  })

  it('should display a tooltip and an Icon component when provider is selected, not in loading mode and provider identifier is required', () => {
    // given
    props.isProviderSelected = true
    props.isLoadingMode = false
    props.venueIdAtOfferProviderIsRequired = true

    // when
    const wrapper = shallow(VenueProviderForm({...props})(handleSubmit))

    // then
    const tooltip = wrapper.find('.tooltip-info')
    expect(tooltip).toHaveLength(1)
    expect(tooltip.prop('className')).toBe('tooltip tooltip-info')
    expect(tooltip.prop('data-place')).toBe('bottom')
    expect(tooltip.prop('data-tip')).toBe('<p>Veuillez saisir un compte.</p>')
    const icon = tooltip.find(Icon)
    expect(icon).toHaveLength(1)
    expect(icon.prop('svg')).toBe('picto-info')
    expect(icon.prop('alt')).toBe('image d\'aide à l\'information')
  })

  it('should not display a tooltip and an Icon component when provider is selected, not in loading mode and provider identifier is not required', () => {
    // given
    props.isProviderSelected = true
    props.isLoadingMode = false
    props.venueIdAtOfferProviderIsRequired = false

    // when
    const wrapper = shallow(VenueProviderForm({...props})(handleSubmit))

    // then
    const tooltip = wrapper.find('.tooltip-info')
    expect(tooltip).toHaveLength(0)
  })

  it('should display an import button when provider is selected, in creation mode and not in loading mode', () => {
    // given
    props.isProviderSelected = true
    props.isCreationMode = true
    props.isLoadingMode = false

    // when
    const wrapper = shallow(VenueProviderForm({...props})(handleSubmit))

    // then
    const importButtonContainer = wrapper.find('.provider-import-button-container')
    expect(importButtonContainer).toHaveLength(1)
    const importButton = importButtonContainer.find('button')
    expect(importButton).toHaveLength(1)
    expect(importButton.prop('className')).toBe('button is-intermediate provider-import-button')
    expect(importButton.prop('type')).toBe('submit')
    expect(importButton.text()).toBe('Importer')
  })

  it('should not display an import button when provider is not selected, not in creation mode and in loading mode', () => {
    // given
    props.isProviderSelected = false
    props.isCreationMode = false
    props.isLoadingMode = true

    // when
    const wrapper = shallow(VenueProviderForm({...props})(handleSubmit))

    // then
    const importButtonContainer = wrapper.find('.provider-import-button-container')
    expect(importButtonContainer).toHaveLength(0)
  })
})
