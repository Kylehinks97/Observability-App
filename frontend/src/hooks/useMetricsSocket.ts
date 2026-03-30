import { useEffect, useState, useRef } from 'react'

export interface Metric {
  timestamp: string
  cpu: number
  memory: number
  api_latency_ms: number
  error_rate: number
}

const MAX_POINTS = 60

export function useMetricsSocket() {
  const [history, setHistory] = useState<Metric[]>([])
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/metrics')
    wsRef.current = ws

    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)

    ws.onmessage = (event: MessageEvent) => {
      const metric: Metric = JSON.parse(event.data)
      setHistory(prev => [...prev.slice(-(MAX_POINTS - 1)), metric])
    }

    return () => ws.close()
  }, [])

  return { history, connected }
}
