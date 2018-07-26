/*
import {
  Field,
  Form,
  Icon,
  showNotification,
  SubmitButton
} from 'pass-culture-shared'
*/
import { requestData } from 'shared/reducers/data'
import { showNotification } from 'shared/reducers/notification'

import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { compose } from 'redux'

import Field from '../layout/Field'
import Form from '../layout/Form'
import Icon from '../layout/Icon'
import SubmitButton from '../layout/SubmitButton'
import MediationManager from '../MediationManager'
import OccurenceManager from '../OccurenceManager'
import PageWrapper from '../layout/PageWrapper'
import { showModal, closeModal } from '../../reducers/modal'
import eventSelector from '../../selectors/event'
import occasionSelector from '../../selectors/occasion'
import occurencesSelector from '../../selectors/occurences'
import offererSelector from '../../selectors/offerer'
import offerersSelector from '../../selectors/offerers'
import providersSelector from '../../selectors/providers'
import searchSelector from '../../selectors/search'
import thingSelector from '../../selectors/thing'
import typesSelector from '../../selectors/types'
import typeSelector from '../../selectors/type'
import venueSelector from '../../selectors/venue'
import venuesSelector from '../../selectors/venues'
import { occasionNormalizer } from '../../utils/normalizers'
import { pluralize } from '../../utils/string'

class OccasionPage extends Component {
  constructor () {
    super()
    this.state = {
      isNew: false,
      isEventType: false,
      isReadOnly: true,
    }
  }

  static getDerivedStateFromProps (nextProps) {
    const {
      location: { search },
      match: { params: { occasionId } },
      occasion,
      type,
    } = nextProps
    const {
      eventId,
      thingId
    } = (occasion || {})

    const isEdit = search.indexOf('modifie') > -1
    const isNew = occasionId === 'nouveau'
    const isEventType = (get(type, 'type') === 'Event') || eventId
    const isReadOnly = !isNew && !isEdit

    const apiPath = isEventType
      ? `events/${eventId || ''}`
      : `things/${thingId || ''}`

    return {
      apiPath,
      isEventType,
      isNew,
      isReadOnly,
    }
  }

  handleDataRequest = (handleSuccess, handleFail) => {
    const {
      match: { params: { occasionId } },
      history,
      occasion,
      offerers,
      providers,
      requestData,
      showModal,
      types,
    } = this.props
    !occasion && occasionId !== 'nouveau' && requestData(
      'GET',
      `occasions/${occasionId}`,
      {
        key: 'occasions',
        normalizer: occasionNormalizer
      }
    )
    offerers.length === 0 && requestData(
      'GET',
      'offerers',
      {
        handleSuccess: (state, action) => {
          if (!get(state, 'data.venues.length')) {
            showModal(
              <div>
                Vous devez avoir déjà enregistré un lieu
                dans une de vos structures pour ajouter des offres
              </div>, {
                onCloseClick: () => history.push('/structures')
              })
          }
        },
        handleFail,
        normalizer: { managedVenues: 'venues' }
      }
    )
    providers.length === 0 && requestData('GET', 'providers')
    types.length === 0 && requestData('GET', 'types')

    handleSuccess()
  }

  handleFail = (state, action) => {
    this.props.showNotification({
      type: 'danger',
      text: 'Un problème est survenu lors de l\'enregistrement',
    })
  }

  handleSuccess = (state, action) => {
    const {
      data,
      method
    } = action
    const {
      history,
      occasion,
      showNotification,
      venue
    } = this.props
    const {
      isEventType
    } = this.state

    showNotification({
      text: 'Votre offre a bien été enregistrée',
      type: 'success'
    })

    // PATCH
    if (method === 'PATCH') {
      history.push(`/offres/${occasion.id}`)
      return
    }

    // POST
    if (isEventType && method === 'POST') {
      const { occasions } = (data || {})
      const occasion = occasions && occasions.find(o =>
        o.venueId === get(venue, 'id'))
      if (!occasion) {
        console.warn("Something wrong with returned data, we should retrieve the created occasion here")
        return
      }
      history.push(`/offres/${occasion.id}?gestion`)
    }
  }

  handleShowOccurencesModal = () => {
    const {
      location: {search},
      showModal
    } = this.props
    search.indexOf('gestion') > -1 ? showModal(
      <OccurenceManager />, {
        isUnclosable: true
    }) : closeModal()
  }

  componentDidMount() {
    this.handleShowOccurencesModal()
  }

  componentDidUpdate (prevProps) {
    const {
      location: { pathname, search },
      occasion,
      occurences,
    } = this.props

    if (search.indexOf('gestion') > -1) {
      if (
        prevProps.occasion !== occasion ||
        prevProps.occurences !== occurences ||
        prevProps.location.pathname !== pathname ||
        prevProps.location.search !== search
      ) {
        this.handleShowOccurencesModal()
      }
    }
  }

  render () {
    const {
      event,
      location: { search },
      occasion,
      occurences,
      offerer,
      offerers,
      thing,
      type,
      types,
      user,
      venue,
      venues
    } = this.props
    const {
      apiPath,
      isNew,
      isReadOnly,
      isEventType,
    } = this.state

    const showAllForm = type || !isNew

    const formData = Object.assign(
      { offererId: get(venue, 'managingOffererId') },
      isEventType ? event : thing
    )

    return (
      <PageWrapper
        backTo={{path: `/offres${search}`, label: 'Vos offres'}}
        name='offer'
        handleDataRequest={this.handleDataRequest}>
        <div className='section'>
          <h1 className='pc-title'>
            { isNew ? "Ajouter une offre" : "Détails de l'offre" }
          </h1>
          <p className='subtitle'>
            Renseignez les détails de cette offre et mettez-la en avant en ajoutant une ou plusieurs accorches.
          </p>
          <Form
            action={apiPath}
            data={Object.assign(
              {
                offererId: get(venue, 'managingOffererId'),
                venueId: get(venue, 'id')
              },
              isEventType ? event : thing
            )}
            name='occasion'
            handleSuccess={this.handleSuccess}
            handleFail={this.handleFail}
            readOnly={isReadOnly}
          >
            <div className='field-group'>
              <Field name='name' label="Titre de l'offre" required isExpanded/>
              <Field
                type='select'
                label='Type'
                name='type'
                optionLabel='label'
                optionValue='value'
                options={types}
                placeholder="Sélectionnez un type d'offre"
                required
              />
            </div>
            {
              !isNew && (
                <div className='field'>
                  {
                    event && (
                      <div className='field form-field is-horizontal'>
                        <div className='field-label'>
                          <label className="label" htmlFor="input_occasions_name">
                            <div className="subtitle">Dates :</div>
                          </label>
                        </div>
                        <div className='field-body'>
                          <div className='field'>
                            <div className='nb-dates'>
                              {pluralize(get(occurences, 'length'), 'date')}
                            </div>
                            <NavLink
                              className='button is-primary is-outlined is-small'
                              to={`/offres/${get(occasion, 'id')}?gestion`}>
                              <span className='icon'><Icon svg='ico-calendar' /></span>
                              <span>Gérer les dates et les prix</span>
                            </NavLink>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  <MediationManager />
                </div>
              )
            }
            {
              showAllForm && (
                <div>
                  <h2 className='pc-list-title'>
                    Infos pratiques
                  </h2>
                  <div className='field-group'>
                    <Field
                      debug
                      label='Structure'
                      name='offererId'
                      options={offerers}
                      placeholder="Sélectionnez une structure"
                      required
                      type='select' />
                    {
                      offerer && get(venues, 'length') === 0
                        ? (
                          <div className='field is-horizontal'>
                            <div className='field-label'></div>
                            <div className='field-body'>
                              <p className='help is-danger'>
                                Il faut obligatoirement une structure avec un lieu.
                              </p>
                            </div>
                          </div>
                        )
                        : get(venues, 'length') > 0 && (
                          <Field
                            label='Lieu'
                            name='venueId'
                            options={venues}
                            placeholder='Sélectionnez un lieu'
                            required
                            type='select' />
                        )
                    }
                    { get(user, 'isAdmin') && (
                      <Field
                        type='checkbox'
                        label='Offre à rayonnement national'
                        name='isNational'
                      />
                    )}
                    { isEventType && (
                      <Field type='number' name='durationMinutes' label='Durée en minutes' required />
                    )}
                  </div>
                  <h2 className='pc-list-title'>Infos artistiques</h2>
                  <div className='field-group'>
                    <Field type='textarea' name='description' label='Description' maxLength={750} required isExpanded />
                    <Field name='author' label='Auteur' isExpanded/>
                    {
                      isEventType && [
                        <Field key={0} name='stageDirector' label='Metteur en scène' isExpanded />,
                        <Field key={1} name='performer' label='Interprète' isExpanded />
                      ]
                    }
                  </div>
                </div>
              )
            }

            <hr />
            <div className="field is-grouped is-grouped-centered" style={{justifyContent: 'space-between'}}>
              <div className="control">
                {
                  isReadOnly
                    ? (
                      <NavLink to={`/offres/${get(occasion, 'id')}?modifie`}
                        className='button is-secondary is-medium'>
                        Modifier l'offre
                      </NavLink>
                    )
                    : (
                      <NavLink
                        className="button is-secondary is-medium"
                        to={isNew ? '/offres' : `/offres/${get(occasion, 'id')}`}>
                        Annuler
                      </NavLink>
                    )
                }
              </div>
              <div className="control">
                {
                  isReadOnly
                  ? (
                    <NavLink to='/offres' className='button is-primary is-medium'>
                      Terminer
                    </NavLink>
                  )
                  : (
                    <SubmitButton className="button is-primary is-medium">
                      Enregistrer
                    </SubmitButton>
                  )
                }
              </div>
            </div>
          </Form>
        </div>
      </PageWrapper>
    )
  }
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => {
      const search = searchSelector(state, ownProps.location.search)

      const providers = providersSelector(state)

      const occasion = occasionSelector(state, ownProps.match.params.occasionId)

      const eventId = get(occasion, 'eventId')
      const event = eventSelector(state, eventId)

      const thingId = get(occasion, 'thingId')
      const thing = thingSelector(state, thingId)

      const types = typesSelector(state)

      const typeValue = get(state, 'form.occasion.data.type') || get(event, 'type') || get(thing, 'type')

      const type = typeSelector(state, typeValue)

      let offererId = get(state, 'form.occasion.data.offererId') || search.offererId

      const venues = venuesSelector(state, offererId)
      const venueId = get(state, 'form.occasion.data.venueId') || search.venueId || get(event, 'venueId') || get(thing, 'venueId')
      const venue = venueSelector(state, venueId)

      offererId = offererId || get(venue, 'managingOffererId')

      const offerers = offerersSelector(state)
      const offerer = offererSelector(state, offererId)

      const occurences = occurencesSelector(state, venueId, eventId)

      const user = state.user

      return {
        search,
        providers,
        event,
        thing,
        occasion,
        occurences,
        venues,
        venue,
        offerers,
        offerer,
        types,
        type,
        user,
      }
    },
    {
      showModal,
      closeModal,
      requestData,
      showNotification,
    }
  )
)(OccasionPage)
