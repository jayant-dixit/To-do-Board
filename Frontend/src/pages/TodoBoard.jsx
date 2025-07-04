
import React, { useState, useEffect } from 'react';
import UserMenu from '../components/UserMenu';
import CreateTaskModal from '../components/CreatetaskModal';
import ActivityLog from '../components/ActivityLog';
import TaskCard from '../components/TaskCard';
import '../styles/TodoBoard.css';

const TodoBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [activities, setActivities] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
    const [currentUser] = useState('John Doe'); // Mock current user

    const addActivity = (message, type) => {
        const newActivity = {
            id: Date.now().toString(),
            message,
            timestamp: new Date(),
            type
        };
        setActivities(prev => [newActivity, ...prev]);
    };

    const createTask = (taskData) => {
        const newTask = {
            ...taskData,
            id: Date.now().toString(),
            createdAt: new Date(),
            timestamp: new Date()
        };
        setTasks(prev => [...prev, newTask]);
        addActivity(`Created task: ${newTask.title}`, 'create');
    };

    const updateTask = (id, updates) => {
        setTasks(prev => prev.map(task => {
            if (task.id === id) {
                const updatedTask = { ...task, ...updates, timestamp: new Date() };
                if (updates.status && updates.status !== task.status) {
                    addActivity(`Moved "${task.title}" to ${updates.status}`, 'move');
                } else {
                    addActivity(`Updated task: ${task.title}`, 'update');
                }
                return updatedTask;
            }
            return task;
        }));
    };

    const deleteTask = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            setTasks(prev => prev.filter(t => t.id !== id));
            addActivity(`Deleted task: ${task.title}`, 'delete');
        }
    };

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('text/plain', taskId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, status) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        updateTask(taskId, { status });
    };

    return (
        <div className="todo-board">
            <header className="board-header">
                <h1 className="board-title">Todo Board</h1>
                <div className="header-actions">
                    <button
                        className="activity-log-btn"
                        onClick={() => setIsActivityLogOpen(!isActivityLogOpen)}
                    >
                        📊 Activity Log ({activities.length})
                    </button>
                    <button
                        className="create-task-btn"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        + Create New Task
                    </button>
                    <UserMenu currentUser={currentUser} />
                </div>
            </header>

            <div className="board-container">
                <div className="board-columns">
                    <div
                        className="column todo-column"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'todo')}
                    >
                        <div className="column-header">
                            <h2>To Do</h2>
                            <span className="task-count">{getTasksByStatus('todo').length}</span>
                        </div>
                        <div className="tasks-container">
                            {getTasksByStatus('todo').map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onUpdate={updateTask}
                                    onDelete={deleteTask}
                                    onDragStart={handleDragStart}
                                />
                            ))}
                        </div>
                    </div>

                    <div
                        className="column inprogress-column"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'inprogress')}
                    >
                        <div className="column-header">
                            <h2>In Progress</h2>
                            <span className="task-count">{getTasksByStatus('inprogress').length}</span>
                        </div>
                        <div className="tasks-container">
                            {getTasksByStatus('inprogress').map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onUpdate={updateTask}
                                    onDelete={deleteTask}
                                    onDragStart={handleDragStart}
                                />
                            ))}
                        </div>
                    </div>

                    <div
                        className="column done-column"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'done')}
                    >
                        <div className="column-header">
                            <h2>Done</h2>
                            <span className="task-count">{getTasksByStatus('done').length}</span>
                        </div>
                        <div className="tasks-container">
                            {getTasksByStatus('done').map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onUpdate={updateTask}
                                    onDelete={deleteTask}
                                    onDragStart={handleDragStart}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {isActivityLogOpen && (
                    <ActivityLog
                        activities={activities}
                        onClose={() => setIsActivityLogOpen(false)}
                    />
                )}
            </div>

            {isCreateModalOpen && (
                <CreateTaskModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={createTask}
                />
            )}
        </div>
    );
};

export default TodoBoard;
