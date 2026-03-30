import { useNavigate } from 'react-router-dom'
import { useMetricsSocket } from '../hooks/useMetricsSocket'
import MetricCard from '../components/MetricCard'
import LineChart from '../components/LineChart'
import AIChat from '../components/AIChat'

export default function Dashboard() {
  const { history, connected } = useMetricsSocket()
  const navigate = useNavigate()
  const latest = history[history.length - 1]

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold">DevPulse</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-gray-600'}`} />
            <span className="text-xs text-gray-400">{connected ? 'Live' : 'Connecting...'}</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="CPU"
          value={latest ? latest.cpu.toFixed(1) : '--'}
          unit="%"
          color={latest && latest.cpu > 80 ? 'text-red-400' : 'text-blue-400'}
        />
        <MetricCard
          label="Memory"
          value={latest ? latest.memory.toFixed(1) : '--'}
          unit="%"
          color={latest && latest.memory > 75 ? 'text-yellow-400' : 'text-green-400'}
        />
        <MetricCard
          label="API Latency"
          value={latest ? latest.api_latency_ms.toFixed(0) : '--'}
          unit="ms"
          color={latest && latest.api_latency_ms > 300 ? 'text-red-400' : 'text-purple-400'}
        />
        <MetricCard
          label="Error Rate"
          value={latest ? latest.error_rate.toFixed(2) : '--'}
          unit="%"
          color={latest && latest.error_rate > 3 ? 'text-red-400' : 'text-teal-400'}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <LineChart
          data={history}
          dataKey="cpu"
          label="CPU Usage"
          color="#3b82f6"
          unit="%"
          domain={[0, 100]}
        />
        <LineChart
          data={history}
          dataKey="memory"
          label="Memory Usage"
          color="#22c55e"
          unit="%"
          domain={[0, 100]}
        />
        <LineChart
          data={history}
          dataKey="api_latency_ms"
          label="API Latency"
          color="#a855f7"
          unit="ms"
        />
        <LineChart
          data={history}
          dataKey="error_rate"
          label="Error Rate"
          color="#14b8a6"
          unit="%"
        />
      </div>

      {/* AI Chat */}
      <AIChat />
    </div>
  )
}
