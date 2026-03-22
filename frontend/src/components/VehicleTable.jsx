import './VehicleTable.css'


const VehicleTable = ({ vehicles, expanded, showDepartment, showVerified }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'inside':
                return <span className="status-badge inside">Inside</span>
            case 'exited':
                return <span className="status-badge exited">Exited</span>
            case 'pending':
                return <span className="status-badge pending">Pending</span>
            case 'active':
                return <span className="status-badge active">Active</span>
            case 'inactive':
                return <span className="status-badge inactive">Inactive</span>
            default:
                return null
        }
    }

    const getTypeBadge = (type) => {
        return <span className={`type-badge ${type.toLowerCase()}`}>{type}</span>
    }

    return (
        <div className={`vehicle-table-wrapper ${expanded ? 'expanded' : ''}`}>
            <table className="vehicle-table">
                <thead>
                    <tr>
                        <th>Plate Number</th>
                        <th>Type</th>
                        <th>Owner</th>
                        {showDepartment && <th>Department</th>}
                        <th>Status</th>
                        {!showDepartment && <th>Time</th>}
                        {showVerified && <th>Verified</th>}
                        {expanded && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map((vehicle) => (
                        <tr key={vehicle.id}>
                            <td className="plate-cell">
                                <code>{vehicle.plate}</code>
                            </td>
                            <td>{getTypeBadge(vehicle.type)}</td>
                            <td>{vehicle.owner}</td>
                            {showDepartment && <td className="dept-cell">{vehicle.department}</td>}
                            <td>{getStatusBadge(vehicle.status)}</td>
                            {!showDepartment && <td className="time-cell">{vehicle.time}</td>}
                            {showVerified && (
                                <td>
                                    {vehicle.verified ? (
                                        <span className="verified-badge yes">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                    ) : (
                                        <span className="verified-badge no">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                                                <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                                            </svg>
                                        </span>
                                    )}
                                </td>
                            )}
                            {expanded && (
                                <td>
                                    <button className="action-btn">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="1" />
                                            <circle cx="19" cy="12" r="1" />
                                            <circle cx="5" cy="12" r="1" />
                                        </svg>
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default VehicleTable
