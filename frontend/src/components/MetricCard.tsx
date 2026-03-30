interface Props {
  label: string
  value: string
  unit?: string
  alert?: boolean
  warning?: boolean
}

export default function MetricCard({ label, value, unit, alert, warning }: Props) {
  const valueColor = alert ? 'var(--red)' : warning ? 'var(--amber)' : 'var(--accent)'

  return (
    <div style={{
      background: 'var(--surface)',
      padding: '20px 24px 22px',
    }}>
      <div style={{
        fontSize: 9,
        letterSpacing: '0.2em',
        color: 'var(--muted)',
        textTransform: 'uppercase',
        marginBottom: 14,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 34,
        fontWeight: 700,
        color: valueColor,
        lineHeight: 1,
        letterSpacing: '-0.03em',
        transition: 'color 0.3s',
      }}>
        {value}
        {unit && (
          <span style={{
            fontSize: 13,
            fontWeight: 400,
            color: 'var(--muted)',
            marginLeft: 5,
            letterSpacing: '0.05em',
          }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}
