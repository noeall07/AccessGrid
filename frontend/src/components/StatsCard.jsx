import './StatsCard.css'

const StatsCard = ({ title, value, change, trend, icon }) => {
    const getIcon = () => {
        switch (icon) {
            case 'car':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 17h14v-6l-2-4H7l-2 4v6z" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="7.5" cy="17" r="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="16.5" cy="17" r="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 11l2-4h10l2 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            case 'users':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            case 'clock':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            case 'alert':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            case 'parking':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 17V7h4a3 3 0 010 6H9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            case 'entry':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="9 10 4 15 9 20" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20 4v7a4 4 0 01-4 4H4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            case 'exit':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="15 10 20 15 15 20" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 4v7a4 4 0 004 4h12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            case 'check':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" />
                        <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            default:
                return null
        }
    }

    return (
        <div className="stats-card">
            <div className="stats-icon">
                {getIcon()}
            </div>
            <div className="stats-content">
                <span className="stats-title">{title}</span>
                <div className="stats-value-row">
                    <span className="stats-value">{value}</span>
                    {change && change !== '0' && change !== '' && (
                        <span className={`stats-change ${trend}`}>
                            {trend === 'up' && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="18 15 12 9 6 15" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                            {trend === 'down' && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                            {change}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StatsCard
