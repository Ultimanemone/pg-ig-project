import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout.jsx'

export default function AdminSettings() {
  const [libraryName, setLibraryName] = useState('HCMUT Digital Library')
  const [adminEmail, setAdminEmail] = useState('admin@library.com')
  const [saved, setSaved] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setSaved('Settings saved')
  }

  return (
    <AdminLayout title="Settings">
      {saved && <div className="alert alert-success">{saved}</div>}
      <div className="card" style={{ maxWidth: 520 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Library Name</label>
            <input
              type="text"
              value={libraryName}
              onChange={(event) => setLibraryName(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(event) => setAdminEmail(event.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">Save Settings</button>
        </form>
      </div>
    </AdminLayout>
  )
}
