import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ currentUser, onLogout }) {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <span className="logo-icon">🍽️</span>
                    <span className="logo-text">FoodShare</span>
                </Link>

                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/browse" className="nav-link">Browse Donations</Link>
                    </li>
                    {currentUser && (
                        <>
                            <li className="nav-item">
                                <Link to="/donate" className="nav-link">Donate Food</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            </li>
                        </>
                    )}
                </ul>

                <div className="nav-actions">
                    {currentUser ? (
                        <div className="user-info">
                            <span className="user-name">👋 {currentUser.name}</span>
                            <button onClick={onLogout} className="btn btn-outline">Logout</button>
                        </div>
                    ) : (
                        <span className="login-prompt">Please login on Home page</span>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
