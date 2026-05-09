import { useSettings } from '../../hooks/index.js'
import SearchEnricher from './SearchEnricher.jsx'
import { movieAdapter } from './adapters/movieAdapter.jsx'

export default function WatchEnricher({ profileId, value, onChange }) {
  const settings = useSettings(profileId)

  return (
    <SearchEnricher
      adapter={movieAdapter}
      value={value}
      onChange={onChange}
      config={{ tmdbApiKey: settings?.tmdbApiKey, omdbApiKey: settings?.omdbApiKey }}
    />
  )
}
