import { useState, useEffect } from 'react'
import Login from './components/Login'
import AdminDashboard from './components/AdminDashboard'
import SecurityDashboard from './components/SecurityDashboard'
import StudentDashboard from './components/StudentDashboard'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
      case 'security':
        return <SecurityDashboard user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
      case 'student':
        return <StudentDashboard user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
      default:
        return null
    }
  }

  return (
    <div className="app">
      {!user ? (
        <Login onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />
      ) : (
        renderDashboard()
      )}
    </div>
  )
}

export default App
