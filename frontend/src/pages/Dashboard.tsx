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
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Header */}
      <header style={{
        height: 48,
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        background: 'var(--bg)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{
            fontSize: 10,
            letterSpacing: '0.28em',
            color: 'var(--accent)',
            textTransform: 'uppercase',
          }}>
            DevPulse
          </span>
          <span style={{ width: 1, height: 14, background: 'var(--border)', display: 'block' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span
              className="live-dot"
              style={{
                display: 'block',
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: connected ? 'var(--accent)' : 'var(--muted)',
              }}
            />
            <span style={{
              fontSize: 10,
              letterSpacing: '0.12em',
              color: connected ? 'var(--accent)' : 'var(--muted)',
            }}>
              {connected ? 'live' : 'connecting...'}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            fontSize: 10,
            letterSpacing: '0.12em',
            cursor: 'pointer',
            fontFamily: 'inherit',
            padding: 0,
          }}
        >
          sign out
        </button>
      </header>

      <main style={{ padding: '20px 24px', maxWidth: 1400, margin: '0 auto' }}>

        {/* Stat cards — 1px gaps act as borders */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          background: 'var(--border)',
          marginBottom: '1px',
        }}>
          <MetricCard
            label="cpu"
            value={latest ? latest.cpu.toFixed(1) : '--'}
            unit="%"
            alert={!!(latest && latest.cpu > 80)}
          />
          <MetricCard
            label="memory"
            value={latest ? latest.memory.toFixed(1) : '--'}
            unit="%"
            warning={!!(latest && latest.memory > 75)}
          />
          <MetricCard
            label="api latency"
            value={latest ? latest.api_latency_ms.toFixed(0) : '--'}
            unit="ms"
            alert={!!(latest && latest.api_latency_ms > 300)}
          />
          <MetricCard
            label="error rate"
            value={latest ? latest.error_rate.toFixed(2) : '--'}
            unit="%"
            alert={!!(latest && latest.error_rate > 3)}
          />
        </div>

        {/* Charts — same 1px grid technique */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1px',
          background: 'var(--border)',
          marginBottom: 24,
        }}>
          <LineChart
            data={history}
            dataKey="cpu"
            label="cpu usage"
            color="var(--accent)"
            unit="%"
            domain={[0, 100]}
          />
          <LineChart
            data={history}
            dataKey="memory"
            label="memory usage"
            color="var(--purple)"
            unit="%"
            domain={[0, 100]}
          />
          <LineChart
            data={history}
            dataKey="api_latency_ms"
            label="api latency"
            color="var(--amber)"
            unit="ms"
          />
          <LineChart
            data={history}
            dataKey="error_rate"
            label="error rate"
            color="var(--red)"
            unit="%"
          />
        </div>

        <AIChat />

      </main>
    </div>
  )
}
