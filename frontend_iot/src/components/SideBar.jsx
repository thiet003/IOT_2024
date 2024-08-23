import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaBoxOpen, FaBlogger } from 'react-icons/fa';
import { useSidebar } from '../contexts/SidebarContext';
import '../css/SideBar.css';

const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar, activeItem, setActive } = useSidebar();

    return (
        <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            
            <div className="sidebar-logo">
                <p>Admin Page</p>
            </div>
            <div className="sidebar-user">
                <img src="/img/avatar.png" alt="User" className="user-avatar" />
                <span className="user-name">Vũ Đình Thiết</span>
            </div>
            <Link
                to="/"
                className={`sidebar-item ${activeItem === 'Dashboard' ? 'active' : ''}`}
                onClick={() => setActive('Dashboard')}
            >
                <FaTachometerAlt className="sidebar-icon" />
                <span>Dashboard</span>
            </Link>
            <Link
                to="/profile"
                className={`sidebar-item ${activeItem === 'Profile' ? 'active' : ''}`}
                onClick={() => setActive('Profile')}
            >
                <FaUser className="sidebar-icon" />
                <span>Profile</span>
            </Link>
            <Link
                to="/data-sensor"
                className={`sidebar-item ${activeItem === 'Data Sensor' ? 'active' : ''}`}
                onClick={() => setActive('Data Sensor')}
            >
                <FaBoxOpen className="sidebar-icon" />
                <span>Data Sensor</span>
            </Link>
            <Link
                to="/history-action"
                className={`sidebar-item ${activeItem === 'Action History' ? 'active' : ''}`}
                onClick={() => setActive('Action History')}
            >
                <FaBlogger className="sidebar-icon" />
                <span>Action History</span>
            </Link>
        </div>
    );
};

export default Sidebar;
