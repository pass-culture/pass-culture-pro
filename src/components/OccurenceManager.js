import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router'

import OccurenceForm from './OccurenceForm'
import OccurenceItem from './OccurenceItem'
import { mergeForm } from '../reducers/form'
import selectCurrentMediation from '../selectors/currentMediation'
import selectCurrentOccurences from '../selectors/currentOccurences'
import { NEW } from '../utils/config'

class OccurenceManager extends Component {
  constructor () {
    super()
    this.state = {
      isAdding: false
    }
  }

  onAddClick = () => {
    this.setState({ isAdding: true })
  }

  render() {
    const { currentOccurences } = this.props
    const { isAdding } = this.state
    return (
      <div>
        <table className='table is-striped is-hoverable'>
          <thead>
            <tr>
              <td>Date</td>
              <td>Heure</td>
              <td>Prix</td>
              <td>Nombre de place total</td>
              <td>Nombre de place Personnes à Mobilité Réduite (PMR)</td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {
              currentOccurences && currentOccurences.map(o =>
                <OccurenceItem key={o.id} occurence={o} />
              )
            }
            {
              isAdding && <OccurenceForm
                onDeleteClick={e => this.setState({isAdding: false})}
                {...this.props} isNew
              />
            }
          </tbody>
        </table>
        {
          !isAdding && (
            <button className='button is-secondary' onClick={this.onAddClick}>
              + Ajouter un horaire
            </button>
          )
        }
      </div>
    )
  }
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => ({
      currentOccurences: selectCurrentOccurences(state, ownProps),
      currentMediation: selectCurrentMediation(state, ownProps)
    })
  )
)(OccurenceManager)
