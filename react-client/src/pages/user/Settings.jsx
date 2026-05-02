import { useState, useEffect } from 'react'
import UserLayout from '../../components/UserLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const API_BASE = '/api'

export default function UserSettings() {
  const { user, getAuthHeader } = useAuth()
  const [form, setForm] = useState({ nickname: '', email: '', password: '' })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/accounts?user_id=${user.userId}`, { headers: getAuthHeader() })
        const data = await res.json()
        const p = data.user
        if (p) setForm({ nickname: p.nickname || '', email: p.email || '', password: '' })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/accounts`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({ user_id: user.userId, ...form, role: user.role })
      })
      const data = await res.json()
      setMessage(data.success ? 'Settings updated successfully!' : data.message || 'Failed to update')
    } catch {
      setMessage('Network error')
    }
  }

  return (
    <UserLayout title="Profile" subtitle={user?.nickname || 'User'}>
      {loading ? <p>Loading...</p> : (
        <div className="profile-layout" style={{ gridTemplateColumns: '1fr' }}>
          <section className="profile-card">
            <h2>Edit Profile</h2>
          {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={form.nickname} onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" value="0901234567" readOnly />
            </div>
            <div className="form-group">
              <label>Student ID</label>
              <input type="text" value={String(user.userId || '')} readOnly />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input type="text" value="Computer Science" readOnly />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <button type="submit" className="update-btn">Update Profile</button>
          </form>
          </section>
        </div>
      )}
    </UserLayout>
  )
}
