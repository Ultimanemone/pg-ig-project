import { useState, useEffect } from 'react'
import UserLayout from '../../components/UserLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const API_BASE = '/api'

export default function UserBorrowingHistory() {
  const { user, getAuthHeader } = useAuth()
  const [borrows, setBorrows] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const load = async () => {
    try {
      const res = await fetch(`${API_BASE}/log/borrow?user_id=${user.userId}`, { headers: getAuthHeader() })
      const data = await res.json()
      setBorrows(data.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleReturn = async (resId) => {
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/return`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ user_id: user.userId, res_id: resId })
      })
      const data = await res.json()
      if (!res.ok) { setMessage(data.message || 'Failed to return'); return }
      setMessage('Book returned successfully!')
      load()
    } catch {
      setMessage('Network error')
    }
  }

  return (
    <UserLayout title="Borrowing History" subtitle={user?.nickname || 'User'}>
      {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}

      {loading ? <p>Loading...</p> : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Date Borrowed</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {borrows.length === 0 ? (
                <tr><td colSpan="6">No borrowing history found.</td></tr>
              ) : borrows.map(b => (
                <tr key={b.borrow_id}>
                  <td>{b.title}</td>
                  <td>{new Date(b.borrow_date).toLocaleDateString('en-GB')}</td>
                  <td>{b.return_date ? new Date(b.return_date).toLocaleDateString('en-GB') : '-'}</td>
                  <td>{b.status === 'Returned' && b.return_date ? new Date(b.return_date).toLocaleDateString('en-GB') : '-'}</td>
                  <td>{b.status}</td>
                  <td>
                    {b.status === 'Borrowed' && (
                      <button className="btn btn-warning" onClick={() => handleReturn(b.res_id)}>Return</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </UserLayout>
  )
}
