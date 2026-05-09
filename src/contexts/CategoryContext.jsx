import { createContext, useContext } from 'react'
import { useCategories } from '../hooks/index.js'

const CategoryContext = createContext(null)

export function CategoryProvider({ profileId, children }) {
  const categories = useCategories(profileId)

  return (
    <CategoryContext.Provider value={{ categories, profileId }}>
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategoryCache() {
  const ctx = useContext(CategoryContext)
  if (!ctx) {
    throw new Error('useCategoryCache must be used within CategoryProvider')
  }
  return ctx.categories || []
}
