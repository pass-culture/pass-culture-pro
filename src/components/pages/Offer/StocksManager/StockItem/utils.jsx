import moment from 'moment'

export const FLOATSEP = ','

export function getDisplayedPrice(value, readOnly) {
  if (value === 0) {
    if (readOnly) {
      return 'Gratuit'
    }
    return 0
  }
  if (readOnly) {
    let floatValue = value
    if (value && String(value).includes(FLOATSEP)) {
      floatValue = parseFloat(value.replace(/,/, '.')).toFixed(2)
    }
    let floatValueString = `${floatValue} €`
    if (FLOATSEP === ',') {
      floatValueString = floatValueString.replace('.', ',')
    }
    return floatValueString
  }

  if (value === ' ') {
    return 0
  }

  return value
}

export function getDatetimeOneDayAfter(datetime) {
  return moment(datetime)
    .add(1, 'day')
    .toISOString()
}

export function getDatetimeTwoDaysBefore(datetime) {
  return moment(datetime)
    .subtract(2, 'day')
    .toISOString()
}
