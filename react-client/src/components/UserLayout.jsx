import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Layout.css'

export default function UserLayout({ children, title, subtitle }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="logo">Library User</h2>
        <ul>
          <li><NavLink to="/user/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/user/search">Search Books</NavLink></li>
          <li><NavLink to="/user/borrowing-history">My Borrowed Books</NavLink></li>
          <li><NavLink to="/user/profile">Profile</NavLink></li>
          <li><NavLink to="/user/settings">Settings</NavLink></li>
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
