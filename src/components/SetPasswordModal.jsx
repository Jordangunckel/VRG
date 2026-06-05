import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function SetPasswordModal({ open, onDone }) {
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [saving,   setSaving]   = useState(false)
  const [done,     setDone]     = useState(false)

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8)          return setError('Password must be at least 8 characters.')
    if (password !== confirm)          return setError('Passwords do not match.')
    setSaving(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) {
      setError(err.message)
      setSaving(false)
    } else {
      setDone(true)
      setTimeout(onDone, 1800)
    }
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-box" style={{ maxWidth: 420 }}>
        {done ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontWeight: 800, marginBottom: 8 }}>Password set!</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: 14 }}>You're all set. Welcome aboard.</p>
          </div>
        ) : (
          <>
            <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 6 }}>Set your password</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: 14, marginBottom: 24 }}>
              Create a password for your account to finish setup.
            </p>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="login-field">
                <label>New password</label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  autoFocus
                  required
                />
              </div>
              <div className="login-field">
                <label>Confirm password</label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError('') }}
                  required
                />
              </div>
              {error && <div className="login-error">{error}</div>}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Set Password →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
