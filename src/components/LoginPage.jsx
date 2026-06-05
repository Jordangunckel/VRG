import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function LoginPage({ onSuccess, onBack }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email:    email.trim().toLowerCase(),
      password,
    })

    if (authError) {
      setError('Incorrect email or password.')
      setLoading(false)
    } else {
      onSuccess(data.user)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg-pattern" />

      <div className="login-card">
        <div className="login-card-header">
          <img src="/icon.png" alt="RoofSmartr" className="login-logo" />
          <h1 className="login-title">Client Portal</h1>
          <p className="login-sub">Sign in to access your SOP Builder</p>
        </div>

        <form className="login-form" onSubmit={submit}>
          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <div className="login-pass-wrap">
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                required
              />
              <button
                type="button"
                className="login-pass-toggle"
                onClick={() => setShowPass(s => !s)}
                tabIndex={-1}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-lg login-submit"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <button className="login-back" onClick={onBack}>
          ← Back to site
        </button>
      </div>
    </div>
  )
}
