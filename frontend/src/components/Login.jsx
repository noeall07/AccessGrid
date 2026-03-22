import { useState } from 'react'
import { login } from '../api/api'
import ThemeToggle from './ThemeToggle'
import './Login.css'
import logo from '../assets/logo.svg'

const Login = ({ onLogin, theme, toggleTheme }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const response = await login(username, password)
            onLogin(response.data)
        } catch (err) {
            const message = err.response?.data?.error || 'Login failed. Please try again.'
            setError(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="grid-pattern"></div>
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <div className="login-header">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>

            <div className="login-content">
                <div className="login-card slide-up">
                    <div className="login-logo">
                        <div className="logo-icon">
                            <img src={logo} alt="AccessGrid Logo" />
                        </div>
                        <h1>AccessGrid</h1>
                        <p className="login-subtitle">Digital Entry-Exit Management</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="error-message fade-in">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <button type="submit" className="login-button" disabled={isLoading}>
                            {isLoading ? (
                                <div className="button-loader">
                                    <div className="loader-dot"></div>
                                    <div className="loader-dot"></div>
                                    <div className="loader-dot"></div>
                                </div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="credentials-hint">
                        <p className="hint-title">Demo Credentials</p>
                        <div className="credentials-grid">
                            <div className="credential-card">
                                <span className="credential-role admin">Admin</span>
                                <code>admin / admin123</code>
                            </div>
                            <div className="credential-card">
                                <span className="credential-role security">Security</span>
                                <code>security / security123</code>
                            </div>
                            <div className="credential-card">
                                <span className="credential-role student">Student</span>
                                <code>student / student123</code>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="login-footer">
                    FISAT Campus Security System · Version 2.0
                </p>
            </div>
        </div>
    )
}

export default Login
