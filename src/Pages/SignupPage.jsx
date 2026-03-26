import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState('client')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setSubmitting(true)
    try {
      await signup(email, password, role, firstName, lastName)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
    setSubmitting(false)
  }

  return (
    <div className="flex h-screen items-center justify-center overflow-y-auto bg-[#100422] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="oswald-500 text-4xl uppercase text-white">DESIFEST</Link>
          <p className="mt-2 text-gray-300">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-300">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`border px-4 py-3 text-sm font-semibold uppercase transition ${
                  role === 'client'
                    ? 'border-[#D5FF00] bg-[#D5FF00]/10 text-[#D5FF00]'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setRole('artist')}
                className={`border px-4 py-3 text-sm font-semibold uppercase transition ${
                  role === 'artist'
                    ? 'border-[#D5FF00] bg-[#D5FF00]/10 text-[#D5FF00]'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Artist
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-300">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First"
                className="w-full border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#D5FF00] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-300">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last"
                className="w-full border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#D5FF00] focus:outline-none"
              />
            </div>
          </div>

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
              placeholder="At least 8 characters"
              className="w-full border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#D5FF00] focus:outline-none"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-300">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-[#D5FF00] focus:outline-none"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#D5FF00] py-3 font-semibold uppercase text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-[#D5FF00] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
