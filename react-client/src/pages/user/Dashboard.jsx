import { useState, useEffect } from 'react'
import UserLayout from '../../components/UserLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const API_BASE = '/api'

export default function UserDashboard() {
  const { user, getAuthHeader } = useAuth()
  const [stats, setStats] = useState({ borrowed: 0, dueSoon: 0, returned: 0, available: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [borrowRes, resourceRes] = await Promise.all([
          fetch(`${API_BASE}/log/borrow?user_id=${user.userId}`, { headers: getAuthHeader() }),
          fetch(`${API_BASE}/`, { headers: getAuthHeader() })
        ])
        const borrowData = await borrowRes.json()
        const resourceData = await resourceRes.json()

        const borrows = borrowData.data || []
        const resources = resourceData.data || []
        const now = new Date()
        const borrowed = borrows.filter(b => b.status === 'Borrowed').length
        const dueSoon = borrows.filter(b => {
          if (b.status !== 'Borrowed') return false
          const diff = (new Date(b.return_date) - now) / (1000 * 60 * 60 * 24)
          return diff <= 3 && diff >= 0
        }).length
        const returned = borrows.filter(b => b.status === 'Returned').length
        const available = resources.filter(r => r.availability === 'Available').length

        setStats({ borrowed, dueSoon, returned, available })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <UserLayout title="Dashboard" subtitle={user?.nickname || 'User'}>
      {loading ? <p>Loading...</p> : (
        <div className="card-list">
          <div className="card">
            <h3>Borrowed Books</h3>
            <p>{stats.borrowed}</p>
          </div>
          <div className="card">
            <h3>Books Due Soon</h3>
            <p>{stats.dueSoon}</p>
          </div>
          <div className="card">
            <h3>Returned Books</h3>
            <p>{stats.returned}</p>
          </div>
          <div className="card">
            <h3>Available Resources</h3>
            <p>{stats.available}</p>
          </div>
        </div>
      )}
    </UserLayout>
  )
}
