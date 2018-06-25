import moment from 'moment'

export function addIsNewAttribute(object, comparedTo) {
    if (typeof object === 'object' && object.dateCreatedAt && moment(object.dateCreatedAt).isAfter(moment(comparedTo))) {
      return Object.assign({}, object, {isNew: true})
    }
    return object
}

export function dataWithIsNew(data, comparedTo) {
  return Array.isArray(data) ?
    data.map(el => addIsNewAttribute(el, comparedTo)) : (
      typeof data === 'object' ? addIsNewAttribute(data) : data
    )
}