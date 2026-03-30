import { useState, FormEvent, useRef, useEffect } from 'react'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'ready. ask about your infrastructure metrics.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    const question = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: question }])
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.post(
        '/ai/ask',
        { question },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'error: failed to get response.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
    }}>
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '11px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <span style={{
          fontSize: 9,
          letterSpacing: '0.2em',
          color: 'var(--muted)',
          textTransform: 'uppercase',
        }}>
          ai assistant
        </span>
        <span style={{ fontSize: 11, color: 'var(--border)' }}>|</span>
        <span style={{ fontSize: 10, color: 'var(--muted)' }}>
          claude · 60s context window
        </span>
      </div>

      <div style={{ height: 260, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{
              fontSize: 11,
              color: m.role === 'user' ? 'var(--accent)' : 'var(--muted)',
              flexShrink: 0,
              marginTop: 1,
              userSelect: 'none',
              width: 12,
            }}>
              {m.role === 'user' ? '›' : '$'}
            </span>
            <span style={{
              fontSize: 12,
              color: m.role === 'user' ? 'var(--text)' : 'var(--muted)',
              lineHeight: 1.65,
              letterSpacing: '0.01em',
            }}>
              {m.content}
            </span>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--muted)', width: 12 }}>$</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              thinking
              <span style={{ animation: 'pulse-dot 1.2s ease-in-out infinite' }}>_</span>
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          borderTop: '1px solid var(--border)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 12, color: 'var(--accent)', flexShrink: 0, userSelect: 'none' }}>›</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="ask about your metrics..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--text)',
            fontSize: 12,
            fontFamily: 'inherit',
            outline: 'none',
            letterSpacing: '0.01em',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
            fontSize: 10,
            padding: '4px 14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.08em',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => {
            if (!loading) {
              (e.target as HTMLButtonElement).style.borderColor = 'var(--accent)'
              ;(e.target as HTMLButtonElement).style.color = 'var(--accent)'
            }
          }}
          onMouseLeave={e => {
            ;(e.target as HTMLButtonElement).style.borderColor = 'var(--border)'
            ;(e.target as HTMLButtonElement).style.color = 'var(--muted)'
          }}
        >
          send
        </button>
      </form>
    </div>
  )
}
