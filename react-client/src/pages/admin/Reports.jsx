import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const API_BASE = '/api'

export default function AdminReports() {
  const { getAuthHeader } = useAuth()
  const [stats, setStats] = useState({ totalBooks: 0, totalUsers: 0, mostBorrowed: null })
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

        // Find most borrowed book
        const counts = {}
        borrows.forEach(b => {
          counts[b.res_id] = counts[b.res_id] || { count: 0, title: b.title, author: b.author }
          counts[b.res_id].count++
        })
        const sorted = Object.values(counts).sort((a, b) => b.count - a.count)
        const mostBorrowed = sorted[0] || null

        setStats({ totalBooks: books.length, totalUsers: users.length, mostBorrowed })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <AdminLayout title="Reports">
      {loading ? <p>Loading...</p> : (
        <div className="card-list" style={{ gridTemplateColumns: '1fr' }}>
          <div className="card">
            <h3>Total Books</h3>
            <p>{stats.totalBooks}</p>
          </div>

          <div className="card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>

          <div className="card">
            <h3>Most Borrowed Book</h3>
            <p>{stats.mostBorrowed ? `${stats.mostBorrowed.title} (${stats.mostBorrowed.count})` : 'N/A'}</p>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
