
import React, { useState } from 'react';

const TaskCard = ({ task, onUpdate, onDelete, onDragStart }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    assignedUser: task.assignedUser,
    priority: task.priority
  });

  const priorityColors = {
    Low: '#10B981',
    Medium: '#F59E0B',
    High: '#EF4444'
  };

  const handleEdit = () => {
    if (isEditing) {
      onUpdate(task.id, editData);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description,
      assignedUser: task.assignedUser,
      priority: task.priority
    });
    setIsEditing(false);
  };

  const formatTimestamp = (date) => {
    return date.toLocaleString();
  };

  return (
    <div 
      className="task-card"
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
    >
      <div className="task-header">
        <div 
          className="priority-indicator"
          style={{ backgroundColor: priorityColors[task.priority] }}
        >
          {task.priority?.toUpperCase()}
        </div>
        <div className="task-actions">
          <button 
            className="edit-btn"
            onClick={handleEdit}
          >
            {isEditing ? '✓' : '✏️'}
          </button>
          {isEditing && (
            <button 
              className="cancel-btn"
              onClick={handleCancel}
            >
              ✕
            </button>
          )}
          <button 
            className="delete-btn"
            onClick={() => onDelete(task.id)}
          >
            🗑️
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
            className="edit-title"
            placeholder="Task title"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({...editData, description: e.target.value})}
            className="edit-description"
            placeholder="Task description"
            rows={3}
          />
          <input
            type="text"
            value={editData.assignedUser}
            onChange={(e) => setEditData({...editData, assignedUser: e.target.value})}
            className="edit-user"
            placeholder="Assigned user"
          />
          <select
            value={editData.priority}
            onChange={(e) => setEditData({...editData, priority: e.target.value})}
            className="edit-priority"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
      ) : (
        <div className="task-content">
          <h3 className="task-title">{task.title}</h3>
          <p className="task-description">{task.description}</p>
          <div className="task-meta">
            <div className="assigned-user">
              <span className="user-icon">👤</span>
              {task.assignedUser.name}
            </div>
            <div className="task-status">{task.status.replace('inprogress', 'In Progress')}</div>
          </div>
          <div className="task-timestamp">
            <span className="timestamp-icon">🕒</span>
            <span className="timestamp-text">{formatTimestamp(task.createdAt.split('T'))}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
