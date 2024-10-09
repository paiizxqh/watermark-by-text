import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import BlackCat from '../img/black-cat.gif';

const Header = ({ onLogout }) => { // Accepting onLogout as a prop
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <img src={BlackCat} alt="Black Cat" className="cat-gif" />
        <Link className="navbar-brand" to="/home">Welcome Meow!</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="#about-me">About Me</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/upload">Create Post</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Account
              </Link>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" to="/" onClick={onLogout}>Log Out</Link> {/* Using onLogout */}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
