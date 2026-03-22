import './ActivityFeed.css'

const ActivityFeed = ({ activities }) => {
    const getIcon = (icon) => {
        switch (icon) {
            case 'entry':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 10 4 15 9 20" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20 4v7a4 4 0 01-4 4H4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            case 'exit':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 10 20 15 15 20" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 4v7a4 4 0 004 4h12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            case 'scan':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            case 'alert':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            case 'check':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )
            default:
                return null
        }
    }

    return (
        <div className="activity-feed">
            {activities.map((activity) => (
                <div key={activity.id} className={`activity-item ${activity.type}`}>
                    <div className={`activity-icon ${activity.type}`}>
                        {getIcon(activity.icon)}
                    </div>
                    <div className="activity-content">
                        <p className="activity-message">{activity.message}</p>
                        <span className="activity-time">{activity.time}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ActivityFeed
