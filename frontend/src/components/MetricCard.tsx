interface Props {
  label: string
  value: string
  unit?: string
  color?: string
}

export default function MetricCard({ label, value, unit, color = 'text-blue-400' }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>
        {value}
        {unit && <span className="text-lg font-normal text-gray-400 ml-1">{unit}</span>}
      </p>
    </div>
  )
}
