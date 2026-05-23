import { createContext, useContext } from 'react'

const ProfileContext = createContext(null)

export function ProfileProvider({ profileId, children }) {
  return (
    <ProfileContext.Provider value={profileId}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileId() {
  return useContext(ProfileContext)
}
