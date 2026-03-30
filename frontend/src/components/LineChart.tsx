import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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

export default function LineChart({ data, dataKey, label, color = '#3b82f6', unit, domain }: Props) {
  const formatted = data.map(d => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString(),
  }))

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-sm text-gray-400 mb-4">{label}</p>
      <ResponsiveContainer width="100%" height={180}>
        <RechartsLine data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#6b7280' }} interval="preserveStartEnd" />
          <YAxis
            domain={domain}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            unit={unit}
            width={45}
          />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#9ca3af' }}
            itemStyle={{ color }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  )
}
