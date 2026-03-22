import './ParkingZones.css'

const ParkingZones = ({ zones, compact, showRestricted, studentZone }) => {
    const totalCapacity = zones.reduce((sum, zone) => sum + zone.capacity, 0)
    const totalOccupied = zones.reduce((sum, zone) => sum + zone.occupied, 0)

    return (
        <div className={`parking-zones ${compact ? 'compact' : ''}`}>
            {!compact && (
                <div className="parking-summary">
                    <div className="summary-stat">
                        <span className="summary-value">{totalOccupied}</span>
                        <span className="summary-label">Vehicles Parked</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-stat">
                        <span className="summary-value">{totalCapacity - totalOccupied}</span>
                        <span className="summary-label">Available Spots</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-stat">
                        <span className="summary-value">{Math.round((totalOccupied / totalCapacity) * 100)}%</span>
                        <span className="summary-label">Capacity Used</span>
                    </div>
                </div>
            )}

            <div className="zones-grid">
                {zones.map((zone) => {
                    const percentage = Math.round((zone.occupied / zone.capacity) * 100)
                    const isStudentZone = studentZone === zone.id
                    const available = zone.capacity - zone.occupied

                    return (
                        <div
                            key={zone.id}
                            className={`zone-card ${isStudentZone ? 'highlight' : ''} ${zone.restricted && showRestricted ? 'restricted' : ''}`}
                        >
                            <div className="zone-header">
                                <div className="zone-id" style={{ background: zone.color }}>
                                    {zone.id}
                                </div>
                                <div className="zone-info">
                                    <span className="zone-name">{zone.name}</span>
                                    <span className="zone-label">{zone.label}</span>
                                </div>
                                {isStudentZone && (
                                    <span className="your-zone-badge">Your Zone</span>
                                )}
                                {zone.restricted && showRestricted && (
                                    <span className="restricted-badge">Restricted</span>
                                )}
                            </div>

                            <div className="zone-stats">
                                <div className="zone-progress">
                                    <div
                                        className="zone-progress-bar"
                                        style={{
                                            width: `${percentage}%`,
                                            background: percentage > 80 ? '#ef4444' : percentage > 60 ? '#f59e0b' : zone.color
                                        }}
                                    ></div>
                                </div>
                                <div className="zone-numbers">
                                    <span className="occupied">{zone.occupied} occupied</span>
                                    <span className="available">{available} available</span>
                                </div>
                            </div>

                            <div className="zone-capacity">
                                <span className="capacity-text">
                                    <strong>{percentage}%</strong> of {zone.capacity} spots
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ParkingZones
