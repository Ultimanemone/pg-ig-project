import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const API_BASE = '/api'
const emptyForm = { nickname: '', email: '', password: '', role: 'User' }

export default function ManageUsers() {
  const { getAuthHeader } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState('')

  const load = async () => {
    const res = await fetch(`${API_BASE}/accounts`, { headers: getAuthHeader() })
    const data = await res.json()
    setUsers(data.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditingUser(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (u) => { setEditingUser(u); setForm({ nickname: u.nickname, email: u.email, password: '', role: u.role }); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setMessage('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      if (editingUser) {
        const payload = { user_id: editingUser.user_id, ...form }
        if (!payload.password) payload.password = editingUser.password
        const res = await fetch(`${API_BASE}/accounts`, { method: 'PUT', headers: getAuthHeader(), body: JSON.stringify(payload) })
        if (!res.ok) { setMessage('Failed to update'); return }
      } else {
        const res = await fetch(`${API_BASE}/accounts`, { method: 'POST', headers: getAuthHeader(), body: JSON.stringify(form) })
        if (!res.ok) { setMessage('Failed to create'); return }
      }
      closeModal(); load()
    } catch {
      setMessage('Network error')
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Delete this user?')) return
    await fetch(`${API_BASE}/accounts`, { method: 'DELETE', headers: getAuthHeader(), body: JSON.stringify({ user_id: userId }) })
    load()
  }

  return (
    <AdminLayout title="Manage Users">
      <div style={{ marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={openAdd}>Add User</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.user_id}>
                  <td>{u.user_id}</td>
                  <td>{u.nickname}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.role ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ marginRight: 8 }} onClick={() => openEdit(u)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(u.user_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingUser ? 'Edit User' : 'Add User'}</h2>
            {message && <div className="alert alert-error">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Username</label><input value={form.nickname} onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))} required /></div>
              <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div>
              <div className="form-group"><label>Password{editingUser ? ' (leave blank to keep)' : ''}</label><input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} {...(!editingUser ? { required: true } : {})} /></div>
              <div className="form-group">
                <label>Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingUser ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
