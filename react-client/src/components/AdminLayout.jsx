import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Layout.css'

export default function AdminLayout({ children, title, subtitle }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="logo">Library Admin</h2>
        <ul>
          <li><NavLink to="/admin/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/admin/manage-books">Manage Books</NavLink></li>
          <li><NavLink to="/admin/manage-users">Manage Users</NavLink></li>
          <li><NavLink to="/admin/borrowing-history">Borrowing History</NavLink></li>
          <li><NavLink to="/admin/reports">Reports</NavLink></li>
          <li><NavLink to="/admin/settings">Settings</NavLink></li>
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        </ul>
      </aside>
      <main className="main-content">
        {title && (
          <div className="page-header">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
