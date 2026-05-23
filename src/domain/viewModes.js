export const VIEW_MODES = {
  CALENDAR: '__calendar__',
}

export function isCalendarMode(categoryId) {
  return categoryId === VIEW_MODES.CALENDAR
}
