import { useState, useEffect } from 'react'
import UserLayout from '../../components/UserLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const API_BASE = '/api'

export default function UserProfile() {
  const { user, getAuthHeader } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/accounts?user_id=${user.userId}`, { headers: getAuthHeader() })
        const data = await res.json()
        setProfile(data.user || null)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <UserLayout title="Profile" subtitle={user?.nickname || 'User'}>
      {loading ? <p>Loading...</p> : !profile ? <p>Profile not found.</p> : (
        <div className="profile-layout" style={{ gridTemplateColumns: '1fr' }}>
          <section className="profile-card">
            <h2>Profile Information</h2>

            <div className="profile-info-list">
              <div className="profile-info-item">
                <span>Full Name</span>
                <p>{profile.nickname || '-'}</p>
              </div>

              <div className="profile-info-item">
                <span>Email</span>
                <p>{profile.email || '-'}</p>
              </div>

              <div className="profile-info-item">
                <span>Phone</span>
                <p>-</p>
              </div>

              <div className="profile-info-item">
                <span>Student ID</span>
                <p>{profile.user_id || '-'}</p>
              </div>

              <div className="profile-info-item">
                <span>Department</span>
                <p>-</p>
              </div>

              <div className="profile-info-item">
                <span>Membership Type</span>
                <p>{profile.role || '-'}</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </UserLayout>
  )
}
