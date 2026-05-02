import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const API_BASE = '/api'
const emptyForm = { user_id: '', res_id: '', borrow_date: '', return_date: '', status: 'Borrowed' }

export default function AdminBorrowingHistory() {
  const { getAuthHeader } = useAuth()
  const [borrows, setBorrows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBorrow, setEditingBorrow] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState('')

  const load = async () => {
    const res = await fetch(`${API_BASE}/log/borrow`, { headers: getAuthHeader() })
    const data = await res.json()
    setBorrows(data.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toDateInput = (d) => d ? new Date(d).toISOString().slice(0, 10) : ''

  const openAdd = () => { setEditingBorrow(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (b) => {
    setEditingBorrow(b)
    setForm({ user_id: b.user_id, res_id: b.res_id, borrow_date: toDateInput(b.borrow_date), return_date: toDateInput(b.return_date), status: b.status })
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setMessage('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      if (editingBorrow) {
        const res = await fetch(`${API_BASE}/log/borrow`, { method: 'PUT', headers: getAuthHeader(), body: JSON.stringify({ borrow_id: editingBorrow.borrow_id, ...form }) })
        if (!res.ok) { setMessage('Failed to update'); return }
      } else {
        const res = await fetch(`${API_BASE}/log/borrow`, { method: 'POST', headers: getAuthHeader(), body: JSON.stringify(form) })
        if (!res.ok) { setMessage('Failed to add'); return }
      }
      closeModal(); load()
    } catch {
      setMessage('Network error')
    }
  }

  const handleDelete = async (borrowId) => {
    if (!confirm('Delete this record?')) return
    await fetch(`${API_BASE}/log/borrow`, { method: 'DELETE', headers: getAuthHeader(), body: JSON.stringify({ borrow_id: borrowId }) })
    load()
  }

  return (
    <AdminLayout title="Borrowing History">
      <div style={{ marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={openAdd}>Add Borrow Record</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>User</th><th>Book</th><th>Date Borrowed</th><th>Due Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {borrows.map(b => (
                <tr key={b.borrow_id}>
                  <td>{b.nickname} ({b.email})</td>
                  <td>{b.title}</td>
                  <td>{new Date(b.borrow_date).toLocaleDateString('en-GB')}</td>
                  <td>{b.return_date ? new Date(b.return_date).toLocaleDateString('en-GB') : '-'}</td>
                  <td>{b.status}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ marginRight: 8 }} onClick={() => openEdit(b)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(b.borrow_id)}>Delete</button>
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
            <h2>{editingBorrow ? 'Edit Record' : 'Add Record'}</h2>
            {message && <div className="alert alert-error">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>User ID</label><input type="number" value={form.user_id} onChange={e => setForm(f => ({ ...f, user_id: e.target.value }))} required /></div>
              <div className="form-group"><label>Resource ID</label><input type="number" value={form.res_id} onChange={e => setForm(f => ({ ...f, res_id: e.target.value }))} required /></div>
              <div className="form-group"><label>Borrow Date</label><input type="date" value={form.borrow_date} onChange={e => setForm(f => ({ ...f, borrow_date: e.target.value }))} required /></div>
              <div className="form-group"><label>Return Date</label><input type="date" value={form.return_date} onChange={e => setForm(f => ({ ...f, return_date: e.target.value }))} /></div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="Borrowed">Borrowed</option>
                  <option value="Returned">Returned</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingBorrow ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
