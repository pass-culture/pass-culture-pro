import getDurationInHours, { getDurationInMinutes } from '../duration'

describe('src | components | pages | Offer | utils | getDurationInHours', () => {
  it('should return correct hour when minutes are equal to 60', () => {
    // given
    const durationInMinutes = 60

    // when
    const value = getDurationInHours(durationInMinutes)
    const expected = '01:00'

    // then
    expect(value).toEqual(expected)
  })
  it('should return correct hour when minutes are below 60', () => {
    // given
    const durationInMinutes = 56

    // when
    const value = getDurationInHours(durationInMinutes)
    const expected = '00:56'

    // then
    expect(value).toEqual(expected)
  })
  it('should return correct hour when minutes are above 60', () => {
    // given
    const durationInMinutes = 899

    // when
    const value = getDurationInHours(durationInMinutes)
    const expected = '14:59'

    // then
    expect(value).toEqual(expected)
  })
})

describe('src | components | pages | Offer | utils | getDurationInMinutes', () => {
  it('should return correct hour when hour is equal to 1', () => {
    // given
    const durationInHours = '01:00'

    // when
    const value = getDurationInMinutes(durationInHours)
    const expected = 60

    // then
    expect(value).toEqual(expected)
  })
  it('should return correct hour when hour is below 1', () => {
    // given
    const durationInHours = '00:00'

    // when
    const value = getDurationInMinutes(durationInHours)
    const expected = 0

    // then
    expect(value).toEqual(expected)
  })
  it('should return correct hour when hour is above 1', () => {
    // given
    const durationInHours = '11:59'

    // when
    const value = getDurationInMinutes(durationInHours)
    const expected = 719

    // then
    expect(value).toEqual(expected)
  })
})
