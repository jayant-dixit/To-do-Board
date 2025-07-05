import { useContext, useEffect, useState } from "react";
import api from '../services/api'
import {MyContext} from '../App'

const ActivityLog = ({ activities, onClose }) => {
    const [activityLogs, setActivityLogs] = useState([])
    const {boardName} = useContext(MyContext)

    const formatTime = (date) => {

        const nd = new Date(date)
        return nd.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }, { hour: '2-digit', minute: '2-digit' });
    };


    useEffect(()=>{
        async function fetchLogs() {
            try {
                const response = await api.get(`/api/board/activitylogs/${boardName}`)

                setActivityLogs([...response.data.activityLogs.activityLogs].reverse())
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
                {activityLogs.length === 0 ? (
                    <div className="no-activities">
                        <span className="no-activities-icon">📝</span>
                        <p>No activities yet</p>
                    </div>
                ) : (
                    activityLogs.map(activity => (
                        <div key={activity._id} className="activity-item">
                            <div className="activity-content">
                                <p className="activity-message">{activity.action}</p>
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
