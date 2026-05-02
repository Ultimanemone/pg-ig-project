import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

// Auth
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

// User pages
import UserDashboard from './pages/user/Dashboard.jsx'
import UserSearchBooks from './pages/user/SearchBooks.jsx'
import UserBorrowingHistory from './pages/user/BorrowingHistory.jsx'
import UserProfile from './pages/user/Profile.jsx'
import UserSettings from './pages/user/Settings.jsx'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminManageBooks from './pages/admin/ManageBooks.jsx'
import AdminManageUsers from './pages/admin/ManageUsers.jsx'
import AdminBorrowingHistory from './pages/admin/BorrowingHistory.jsx'
import AdminReports from './pages/admin/Reports.jsx'
import AdminSettings from './pages/admin/Settings.jsx'

function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User routes */}
          <Route path="/user/dashboard" element={<ProtectedRoute requiredRole="User"><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/search" element={<ProtectedRoute requiredRole="User"><UserSearchBooks /></ProtectedRoute>} />
          <Route path="/user/borrowing-history" element={<ProtectedRoute requiredRole="User"><UserBorrowingHistory /></ProtectedRoute>} />
          <Route path="/user/profile" element={<ProtectedRoute requiredRole="User"><UserProfile /></ProtectedRoute>} />
          <Route path="/user/settings" element={<ProtectedRoute requiredRole="User"><UserSettings /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="Admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/manage-books" element={<ProtectedRoute requiredRole="Admin"><AdminManageBooks /></ProtectedRoute>} />
          <Route path="/admin/manage-users" element={<ProtectedRoute requiredRole="Admin"><AdminManageUsers /></ProtectedRoute>} />
          <Route path="/admin/borrowing-history" element={<ProtectedRoute requiredRole="Admin"><AdminBorrowingHistory /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute requiredRole="Admin"><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requiredRole="Admin"><AdminSettings /></ProtectedRoute>} />

          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
