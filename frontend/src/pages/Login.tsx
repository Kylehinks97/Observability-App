import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const form = new URLSearchParams()
      form.append('username', username)
      form.append('password', password)
      const { data } = await axios.post('/auth/login', form)
      localStorage.setItem('token', data.access_token)
      navigate('/')
    } catch {
      setError('invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text)',
    fontSize: 13,
    padding: '10px 0',
    outline: 'none',
    fontFamily: 'inherit',
    letterSpacing: '0.02em',
    transition: 'border-color 0.15s',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 340, padding: '0 24px' }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontSize: 10,
            letterSpacing: '0.3em',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            DevPulse
          </div>
          <div style={{ borderTop: '1px solid var(--border)' }} />
        </div>

        <h1 style={{
          fontSize: 20,
          fontWeight: 600,
          color: 'var(--text)',
          margin: '0 0 32px',
          letterSpacing: '-0.01em',
        }}>
          sign in
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 28 }}>
            <label style={{
              display: 'block',
              fontSize: 10,
              color: 'var(--muted)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}>
              username
            </label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              style={inputStyle}
              onFocus={e => (e.target.style.borderBottomColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderBottomColor = 'var(--border)')}
            />
          </div>

          <div style={{ marginBottom: 40 }}>
            <label style={{
              display: 'block',
              fontSize: 10,
              color: 'var(--muted)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}>
              password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              style={inputStyle}
              onFocus={e => (e.target.style.borderBottomColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderBottomColor = 'var(--border)')}
            />
          </div>

          {error && (
            <div style={{ fontSize: 11, color: 'var(--red)', marginBottom: 20, letterSpacing: '0.02em' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'transparent' : 'var(--accent)',
              border: loading ? '1px solid var(--border)' : '1px solid var(--accent)',
              color: loading ? 'var(--muted)' : '#000',
              padding: '12px 0',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'inherit',
              letterSpacing: '0.08em',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {loading ? 'signing in...' : 'continue →'}
          </button>
        </form>

        <div style={{ marginTop: 28, fontSize: 11, color: 'var(--muted)' }}>
          no account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            register
          </Link>
        </div>
      </div>
    </div>
  )
}
