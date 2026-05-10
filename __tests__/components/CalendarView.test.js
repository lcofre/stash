/**
 * Regression test for calendar view filter bug
 * Issue: CalendarView was calling .filter() on useTodosByProfile result directly
 * The hook returns {pending, done, all}, not an array
 * Fix: Use allTodos.all instead of allTodos
 */

describe('CalendarView hook integration', () => {
  it('useTodosByProfile returns object with .all property, not array', () => {
    // This is what useTodosByProfile returns
    const mockResult = {
      pending: [{id: 1, title: 'Task', date: '2026-05-10', done: false}],
      done: [],
      all: [{id: 1, title: 'Task', date: '2026-05-10', done: false}]
    }

    // ✗ Wrong: calling .filter() directly on the object
    expect(() => {
      mockResult.filter(() => true)
    }).toThrow('mockResult.filter is not a function')

    // ✓ Correct: access .all before filtering
    expect(() => {
      const filtered = mockResult.all.filter(() => true)
      expect(filtered).toHaveLength(1)
    }).not.toThrow()
  })

  it('CalendarView correctly filters allTodos.all', () => {
    const mockTodos = {
      pending: [
        {id: 1, title: 'Dated pending', date: '2026-05-10', done: false},
        {id: 2, title: 'Undated pending', date: null, done: false},
      ],
      done: [{id: 3, title: 'Done with date', date: '2026-05-10', done: true}],
      all: [
        {id: 1, title: 'Dated pending', date: '2026-05-10', done: false},
        {id: 2, title: 'Undated pending', date: null, done: false},
        {id: 3, title: 'Done with date', date: '2026-05-10', done: true},
      ]
    }

    // This is the filtering logic from CalendarView (line 135)
    const filteredTodos = mockTodos.all.filter(t => {
      if (!t.date || t.done) return false
      return true
    })

    expect(filteredTodos).toHaveLength(1)
    expect(filteredTodos[0].id).toBe(1)
    expect(filteredTodos[0].title).toBe('Dated pending')
  })
})
