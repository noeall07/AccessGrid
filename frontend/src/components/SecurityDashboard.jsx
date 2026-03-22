import { useState, useEffect } from 'react'
import { getVehicleByPlate, recordEntry, recordExit, getEntryLogs, getParkingZones, getStats } from '../api/api'
import Sidebar from './Sidebar'
import StatsCard from './StatsCard'
import VehicleTable from './VehicleTable'
import ActivityFeed from './ActivityFeed'
import ParkingZones from './ParkingZones'
import './Dashboard.css'
import { detectPlate } from '../api/api';



const SecurityDashboard = ({ user, onLogout, theme, toggleTheme }) => {
    const [activeView, setActiveView] = useState('overview')
    const [showScanModal, setShowScanModal] = useState(false)
    const [scannedPlate, setScannedPlate] = useState('')
    const [scanResult, setScanResult] = useState(null)
    const [stats, setStats] = useState([])
    const [recentScans, setRecentScans] = useState([])
    const [activities, setActivities] = useState([])
    const [parkingZones, setParkingZones] = useState([])
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const plate = await detectPlate(file);
        setScannedPlate(plate);
    };

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [statsRes, logsRes, zonesRes] = await Promise.all([
                getStats('security'),
                getEntryLogs({ limit: 20 }),
                getParkingZones(),
            ])
            setStats(statsRes.data)
            setParkingZones(zonesRes.data)

            // Transform logs into scan-like items for the table
            const logItems = logsRes.data.map((log, i) => ({
                id: `S${String(i + 1).padStart(3, '0')}`,
                plate: log.plate,
                type: log.vehicleId ? 'Registered' : 'Unknown',
                owner: log.owner || '-',
                status: log.action === 'entry' ? 'inside' : 'exited',
                time: new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                verified: !!log.vehicleId,
            }))
            setRecentScans(logItems)

            // Build activity feed from logs
            const activityItems = logsRes.data.slice(0, 5).map((log, i) => ({
                id: i + 1,
                type: log.action,
                message: `Vehicle ${log.plate} ${log.action === 'entry' ? 'entered' : 'exited'} ${log.gate || 'Main Gate'}`,
                time: formatTimeAgo(new Date(log.timestamp)),
                icon: log.action,
            }))
            setActivities(activityItems)
        } catch (err) {
            console.error('Failed to fetch data:', err)
        }
    }

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000)
        if (seconds < 60) return 'Just now'
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes} min ago`
        const hours = Math.floor(minutes / 60)
        return `${hours}h ago`
    }

    const handleScan = async () => {
        if (!scannedPlate) return
        try {
            const res = await getVehicleByPlate(scannedPlate)
            setScanResult({ ...res.data, registered: true, status: 'verified' })
        } catch {
            // Vehicle not found → unregistered
            setScanResult({
                plate: scannedPlate,
                type: 'Unknown',
                owner: 'Not Found',
                registered: false,
                status: 'unregistered',
            })
        }
    }

    const handleAllowEntry = async () => {
        try {
            await recordEntry({
                plate: scannedPlate,
                type: scanResult?.type || 'Visitor',
                owner: scanResult?.owner || 'Guest',
                gate: 'Main Gate',
                manual: true,
            })
            setShowScanModal(false)
            setScannedPlate('')
            setScanResult(null)
            // Refresh data
            fetchData()
        } catch (err) {
            console.error('Failed to record entry:', err)
            alert(err.response?.data?.error || 'Failed to record entry')
        }
    }

    const menuItems = [
        { id: 'overview', label: 'Gate Control', icon: 'grid' },
        { id: 'scan', label: 'Scan Vehicle', icon: 'scan' },
        { id: 'parking', label: 'Parking Status', icon: 'parking' },
        { id: 'logs', label: 'Entry Logs', icon: 'chart' },
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
                sidebarOpen={sidebarOpen}
            />

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            {activeView === 'overview' && 'Gate Control'}
                            {activeView === 'scan' && 'Vehicle Scanner'}
                            {activeView === 'parking' && 'Parking Status'}
                            {activeView === 'logs' && 'Entry Logs'}
                            {activeView === 'settings' && 'Settings'}
                        </h1>
                        <p className="page-subtitle">
                            Welcome, {user.name} · Security Staff
                        </p>
                    </div>
                    <div className="header-right">
                        <button className="scan-btn" onClick={() => setShowScanModal(true)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Quick Scan
                        </button>
                        <div className="user-avatar security">
                            <span>SC</span>
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
                                        <h2>Recent Scans</h2>
                                        <span className="live-badge">
                                            <span className="live-dot"></span>
                                            Live
                                        </span>
                                    </div>
                                    <VehicleTable vehicles={recentScans} showVerified />
                                </section>

                                <section className="activity-section">
                                    <div className="section-header">
                                        <h2>Activity Log</h2>
                                    </div>
                                    <ActivityFeed activities={activities} />
                                </section>
                            </div>
                        </>
                    )}

                    {activeView === 'scan' && (
                        <section className="full-section">
                            <div className="scanner-container">
                                <div className="scanner-box">
                                    <div className="scanner-frame">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p>Camera Feed</p>
                                        <span className="scanner-hint">Point camera at number plate</span>
                                    </div>
                                </div>
                                <div className="scanner-controls">
                                    <h3>Manual Entry</h3>
                                    <div className="scan-input-group">
                                        <input
                                            type="text"
                                            placeholder="Enter plate number (e.g., KL-07-AB-1234)"
                                            value={scannedPlate}
                                            onChange={(e) => setScannedPlate(e.target.value.toUpperCase())}
                                        />
                                        <button className="scan-action-btn" onClick={handleScan}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="11" cy="11" r="8" />
                                                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                                            </svg>
                                            Search
                                        </button>
                                    </div>

                                    {scanResult && (
                                        <div className={`scan-result ${scanResult.status}`}>
                                            <div className="result-header">
                                                {scanResult.registered ? (
                                                    <svg className="result-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" />
                                                        <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                ) : (
                                                    <svg className="result-icon warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                                                        <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                                                    </svg>
                                                )}
                                                <h4>{scanResult.registered ? 'Vehicle Registered' : 'Vehicle Not Registered'}</h4>
                                            </div>
                                            <div className="result-details">
                                                <div className="detail-row">
                                                    <span>Plate:</span>
                                                    <code>{scanResult.plate}</code>
                                                </div>
                                                <div className="detail-row">
                                                    <span>Type:</span>
                                                    <span>{scanResult.type}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span>Owner:</span>
                                                    <span>{scanResult.owner}</span>
                                                </div>
                                            </div>
                                            <div className="result-actions">
                                                <button className="allow-btn" onClick={handleAllowEntry}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    Allow Entry
                                                </button>
                                                <button className="deny-btn" onClick={() => { setScannedPlate(''); setScanResult(null) }}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                                                        <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                                                    </svg>
                                                    Deny
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {activeView === 'parking' && (
                        <section className="full-section">
                            <div className="section-header">
                                <h2>Real-time Parking Status</h2>
                            </div>
                            <ParkingZones zones={parkingZones} />
                        </section>
                    )}

                    {activeView === 'logs' && (
                        <section className="full-section">
                            <div className="section-header">
                                <h2>Today's Entry Logs</h2>
                                <div className="filter-group">
                                    <button className="filter-btn active">All</button>
                                    <button className="filter-btn">Entries</button>
                                    <button className="filter-btn">Exits</button>
                                    <button className="filter-btn">Pending</button>
                                </div>
                            </div>
                            <VehicleTable vehicles={recentScans} showVerified expanded />
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
                                    <h3>Scanner</h3>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Auto-Scan Mode</span>
                                            <span className="setting-desc">Automatically detect and scan plates</span>
                                        </div>
                                        <button className="toggle-switch active">
                                            <span className="toggle-knob"></span>
                                        </button>
                                    </div>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <span className="setting-label">Sound Alerts</span>
                                            <span className="setting-desc">Play sound for unregistered vehicles</span>
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

            {showScanModal && (
                <div className="modal-overlay" onClick={() => setShowScanModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Quick Vehicle Scan</h3>
                        <div className="scan-input-group">
                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                            <input
                                type="text"
                                placeholder="Enter plate number"
                                value={scannedPlate}
                                onChange={(e) => setScannedPlate(e.target.value.toUpperCase())}
                                autoFocus
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setShowScanModal(false)}>Cancel</button>
                            <button className="submit-btn" onClick={() => { handleScan(); setShowScanModal(false); setActiveView('scan') }}>Scan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SecurityDashboard
