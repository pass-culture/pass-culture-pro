import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { OffererClass } from './OffererClass'
import HeroSection from '../../layout/HeroSection/HeroSection'
import Main from '../../layout/Main'
import { Form } from 'react-final-form'
import Siren from './Siren/Siren'
import Name from './Name'
import Address from './Address'
import createDecorator from "final-form-calculate"
import { bindAddressAndDesignationFromSiren } from "./decorators/bindSirenFieldToDesignation"
import PostalCode from "./PostalCode"
import City from "./City"
import Venues from "./Venues/Venues"

class OffererDetails extends PureComponent {


  componentDidMount() {
    const { getOfferer } = this.props
    getOfferer()
  }

  handleSubmit = (values) => {
    const { createNewOfferer } = this.props
    createNewOfferer(values, this.onHandleFail)
  }

  onHandleDataRequest = (handleSuccess, handleFail) => {
    const { getOfferer, getUserOfferers, query } = this.props
    const { isCreatedEntity } = query.context()

    if (!isCreatedEntity) {
      getOfferer(handleFail, handleSuccess)
      getUserOfferers()
      return
    }
    handleSuccess()
  }

  onHandleFail = () => {
    const { showNotification } = this.props
    showNotification('Vous étes déjà rattaché à cette structure.', 'danger')
  }

  onRender = ({ handleSubmit }) => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="section">
          <div className="field-group">
            <Siren />
            <Name />
            <Address />
            <PostalCode />
            <City />
          </div>
        </div>
      </form>
    )
  }

  createDecorators = () => {
    const addressAndDesignationFromSirenDecorator = createDecorator({
      field: 'siren',
      updates: bindAddressAndDesignationFromSiren,
    })

    return [ addressAndDesignationFromSirenDecorator ]
  }

  render() {
    const { offerer, venues } = this.props

    return (
      <Main
        backTo={{ label: 'Vos structures juridiques', path: '/structures' }}
        name="offerer"
      >
        <HeroSection
          subtitle={offerer.name}
          title="Structure"
        >
          <p className="subtitle">
            {'Détails de la structure rattachée, des lieux et des fournisseurs de ses offres.'}
          </p>
        </HeroSection>

        <Form
          decorators={this.createDecorators()}
          initialValues={offerer}
          onSubmit={this.handleSubmit}
          render={this.onRender}
        />

        <Venues
          offererId={offerer.id}
          venues={venues}
        />
      </Main>
    )
  }
}

OffererDetails.propTypes = {
  createNewOfferer: PropTypes.func.isRequired,
  getOfferer: PropTypes.func.isRequired,
  getUserOfferers: PropTypes.func.isRequired,
  offerer: PropTypes.instanceOf(OffererClass).isRequired,
  query: PropTypes.shape().isRequired,
  showNotification: PropTypes.func.isRequired,
}

export default OffererDetails
