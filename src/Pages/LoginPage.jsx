import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
    setSubmitting(false)
  }

  return (
    <div className="flex h-screen items-center justify-center overflow-y-auto bg-[#100422] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="oswald-500 text-4xl uppercase text-white">DESIFEST</Link>
          <p className="mt-2 text-gray-300">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#D5FF00] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#D5FF00] focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#D5FF00] py-3 font-semibold uppercase text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#D5FF00] hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}
