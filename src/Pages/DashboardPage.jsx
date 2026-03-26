import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import ArtistDashboard from '@/Components/Dashboard/ArtistDashboard'
import ClientDashboard from '@/Components/Dashboard/ClientDashboard'

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#100422]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D5FF00] border-t-transparent" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (user.role === 'artist') return <ArtistDashboard />
  if (user.role === 'client') return <ClientDashboard />

  return <Navigate to="/" replace />
}
