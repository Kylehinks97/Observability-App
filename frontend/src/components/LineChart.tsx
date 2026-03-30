import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Metric } from '../hooks/useMetricsSocket'

interface Props {
  data: Metric[]
  dataKey: keyof Metric
  label: string
  color?: string
  unit?: string
  domain?: [number, number]
}

function CustomTooltip({ active, payload, label, unit, color }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      padding: '8px 12px',
      fontSize: 11,
      fontFamily: 'JetBrains Mono, monospace',
    }}>
      <div style={{ color: 'var(--muted)', marginBottom: 4, letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ color: color, fontWeight: 600 }}>
        {typeof payload[0].value === 'number'
          ? payload[0].value.toFixed(2)
          : payload[0].value}
        {unit && <span style={{ color: 'var(--muted)', fontWeight: 400, marginLeft: 3 }}>{unit}</span>}
      </div>
    </div>
  )
}

export default function LineChart({ data, dataKey, label, color = 'var(--accent)', unit, domain }: Props) {
  const formatted = data.map(d => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  }))

  return (
    <div style={{ background: 'var(--surface)', padding: '20px 16px 16px 8px' }}>
      <div style={{
        fontSize: 9,
        letterSpacing: '0.2em',
        color: 'var(--muted)',
        textTransform: 'uppercase',
        marginBottom: 16,
        paddingLeft: 16,
      }}>
        <span style={{ color, marginRight: 6 }}>—</span>
        {label}
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <RechartsLine data={formatted}>
          <XAxis
            dataKey="time"
            tick={{ fontSize: 9, fill: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}
            interval="preserveStartEnd"
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />
          <YAxis
            domain={domain ?? ['auto', 'auto']}
            tick={{ fontSize: 9, fill: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={false}
            tickLine={false}
            width={42}
            unit={unit}
          />
          <Tooltip content={<CustomTooltip unit={unit} color={color} />} />
          {domain && (
            <ReferenceLine
              y={domain[1] * 0.8}
              stroke="var(--border)"
              strokeDasharray="2 4"
            />
          )}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  )
}
