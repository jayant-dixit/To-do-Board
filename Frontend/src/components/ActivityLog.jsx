import { useContext, useEffect, useState } from "react";
import api from '../services/api'
import {MyContext} from '../App'

const ActivityLog = ({ activities, onClose }) => {
    const [activityLogs, setActivityLogs] = useState([])
    const {boardName} = useContext(MyContext)
    const getActivityIcon = (type) => {
        switch (type) {
            case 'create': return '✨';
            case 'update': return '✏️';
            case 'delete': return '🗑️';
            case 'move': return '🔄';
            default: return '📝';
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'create': return '#10B981';
            case 'update': return '#3B82F6';
            case 'delete': return '#EF4444';
            case 'move': return '#8B5CF6';
            default: return '#6B7280';
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };


    useEffect(()=>{
        async function fetchLogs() {
            try {
                const response = await api.get(`/api/board/activitylogs/${boardName}`)

                console.log(response.data)
                setActivityLogs(response.data.activityLogs)
            } catch (error) {
                console.log("Error fetching logs: ", error)
            }
        }

        fetchLogs()
    }, [])

    return (
        <div className="activity-log-dropdown">
            <div className="activity-header">
                <h3>Activity Log</h3>
                <button className="close-activity-btn" onClick={onClose}>✕</button>
            </div>

            <div className="activity-list">
                {activities.length === 0 ? (
                    <div className="no-activities">
                        <span className="no-activities-icon">📝</span>
                        <p>No activities yet</p>
                    </div>
                ) : (
                    activities.map(activity => (
                        <div key={activity.id} className="activity-item">
                            <div
                                className="activity-icon"
                                style={{ color: getActivityColor(activity.type) }}
                            >
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="activity-content">
                                <p className="activity-message">{activity.message}</p>
                                <span className="activity-time">{formatTime(activity.timestamp)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ActivityLog;
