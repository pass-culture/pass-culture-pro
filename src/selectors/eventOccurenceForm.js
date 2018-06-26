import get from 'lodash.get'
import { createSelector } from 'reselect'

import { NEW } from '../utils/config'

export default createSelector(
  state => get(state, 'form.eventOccurencesById'),
  (state, ownProps) => ownProps.isNew,
  (state, ownProps) => get(ownProps, 'occurence.id'),
  (state, ownProps) => get(ownProps, 'occasion.occurences'),
  (eventOccurencesById, isNew, occurenceId, occurences) => {

    const eventOccurenceIdOrNew = isNew
      ? NEW
      : occurenceId

    const eventOccurenceForm = get(eventOccurencesById,
      eventOccurenceIdOrNew)

    const {
      date,
      time
    } = (eventOccurenceForm || {})

    if (!time || !date) {
      return
    }

    const [hours, minutes] = time.split(':')
    const beginningDatetime = date.clone().hour(hours).minute(minutes)

    const alreadySelectedDate = occurences && occurences.find(o =>
      o.beginningDatetimeMoment.isSame(beginningDatetime))

    if (alreadySelectedDate) {
      console.log('BEEEE')
    }

    return {
      beginningDatetime,
      eventOccurenceIdOrNew
    }
  }
)
