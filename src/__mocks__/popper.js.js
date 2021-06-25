/**
 * This resolve a warning raise by react-popper that is used in react-date-picker
 * see: https://github.com/popperjs/react-popper/issues/263
 */

const PopperJS = jest.requireActual('popper.js')

export default class {
  static placements = PopperJS.placements

  constructor() {
    return {
      destroy: () => {},
      scheduleUpdate: () => {},
    }
  }
}
