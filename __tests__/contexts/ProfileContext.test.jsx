import { render, screen } from '@testing-library/react'
import { ProfileProvider, useProfileId } from '../../src/contexts/ProfileContext.jsx'

function TestConsumer() {
  const profileId = useProfileId()
  return <div data-testid="profile-id">{profileId}</div>
}

describe('ProfileContext', () => {
  it('provides profileId to consumers', () => {
    render(
      <ProfileProvider profileId={42}>
        <TestConsumer />
      </ProfileProvider>
    )
    expect(screen.getByTestId('profile-id')).toHaveTextContent('42')
  })

  it('returns null when no provider', () => {
    render(<TestConsumer />)
    expect(screen.getByTestId('profile-id')).toBeEmptyDOMElement()
  })
})
