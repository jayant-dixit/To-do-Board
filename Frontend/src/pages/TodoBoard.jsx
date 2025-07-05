
import React, { useState, useEffect, useContext } from 'react';
import UserMenu from '../components/UserMenu';
import CreateTaskModal from '../components/CreatetaskModal';
import ActivityLog from '../components/ActivityLog';
import TaskCard from '../components/TaskCard';
import '../styles/TodoBoard.css';
import api from '../services/api';
import { MyContext } from '../App';

const TodoBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [activities, setActivities] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
    const [currentUser] = useState('John Doe'); // Mock current user
    const { boardName } = useContext(MyContext)


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

    const updateTask = async (title, updates) => {
        try {
            const response = await api.put("/api/task/edittask", {...updates, title, boardName});

            // console.log(response)
        } catch (error) {
            console.log("Eror while editing: ", error)
        }
        setTasks(prev => prev.map(task => {
            if (task.title === title) {
                const updatedTask = { ...task, ...updates, timestamp: new Date() };
                return updatedTask;
            }
            return task;
        }));
    };

    const deleteTask = async (title) => {
        const task = tasks.find(t => t.title === title);
        if (task) {
            setTasks(prev => prev.filter(t => t.title !== title));
        }
        try {
            const response = await api.delete(`/api/task/deletetask?title${title}&boardName=${boardName}`)

            if (response.data.success) {
                const task = tasks.find(t => t.title === title);
                if (task) {
                    setTasks(prev => prev.filter(t => t.title !== title));
                }
            }
        } catch (error) {
            console.log("error while deleting task: ", error);
        }
    };

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    const handleDragStart = (e, title) => {
        e.dataTransfer.setData('text/plain', title);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, status) => {
        e.preventDefault();
        const title = e.dataTransfer.getData('text/plain');
        updateTask(title, { status });
    };

    useEffect(() => {

        async function fetchTasks() {
            try {
                const response = await api.get("/api/task/gettasks");

                if (response.data.success) {
                    const existingTasks = response.data?.tasks;
                    setTasks(existingTasks)
                }

                // console.log(response.data.tasks)

            } catch (error) {
                console.log(error.response);
            }
        }

        fetchTasks()
    }, [])

    return (
        <div className="todo-board">
            <header className="board-header">
                <h1 className="board-title">Todo Board</h1>
                <div className="header-actions">
                    <button
                        className="activity-log-btn"
                        onClick={() => setIsActivityLogOpen(!isActivityLogOpen)}
                    >
                        📊 Activity Log
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
                            {tasks.filter((task) => task.status == "todo").map(task => (
                                <TaskCard
                                    key={task._id}
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
                        onDrop={(e) => handleDrop(e, 'in-progress')}
                    >
                        <div className="column-header">
                            <h2>In Progress</h2>
                            <span className="task-count">{getTasksByStatus('in-progress').length}</span>
                        </div>
                        <div className="tasks-container">
                            {tasks.filter((task) => task.status == "in-progress").map(task => (
                                <TaskCard
                                    key={task._id}
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
                            {tasks.filter((task) => task.status == "done").map(task => (
                                <TaskCard
                                    key={task._id}
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
