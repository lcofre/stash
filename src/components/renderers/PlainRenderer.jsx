export default function PlainRenderer({ todo }) {
  return (
    <p style={{
      fontFamily: 'var(--font-ui)', fontSize: '16px', fontWeight: 500,
      color: todo.done ? 'var(--text-3)' : 'var(--text)',
      lineHeight: 1.4,
      textDecoration: todo.done ? 'line-through' : 'none',
    }}>
      {todo.title}
    </p>
  )
}
