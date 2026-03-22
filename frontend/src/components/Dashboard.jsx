import { useState } from 'react'
import Sidebar from './Sidebar'
import StatsCard from './StatsCard'
import VehicleTable from './VehicleTable'
import ActivityFeed from './ActivityFeed'
import './Dashboard.css'

const Dashboard = ({ onLogout, theme, toggleTheme }) => {
    const [activeView, setActiveView] = useState('overview')

    const stats = [
        {
            title: 'Active Vehicles',
            value: '47',
            change: '+12%',
            trend: 'up',
            icon: 'car'
        },
        {
            title: 'Students In Campus',
            value: '1,234',
            change: '+8%',
            trend: 'up',
            icon: 'users'
        },
        {
            title: 'Late Entries Today',
            value: '23',
            change: '-5%',
            trend: 'down',
            icon: 'clock'
        },
        {
            title: 'Pending Approvals',
            value: '8',
            change: '0',
            trend: 'neutral',
            icon: 'alert'
        }
    ]

    const vehicles = [
        { id: 'V001', plate: 'KL-07-AB-1234', type: 'Staff', owner: 'Dr. Rajesh Kumar', status: 'inside', time: '08:15 AM' },
        { id: 'V002', plate: 'KL-07-CD-5678', type: 'Student', owner: 'Arun Menon', status: 'inside', time: '08:32 AM' },
        { id: 'V003', plate: 'KL-10-EF-9012', type: 'Taxi', owner: '-', status: 'pending', time: '09:45 AM' },
        { id: 'V004', plate: 'KL-07-GH-3456', type: 'Bus', owner: 'Route 5', status: 'inside', time: '07:50 AM' },
        { id: 'V005', plate: 'KL-08-IJ-7890', type: 'Staff', owner: 'Prof. Sarah John', status: 'exited', time: '11:30 AM' },
        { id: 'V006', plate: 'KL-07-KL-2345', type: 'Student', owner: 'Priya Nair', status: 'inside', time: '08:55 AM' },
        { id: 'V007', plate: 'KL-09-MN-6789', type: 'Visitor', owner: 'Guest', status: 'pending', time: '10:15 AM' },
        { id: 'V008', plate: 'KL-07-OP-0123', type: 'Staff', owner: 'Dr. Meena Pillai', status: 'inside', time: '08:10 AM' },
    ]

    const activities = [
        { id: 1, type: 'entry', message: 'Vehicle KL-07-AB-1234 entered North Gate', time: '2 min ago', icon: 'entry' },
        { id: 2, type: 'scan', message: 'Number plate scanned: KL-10-EF-9012', time: '5 min ago', icon: 'scan' },
        { id: 3, type: 'alert', message: 'Late entry recorded for Arun Menon', time: '12 min ago', icon: 'alert' },
        { id: 4, type: 'exit', message: 'Vehicle KL-08-IJ-7890 exited South Gate', time: '18 min ago', icon: 'exit' },
        { id: 5, type: 'approval', message: 'Taxi approved for campus entry', time: '25 min ago', icon: 'check' },
        { id: 6, type: 'entry', message: 'College bus Route 5 entered', time: '45 min ago', icon: 'entry' },
    ]

    return (
        <div className="dashboard">
            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                onLogout={onLogout}
                theme={theme}
                toggleTheme={toggleTheme}
            />

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            {activeView === 'overview' && 'Dashboard Overview'}
                            {activeView === 'vehicles' && 'Vehicle Management'}
                            {activeView === 'students' && 'Student Tracking'}
                            {activeView === 'analytics' && 'Analytics & Reports'}
                            {activeView === 'settings' && 'Settings'}
                        </h1>
                        <p className="page-subtitle">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="header-right">
                        <div className="search-box">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                            </svg>
                            <input type="text" placeholder="Search vehicles, students..." />
                        </div>
                        <button className="notification-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="notification-badge">3</span>
                        </button>
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
                                        <h2>Active Vehicles</h2>
                                        <button className="view-all-btn">
                                            View All
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                    <VehicleTable vehicles={vehicles} />
                                </section>

                                <section className="activity-section">
                                    <div className="section-header">
                                        <h2>Recent Activity</h2>
                                        <span className="live-badge">
                                            <span className="live-dot"></span>
                                            Live
                                        </span>
                                    </div>
                                    <ActivityFeed activities={activities} />
                                </section>
                            </div>
                        </>
                    )}

                    {activeView === 'vehicles' && (
                        <section className="full-section">
                            <div className="section-header">
                                <h2>All Vehicles</h2>
                                <div className="filter-group">
                                    <button className="filter-btn active">All</button>
                                    <button className="filter-btn">Staff</button>
                                    <button className="filter-btn">Student</button>
                                    <button className="filter-btn">Visitor</button>
                                </div>
                            </div>
                            <VehicleTable vehicles={vehicles} expanded />
                        </section>
                    )}

                    {activeView === 'students' && (
                        <section className="full-section">
                            <div className="section-header">
                                <h2>Student Movement Log</h2>
                            </div>
                            <div className="placeholder-content">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <h3>Student Tracking</h3>
                                <p>Real-time student entry/exit monitoring and late entry management</p>
                            </div>
                        </section>
                    )}

                    {activeView === 'analytics' && (
                        <section className="full-section">
                            <div className="section-header">
                                <h2>Analytics Dashboard</h2>
                            </div>
                            <div className="analytics-grid">
                                <div className="chart-card">
                                    <h3>Peak Hours Analysis</h3>
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
                                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--accent)" strokeWidth="3" strokeDasharray="45 55" strokeLinecap="round" />
                                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--text-muted)" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="-45" strokeLinecap="round" />
                                            </svg>
                                            <span className="donut-center">47</span>
                                        </div>
                                        <div className="donut-legend">
                                            <div className="legend-item"><span className="dot accent"></span> Staff (45%)</div>
                                            <div className="legend-item"><span className="dot muted"></span> Students (30%)</div>
                                            <div className="legend-item"><span className="dot light"></span> Others (25%)</div>
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
                                            <span className="setting-label">Late Entry Alerts</span>
                                            <span className="setting-desc">Get notified for late student entries</span>
                                        </div>
                                        <button className="toggle-switch active">
                                            <span className="toggle-knob"></span>
                                        </button>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Vehicle Scan Notifications</span>
                                            <span className="setting-desc">Alerts for unregistered vehicles</span>
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

export default Dashboard
