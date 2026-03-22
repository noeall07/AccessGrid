import { useState, useEffect } from 'react'
import { getVehicles, getEntryLogs, getParkingZones, getStats } from '../api/api'
import Sidebar from './Sidebar'
import StatsCard from './StatsCard'
import ParkingZones from './ParkingZones'
import './Dashboard.css'

const StudentDashboard = ({ user, onLogout, theme, toggleTheme }) => {
    const [activeView, setActiveView] = useState('overview')
    const [stats, setStats] = useState([])
    const [studentVehicle, setStudentVehicle] = useState(null)
    const [entryHistory, setEntryHistory] = useState([])
    const [parkingZones, setParkingZonesData] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [statsRes, vehiclesRes, zonesRes] = await Promise.all([
                getStats('student'),
                getVehicles(),
                getParkingZones(),
            ])
            setStats(statsRes.data)
            setParkingZonesData(zonesRes.data)

            // Find student's vehicle — match by owner_id or owner name
            const myVehicle = vehiclesRes.data.find(
                (v) => v.owner === user.name || v.ownerId === user.id
            )
            if (myVehicle) {
                setStudentVehicle(myVehicle)
                // Fetch logs for this vehicle
                const logsRes = await getEntryLogs({ vehicle_id: myVehicle.id, limit: 20 })
                // Group entry/exit pairs into history rows
                const logs = logsRes.data
                const history = buildHistory(logs)
                setEntryHistory(history)
            }
        } catch (err) {
            console.error('Failed to fetch student data:', err)
        }
    }

    // Build entry/exit history from raw logs
    const buildHistory = (logs) => {
        // logs are sorted desc by timestamp
        const rows = []
        const reversed = [...logs].reverse()  // oldest first

        for (let i = 0; i < reversed.length; i++) {
            const log = reversed[i]
            if (log.action === 'entry') {
                const exitLog = reversed.slice(i + 1).find(
                    (l) => l.action === 'exit' && new Date(l.timestamp) > new Date(log.timestamp)
                )
                const entryTime = new Date(log.timestamp)
                const exitTime = exitLog ? new Date(exitLog.timestamp) : null

                const durationMs = exitTime ? exitTime - entryTime : null
                const durationStr = durationMs
                    ? `${Math.floor(durationMs / 3600000)}h ${Math.floor((durationMs % 3600000) / 60000)}m`
                    : 'Ongoing'

                rows.push({
                    date: entryTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    entry: entryTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    exit: exitTime ? exitTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-',
                    duration: durationStr,
                })
            }
        }
        return rows.reverse()  // newest first
    }

    const menuItems = [
        { id: 'overview', label: 'My Dashboard', icon: 'grid' },
        { id: 'vehicle', label: 'My Vehicle', icon: 'car' },
        { id: 'history', label: 'Entry History', icon: 'clock' },
        { id: 'parking', label: 'Parking Map', icon: 'parking' },
        { id: 'settings', label: 'Settings', icon: 'settings' },
    ]

    return (
        <div className="dashboard">
            <Sidebar
                menuItems={menuItems}
                activeView={activeView}
                setActiveView={setActiveView}
                onLogout={onLogout}
                theme={theme}
                toggleTheme={toggleTheme}
                user={user}
            />

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            {activeView === 'overview' && 'My Dashboard'}
                            {activeView === 'vehicle' && 'Vehicle Details'}
                            {activeView === 'history' && 'Entry History'}
                            {activeView === 'parking' && 'Parking Map'}
                            {activeView === 'settings' && 'Settings'}
                        </h1>
                        <p className="page-subtitle">
                            Welcome, {user.name} · {user.studentId}
                        </p>
                    </div>
                    <div className="header-right">
                        <div className="status-indicator">
                            <span className={`status-dot ${studentVehicle?.isInside ? 'inside' : 'outside'}`}></span>
                            <span>{studentVehicle?.isInside ? 'Currently Inside Campus' : 'Outside Campus'}</span>
                        </div>
                        <div className="user-avatar student">
                            <span>AM</span>
                        </div>
                    </div>
                </header>

                <div className="dashboard-content fade-in">
                    {activeView === 'overview' && (
                        <>
                            <section className="stats-section">
                                {stats.map((stat, index) => (
                                    <StatsCard key={index} {...stat} />
                                ))}
                            </section>

                            <div className="main-grid">
                                <section className="vehicle-section">
                                    <div className="section-header">
                                        <h2>Vehicle Status</h2>
                                        {studentVehicle && (
                                            <span className={`status-badge ${studentVehicle.isInside ? 'inside' : 'outside'}`}>
                                                {studentVehicle.isInside ? 'Parked' : 'Not in Campus'}
                                            </span>
                                        )}
                                    </div>
                                    {studentVehicle ? (
                                        <div className="vehicle-status-card">
                                            <div className="vehicle-info-grid">
                                                <div className="info-item">
                                                    <span className="info-label">Plate Number</span>
                                                    <code className="info-value">{studentVehicle.plate}</code>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label">Vehicle Type</span>
                                                    <span className="info-value">{studentVehicle.type}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label">Status</span>
                                                    <span className="info-value">{studentVehicle.isInside ? 'Inside' : 'Outside'}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label">Department</span>
                                                    <span className="info-value highlight">{studentVehicle.department || '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>No vehicle registered. Contact admin to register your vehicle.</p>
                                    )}
                                </section>

                                <section className="activity-section">
                                    <div className="section-header">
                                        <h2>Recent Activity</h2>
                                    </div>
                                    <div className="history-list">
                                        {entryHistory.slice(0, 4).map((entry, index) => (
                                            <div key={index} className="history-item">
                                                <div className="history-date">{entry.date}</div>
                                                <div className="history-times">
                                                    <span className="entry-time">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="9 10 4 15 9 20" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M20 4v7a4 4 0 01-4 4H4" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        {entry.entry}
                                                    </span>
                                                    <span className="exit-time">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="15 10 20 15 15 20" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M4 4v7a4 4 0 004 4h12" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        {entry.exit}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {entryHistory.length === 0 && <p>No entry history yet.</p>}
                                    </div>
                                </section>
                            </div>
                        </>
                    )}

                    {activeView === 'vehicle' && (
                        <section className="full-section">
                            <div className="section-header">
                                <h2>My Registered Vehicle</h2>
                            </div>
                            {studentVehicle ? (
                                <div className="vehicle-detail-card">
                                    <div className="vehicle-icon-large">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M5 17h14v-6l-2-4H7l-2 4v6z" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="7.5" cy="17" r="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="16.5" cy="17" r="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="vehicle-details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Registration Number</span>
                                            <code className="detail-value large">{studentVehicle.plate}</code>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Vehicle Type</span>
                                            <span className="detail-value">{studentVehicle.type}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Owner</span>
                                            <span className="detail-value">{studentVehicle.owner}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Department</span>
                                            <span className="detail-value">{studentVehicle.department || '-'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Status</span>
                                            <span className="detail-value">{studentVehicle.status}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Current Status</span>
                                            <span className={`detail-value status ${studentVehicle.isInside ? 'inside' : 'outside'}`}>
                                                {studentVehicle.isInside ? '● Inside Campus' : '○ Outside Campus'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>No vehicle registered yet.</p>
                            )}
                        </section>
                    )}

                    {activeView === 'history' && (
                        <section className="full-section">
                            <div className="section-header">
                                <h2>Entry/Exit History</h2>
                            </div>
                            <div className="history-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Entry Time</th>
                                            <th>Exit Time</th>
                                            <th>Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entryHistory.map((entry, index) => (
                                            <tr key={index}>
                                                <td>{entry.date}</td>
                                                <td className="time-cell">{entry.entry}</td>
                                                <td className="time-cell">{entry.exit}</td>
                                                <td>{entry.duration}</td>
                                            </tr>
                                        ))}
                                        {entryHistory.length === 0 && (
                                            <tr><td colSpan="4">No entry history found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {activeView === 'parking' && (
                        <section className="full-section">
                            <div className="section-header">
                                <h2>Campus Parking Map</h2>
                                {studentVehicle && (
                                    <span className="your-location">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Your vehicle: {studentVehicle.isInside ? 'Inside campus' : 'Outside campus'}
                                    </span>
                                )}
                            </div>
                            <ParkingZones zones={parkingZones} showRestricted studentZone="C" />
                        </section>
                    )}

                    {activeView === 'settings' && (
                        <section className="full-section">
                            <div className="section-header">
                                <h2>Settings</h2>
                            </div>
                            <div className="settings-content">
                                <div className="settings-group">
                                    <h3>Appearance</h3>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Dark Mode</span>
                                            <span className="setting-desc">Toggle between light and dark themes</span>
                                        </div>
                                        <button
                                            className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}
                                            onClick={toggleTheme}
                                        >
                                            <span className="toggle-knob"></span>
                                        </button>
                                    </div>
                                </div>
                                <div className="settings-group">
                                    <h3>Notifications</h3>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Entry Confirmation</span>
                                            <span className="setting-desc">Get notified when your vehicle enters campus</span>
                                        </div>
                                        <button className="toggle-switch active">
                                            <span className="toggle-knob"></span>
                                        </button>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Exit Reminders</span>
                                            <span className="setting-desc">Remind before campus closing time</span>
                                        </div>
                                        <button className="toggle-switch active">
                                            <span className="toggle-knob"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    )
}

export default StudentDashboard
