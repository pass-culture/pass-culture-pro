import moment from 'moment'

export function collectionWithIsNew(collection, comparedTo) {
  return [].concat(collection).map(el => {
    if (typeof el === 'object' && el.dateCreatedAt && moment(el.dateCreatedAt).isAfter(moment(comparedTo))) {
      return Object.assign({}, el, {isNew: true})
    }
    return el
  })
}