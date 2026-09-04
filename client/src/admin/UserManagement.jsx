import { useEffect, useState } from 'react'
import { KeyRound, UserPlus, CheckCircle2, Trash2, Users } from 'lucide-react'
import { api } from '../services/api.js'

const getAdminUsers = async () => {
  const { data } = await api.get('/auth/users')
  return data.data
}

const createAdminUser = async (payload) => {
  const { data } = await api.post('/auth/users', payload)
  return data.data
}

const deleteAdminUser = async (id) => {
  const { data } = await api.delete(`/auth/users/${id}`)
  return data
}

const changeAdminPassword = async (payload) => {
  const { data } = await api.patch('/auth/password', payload)
  return data
}

export default function UserManagement() {
  const [newUser, setNewUser] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [usersLoading, setUsersLoading] = useState(true)
  const [deletingId, setDeletingId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadUsers = async () => {
    try {
      setUsersLoading(true)
      const data = await getAdminUsers()
      setUsers(data)
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load admin users')
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const createUser = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const user = await createAdminUser(newUser)
      setNewUser({ name: '', email: '' })
      setMessage(`User ${user.name} created successfully. They can sign in with the configured default password.`)
      await loadUsers()
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to create user')
    } finally {
      setLoading(false)
    }
  }

  const removeUser = async (user) => {
    if (!window.confirm(`Delete admin account for ${user.name}? This action cannot be undone.`)) return

    setDeletingId(user._id)
    setMessage('')
    setError('')
    try {
      await deleteAdminUser(user._id)
      setUsers((current) => current.filter((item) => item._id !== user._id))
      setMessage(`Admin account for ${user.name} was deleted.`)
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to delete admin user')
    } finally {
      setDeletingId('')
    }
  }

  const updatePassword = async (event) => {
    event.preventDefault()
    setPasswordLoading(true)
    setMessage('')
    setError('')
    try {
      await changeAdminPassword(passwords)
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setMessage('Your password has been changed successfully.')
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="admin-users-page">
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">Access & security</p>
          <h1>Users</h1>
        </div>
      </header>

      {error && <div className="admin-alert" role="alert">{error}</div>}
      {message && <div className="admin-success" role="status"><CheckCircle2 size={15} /> {message}</div>}

      <div className="admin-user-management-grid">
        <section className="admin-panel admin-user-panel">
          <div className="admin-panel-title">
            <div>
              <h2><UserPlus size={19} /> Create new user</h2>
              <p>Creates another admin account with the configured default password.</p>
            </div>
          </div>
          <form className="admin-form" onSubmit={createUser}>
            <label>
              Full name
              <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="User name" autoComplete="name" required />
            </label>
            <label>
              Email
              <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="user@example.com" autoComplete="email" required />
            </label>
            <button type="submit" className="admin-primary" disabled={loading}>
              <UserPlus size={16} /> {loading ? 'Creating…' : 'Create user'}
            </button>
          </form>
        </section>

        <section className="admin-panel admin-user-panel">
          <div className="admin-panel-title">
            <div>
              <h2><KeyRound size={19} /> Change password</h2>
              <p>Update the password for your current admin account.</p>
            </div>
          </div>
          <form className="admin-form" onSubmit={updatePassword}>
            <label>
              Current password
              <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} autoComplete="current-password" required />
            </label>
            <label>
              New password
              <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} autoComplete="new-password" minLength={8} required />
            </label>
            <label>
              Confirm new password
              <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} autoComplete="new-password" minLength={8} required />
            </label>
            <button type="submit" className="admin-primary" disabled={passwordLoading}>
              <KeyRound size={16} /> {passwordLoading ? 'Changing…' : 'Change password'}
            </button>
          </form>
        </section>
      </div>

      <section className="admin-panel admin-user-panel admin-user-list-panel">
        <div className="admin-panel-title">
          <div>
            <h2><Users size={19} /> Admin accounts</h2>
            <p>Manage the admin accounts that can access this dashboard.</p>
          </div>
        </div>
        {usersLoading ? (
          <p>Loading users…</p>
        ) : users.length === 0 ? (
          <p>No admin accounts found.</p>
        ) : (
          <div className="admin-user-list">
            {users.map((user) => (
              <div className="admin-user-row" key={user._id}>
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <div className="admin-user-row-actions">
                  <span className="admin-user-status">{user.active ? 'Active' : 'Inactive'}</span>
                  <button
                    type="button"
                    className="admin-danger"
                    onClick={() => removeUser(user)}
                    disabled={deletingId === user._id}
                    title="Delete admin"
                  >
                    <Trash2 size={15} /> {deletingId === user._id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
