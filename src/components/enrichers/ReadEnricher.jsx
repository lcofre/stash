import SearchEnricher from './SearchEnricher.jsx'
import { bookAdapter } from './adapters/bookAdapter.jsx'

export default function ReadEnricher({ value, onChange }) {
  return (
    <SearchEnricher
      adapter={bookAdapter}
      value={value}
      onChange={onChange}
    />
  )
}
