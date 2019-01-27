export function getElementIdFromName(name) {
  if (name) {
    return name.toLowerCase().replace(/\s/g, '-')
  }
  return ''
}
