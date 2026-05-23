import { VIEW_MODES, isCalendarMode } from '../../src/domain/viewModes.js'

describe('VIEW_MODES', () => {
  it('has CALENDAR constant', () => {
    expect(VIEW_MODES.CALENDAR).toBe('__calendar__')
  })

  it('isCalendarMode returns true for calendar value', () => {
    expect(isCalendarMode(VIEW_MODES.CALENDAR)).toBe(true)
  })

  it('isCalendarMode returns false for null', () => {
    expect(isCalendarMode(null)).toBe(false)
  })

  it('isCalendarMode returns false for a category id', () => {
    expect(isCalendarMode(1)).toBe(false)
  })
})
