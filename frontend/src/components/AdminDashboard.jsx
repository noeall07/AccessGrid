import { useState, useEffect } from 'react'
import { getVehicles, addVehicle, getParkingZones, getStats } from '../api/api'
import Sidebar from './Sidebar'
import StatsCard from './StatsCard'
import VehicleTable from './VehicleTable'
import ParkingZones from './ParkingZones'
import './Dashboard.css'

const AdminDashboard = ({ user, onLogout, theme, toggleTheme }) => {
    const [activeView, setActiveView] = useState('overview')
    const [showAddVehicle, setShowAddVehicle] = useState(false)
    const [newVehicle, setNewVehicle] = useState({ plate: '', type: 'Staff', owner: '', department: '' })
    const [stats, setStats] = useState([])
    const [registeredVehicles, setRegisteredVehicles] = useState([])
    const [parkingZones, setParkingZones] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [vehiclesRes, zonesRes, statsRes] = await Promise.all([
                getVehicles(),
                getParkingZones(),
                getStats('admin'),
            ])
            setRegisteredVehicles(vehiclesRes.data)
            setParkingZones(zonesRes.data)
            setStats(statsRes.data)
        } catch (err) {
            console.error('Failed to fetch data:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddVehicle = async (e) => {
        e.preventDefault()
        try {
            await addVehicle(newVehicle)
            setNewVehicle({ plate: '', type: 'Staff', owner: '', department: '' })
            setShowAddVehicle(false)
            // Refresh vehicles & stats
            const [vehiclesRes, statsRes] = await Promise.all([getVehicles(), getStats('admin')])
            setRegisteredVehicles(vehiclesRes.data)
            setStats(statsRes.data)
        } catch (err) {
            console.error('Failed to add vehicle:', err)
            alert(err.response?.data?.error || 'Failed to add vehicle')
        }
    }

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: 'grid' },
        { id: 'vehicles', label: 'Registered Vehicles', icon: 'car' },
        { id: 'parking', label: 'Parking Zones', icon: 'parking' },
        { id: 'reports', label: 'Reports', icon: 'chart' },
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
                            {activeView === 'overview' && 'Admin Dashboard'}
                            {activeView === 'vehicles' && 'Registered Vehicles'}
                            {activeView === 'parking' && 'Parking Management'}
                            {activeView === 'reports' && 'Reports & Analytics'}
                            {activeView === 'settings' && 'Settings'}
                        </h1>
                        <p className="page-subtitle">
                            Welcome, {user.name} · College Administrator
                        </p>
                    </div>
                    <div className="header-right">
                        <div className="search-box">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                            </svg>
                            <input type="text" placeholder="Search vehicles..." />
                        </div>
                        <div className="user-avatar">
                            <span>AD</span>
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
                                        <h2>Recently Registered</h2>
                                        <button className="view-all-btn" onClick={() => setActiveView('vehicles')}>
                                            View All
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                    <VehicleTable vehicles={registeredVehicles.slice(0, 5)} showDepartment />
                                </section>

                                <section className="activity-section">
                                    <div className="section-header">
                                        <h2>Parking Overview</h2>
                                    </div>
                                    <ParkingZones zones={parkingZones} compact />
                                </section>
                            </div>
                        </>
                    )}

                    {activeView === 'vehicles' && (
                        <section className="full-section">
                            <div className="section-header">
                                <h2>Pre-Registered Staff Vehicles</h2>
                                <button className="add-btn" onClick={() => setShowAddVehicle(true)}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                                    </svg>
                                    Add Vehicle
                                </button>
                            </div>

                            {showAddVehicle && (
                                <div className="add-vehicle-form slide-up">
                                    <h3>Register New Vehicle</h3>
                                    <form onSubmit={handleAddVehicle}>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Plate Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="KL-XX-AB-1234"
                                                    value={newVehicle.plate}
                                                    onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Type</label>
                                                <select
                                                    value={newVehicle.type}
                                                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                                                >
                                                    <option value="Staff">Staff</option>
                                                    <option value="HOD">HOD</option>
                                                    <option value="Principal">Principal</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Owner Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Full name"
                                                    value={newVehicle.owner}
                                                    onChange={(e) => setNewVehicle({ ...newVehicle, owner: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Department</label>
                                                <input
                                                    type="text"
                                                    placeholder="Department"
                                                    value={newVehicle.department}
                                                    onChange={(e) => setNewVehicle({ ...newVehicle, department: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-actions">
                                            <button type="button" className="cancel-btn" onClick={() => setShowAddVehicle(false)}>Cancel</button>
                                            <button type="submit" className="submit-btn">Register Vehicle</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <VehicleTable vehicles={registeredVehicles} showDepartment expanded />
                        </section>
                    )}

                    {activeView === 'parking' && (
                        <section className="full-section">
                            <div className="section-header">
                                <h2>Parking Zone Management</h2>
                            </div>
                            <ParkingZones zones={parkingZones} />
                        </section>
                    )}

                    {activeView === 'reports' && (
                        <section className="full-section">
                            <div className="section-header">
                                <h2>Analytics Dashboard</h2>
                            </div>
                            <div className="analytics-grid">
                                <div className="chart-card">
                                    <h3>Daily Entry/Exit Trends</h3>
                                    <div className="chart-placeholder">
                                        <div className="bar-chart">
                                            {[40, 65, 95, 100, 85, 60, 45, 55, 75, 90, 70, 35].map((h, i) => (
                                                <div key={i} className="bar" style={{ height: `${h}%` }}>
                                                    <span className="bar-label">{['6', '7', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5'][i]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="chart-card">
                                    <h3>Vehicle Distribution</h3>
                                    <div className="donut-stats">
                                        <div className="donut-ring">
                                            <svg viewBox="0 0 36 36">
                                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border-color)" strokeWidth="3" />
                                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--accent)" strokeWidth="3" strokeDasharray="57 43" strokeLinecap="round" />
                                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="25 75" strokeDashoffset="-57" strokeLinecap="round" />
                                            </svg>
                                            <span className="donut-center">{registeredVehicles.length}</span>
                                        </div>
                                        <div className="donut-legend">
                                            <div className="legend-item"><span className="dot accent"></span> Staff ({registeredVehicles.filter(v => v.type === 'Staff').length})</div>
                                            <div className="legend-item"><span className="dot success"></span> Students ({registeredVehicles.filter(v => v.type === 'Student').length})</div>
                                            <div className="legend-item"><span className="dot light"></span> Others ({registeredVehicles.filter(v => !['Staff', 'Student'].includes(v.type)).length})</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeView === 'settings' && (
                        <section className="full-section">
                            <div className="section-header">
                                <h2>System Settings</h2>
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
                                            <span className="setting-label">New Vehicle Alerts</span>
                                            <span className="setting-desc">Get notified when new vehicles are registered</span>
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

export default AdminDashboard
