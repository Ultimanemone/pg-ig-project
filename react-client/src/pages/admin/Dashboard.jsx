import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const API_BASE = '/api'

export default function AdminDashboard() {
  const { user, getAuthHeader } = useAuth()
  const [stats, setStats] = useState({ totalBooks: 0, totalUsers: 0, borrowedToday: 0, overdue: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [booksRes, usersRes, borrowsRes] = await Promise.all([
          fetch(`${API_BASE}/`, { headers: getAuthHeader() }),
          fetch(`${API_BASE}/accounts`, { headers: getAuthHeader() }),
          fetch(`${API_BASE}/log/borrow`, { headers: getAuthHeader() })
        ])
        const books = (await booksRes.json()).data || []
        const users = (await usersRes.json()).data || []
        const borrows = (await borrowsRes.json()).data || []

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const borrowedToday = borrows.filter(b => {
          const d = new Date(b.borrow_date)
          d.setHours(0, 0, 0, 0)
          return d.getTime() === today.getTime()
        }).length

        const overdue = borrows.filter(b => {
          return b.status === 'Borrowed' && new Date(b.return_date) < new Date()
        }).length

        setStats({ totalBooks: books.length, totalUsers: users.length, borrowedToday, overdue })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <AdminLayout title="Dashboard" subtitle={user?.nickname || 'Admin'}>
      {loading ? <p>Loading...</p> : (
        <div className="card-list">
          <div className="card">
            <h3>Total Books</h3>
            <p>{stats.totalBooks}</p>
          </div>
          <div className="card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="card">
            <h3>Borrowed Today</h3>
            <p>{stats.borrowedToday}</p>
          </div>
          <div className="card">
            <h3>Overdue Books</h3>
            <p>{stats.overdue}</p>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
