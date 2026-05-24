import { useState, useEffect } from 'react'
import { validateMetadata } from '../domain/categoryTypes.js'

// Unified form state management for add and edit flows in TodoFormModal.
export function useTodoForm(initialTodo = null) {
  const [form, setForm] = useState({
    title: '',
    notes: '',
    date: '',
    url: '',
    categoryId: null,
    metadata: null,
  })

  // Initialize form with todo data (for edit mode)
  useEffect(() => {
    if (initialTodo) {
      const dateStr = initialTodo.date
        ? new Date(initialTodo.date).toISOString().split('T')[0]
        : ''
      setForm({
        title: initialTodo.title || '',
        notes: initialTodo.notes || '',
        date: dateStr,
        url: initialTodo.url || '',
        categoryId: initialTodo.categoryId || null,
        metadata: initialTodo.metadata || null,
      })
    }
  }, [initialTodo?.id]) // Only reinitialize if todo ID changes

  // Update a single form field
  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // Change category ID and clear metadata (different type = incompatible metadata)
  const changeCategoryId = (newCategoryId) => {
    setForm(prev => ({
      ...prev,
      categoryId: newCategoryId,
      metadata: null, // Clear metadata when type changes
    }))
  }

  // Reset form to initial state
  const reset = () => {
    if (initialTodo) {
      const dateStr = initialTodo.date
        ? new Date(initialTodo.date).toISOString().split('T')[0]
        : ''
      setForm({
        title: initialTodo.title || '',
        notes: initialTodo.notes || '',
        date: dateStr,
        url: initialTodo.url || '',
        categoryId: initialTodo.categoryId || null,
        metadata: initialTodo.metadata || null,
      })
    } else {
      setForm({
        title: '',
        notes: '',
        date: '',
        url: '',
        categoryId: null,
        metadata: null,
      })
    }
  }

  // Validate metadata against category type schema
  const validateForm = (categoryType) => {
    const validation = validateMetadata(form.metadata, categoryType)
    return validation
  }

  return {
    form,
    updateField,
    changeCategoryId,
    reset,
    validateForm,
  }
}
