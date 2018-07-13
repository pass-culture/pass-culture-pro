import get from 'lodash.get'
import { requestData } from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { compose } from 'redux'
import { withRouter } from 'react-router'

import VenueItem from '../VenueItem'
import PageWrapper from '../layout/PageWrapper'
import { closeNotification, showNotification } from '../../reducers/notification'
import { resetForm } from '../../reducers/form'
import offererSelector from '../../selectors/offerer'
import venuesSelector from '../../selectors/venues'
import { NEW } from '../../utils/config'
import { offererNormalizer } from '../../utils/normalizers'

import Form from '../layout/Form'
import Field from '../layout/Field'
import Submit from '../layout/Submit'


class OffererPage extends Component {

  constructor () {
    super()
    this.state = {
      isNew: false
    }
  }

  static getDerivedStateFromProps (nextProps) {
    const {
      offerer,
      match: { params },
    } = nextProps
    const offererId = get(offerer, 'id')
    const isNew = params.offererId === 'nouveau'
    const method = isNew ? 'POST' : 'PATCH'
    return {
      apiPath: isNew ? `offerers/` : `offerers/${offererId}`,
      isNew,
      method,
      offererIdOrNew: isNew ? NEW : offererId
    }
  }



  handleDataRequest = (handleSuccess, handleFail) => {
    const {
      match: { params: { offererId } },
      requestData,
    } = this.props
    const { isNew } = this.state
    if (!isNew) {
      requestData(
        'GET',
        `offerers/${offererId}`,
        {
          handleSuccess,
          handleFail,
          key: 'offerers',
          normalizer: offererNormalizer
        }
      )
      return
    }
    // prevent loading
    handleSuccess()
  }

  handleSuccess = () => {
    const {
      history,
      showNotification
    } = this.props
    history.push('/structures')
    showNotification({
      text: 'Votre structure a bien été enregistrée, elle est en cours de validation.',
      type: 'success'
    })
  }

  onAddProviderClick = () => {
    this.setState({ isNewProvider: true })
  }

  componentWillUnmount() {
    this.props.resetForm()
  }


  render () {
    const {
      offerer,
      venues,
      fetchedName,
    } = this.props

    const {
      isNew,
    } = this.state
    return (
      <PageWrapper
        backTo={{label: 'Vos structures', path: '/structures'}}
        name='offerer'
        handleDataRequest={this.handleDataRequest}
      >
        <div className='section hero'>
          <h2 className='subtitle has-text-weight-bold'>
            {get(offerer, 'name')}
          </h2>
          <h1 className="pc-title">Structure</h1>
          <p className="subtitle">
            Détails de la structure rattachée, des lieux et des fournisseurs de ses offres.
          </p>
        </div>

        <Form name='offerer' className='section'
          action={`/offerers/${isNew ? '' : get(offerer, 'id')}`}
          data={offerer}
          handleSuccess={this.handleSuccess} >
          <div className='field-group'>
            <Field name='siren' label='SIREN' required readOnly={!isNew} />
            {
              (get(offerer, 'name') || fetchedName) && [
                <Field key={0}  label='Désignation' name='name' required readOnly isExpanded/>,
                <Field key={1} label='Siège social' name='address' required readOnly isExpanded/>
              ]
            }
          </div>

          {isNew ? (
            <div>
              <hr />
              <div className="field is-grouped is-grouped-centered" style={{justifyContent: 'space-between'}}>
                <div className="control">
                  <NavLink
                    className="button is-secondary is-medium"
                    to='/structures' >
                    Retour
                  </NavLink>
                </div>
                <div className="control">
                  <Submit className="button is-primary is-medium">Valider</Submit>
                </div>
              </div>
            </div>
          ) : (
            <div className='section'>
              <h2 className='pc-list-title'>
                LIEUX
              </h2>
              <ul className='pc-list venues-list'>
                { venues.map(v => <VenueItem key={v.id} venue={v} />) }
              </ul>
              <div className='has-text-centered'>
                <NavLink to={`/structures/${get(offerer, 'id')}/lieux/nouveau`}
                  className="button is-secondary is-outlined">
                  + Ajouter un lieu
                </NavLink>
              </div>
            </div>
          )}
        </Form>

    </PageWrapper>
    )
  }
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => {
      const offererId = ownProps.match.params.offererId
      return {
        offerer: offererSelector(state, offererId),
        venues: venuesSelector(state, offererId),
        user: state.user,
        fetchedName: get(state, 'form.offerer.data.name'),
      }
    },
    {
      closeNotification,
      requestData,
      resetForm,
      showNotification
    }
  )
)(OffererPage)
