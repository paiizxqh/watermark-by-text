import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import '../css/Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <div className="sidebar bg-light d-flex flex-column align-items-center">
        <div className="sidebar-header text-center py-4 primary-text fs-4 fw-bold text-uppercase">
          <i className="fi fi-br-menu-burger" alt="logo"></i> 
        </div>
        <div className="list-group list-group-flush w-100">
          <Link to="/home" className="list-group-item list-group-item-action bg-transparent text-center sidebar-item">
            <i className="fi fi-rr-home"></i> Home
          </Link>
          <Link to="/profile" className="list-group-item list-group-item-action bg-transparent text-center sidebar-item">
            <i className="fi fi-rr-user"></i> Profile
          </Link>
          <Link to="/posts" className="list-group-item list-group-item-action bg-transparent text-center sidebar-item">
            <i className="fi fi-rr-edit"></i> Post
          </Link>
          <button 
            className="list-group-item list-group-item-action bg-transparent text-center sidebar-item"
            onClick={handleLogout}
          >
            <i className="fi fi-rr-exit"></i> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;