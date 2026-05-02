import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const API_BASE = '/api'
const emptyForm = { title: '', author: '', description: '', availability: 'Available', category: '' }

export default function ManageBooks() {
  const { getAuthHeader } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState('')

  const load = async () => {
    const res = await fetch(`${API_BASE}/`, { headers: getAuthHeader() })
    const data = await res.json()
    setBooks(data.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditingBook(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (book) => { setEditingBook(book); setForm({ title: book.title, author: book.author, description: book.description || '', availability: book.availability, category: book.category || '' }); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setMessage('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      if (editingBook) {
        const res = await fetch(`${API_BASE}/update`, {
          method: 'PUT', headers: getAuthHeader(),
          body: JSON.stringify({ res_id: editingBook.res_id, ...form })
        })
        if (!res.ok) { setMessage('Failed to update book'); return }
        // Update category
        await fetch(`${API_BASE}/category/update`, {
          method: 'PUT', headers: getAuthHeader(),
          body: JSON.stringify({ res_id: editingBook.res_id, category: form.category })
        })
      } else {
        const res = await fetch(`${API_BASE}/add`, {
          method: 'POST', headers: getAuthHeader(),
          body: JSON.stringify(form)
        })
        const data = await res.json()
        if (!res.ok || !data.res_id) { setMessage('Failed to add book'); return }
        // Add category
        if (form.category) {
          await fetch(`${API_BASE}/category/add`, {
            method: 'POST', headers: getAuthHeader(),
            body: JSON.stringify({ res_id: data.res_id, category: form.category })
          })
        }
      }
      closeModal()
      load()
    } catch {
      setMessage('Network error')
    }
  }

  const handleDelete = async (resId) => {
    if (!confirm('Delete this book?')) return
    await fetch(`${API_BASE}/delete`, {
      method: 'DELETE', headers: getAuthHeader(),
      body: JSON.stringify({ res_id: resId })
    })
    load()
  }

  return (
    <AdminLayout title="Manage Books">
      <div style={{ marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={openAdd}>Add Book</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>ID</th><th>Title</th><th>Author</th><th>Category</th><th>Action</th></tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b.res_id}>
                  <td>{b.res_id}</td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.category || 'Uncategorized'}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ marginRight: 8 }} onClick={() => openEdit(b)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(b.res_id)}>Delete</button>
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
            <h2>{editingBook ? 'Edit Book' : 'Add Book'}</h2>
            {message && <div className="alert alert-error">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
              <div className="form-group"><label>Author</label><input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} required /></div>
              <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
              <div className="form-group"><label>Category</label><input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
              <div className="form-group">
                <label>Availability</label>
                <select value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value }))}>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingBook ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
