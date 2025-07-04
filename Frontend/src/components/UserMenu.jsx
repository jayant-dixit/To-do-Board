
import React, { useState, useRef, useEffect } from 'react';

const UserMenu = ({ currentUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="user-menu" ref={menuRef}>
            <button
                className="user-icon-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="user-avatar">
                    {currentUser.charAt(0).toUpperCase()}
                </div>
            </button>

            {isOpen && (
                <div className="user-dropdown">
                    <div className="user-info">
                        <div className="user-avatar-large">
                            {currentUser.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{currentUser}</span>
                            <span className="user-email">john.doe@example.com</span>
                        </div>
                    </div>
                    <div className="menu-divider"></div>
                    <ul className="menu-items">
                        <li><a href="#profile">👤 Profile</a></li>
                        <li><a href="#settings">⚙️ Settings</a></li>
                        <li><a href="#notifications">🔔 Notifications</a></li>
                        <li><a href="#help">❓ Help</a></li>
                        <li className="menu-divider"></li>
                        <li><a href="#logout" className="logout-item">🚪 Logout</a></li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
