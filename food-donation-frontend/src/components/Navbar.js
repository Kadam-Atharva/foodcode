import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ currentUser, onLogout }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const userRole = currentUser?.role || currentUser?.userType;

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <span className="logo-icon">FS</span>
                    <span className="logo-text">FoodShare</span>
                </Link>

                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? 'Close' : 'Menu'}
                </button>

                <ul className={`nav-menu ${mobileMenuOpen ? 'nav-menu-open' : ''}`}>
                    <li className="nav-item">
                        <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    </li>
                    {/* Everyone can Browse Food now to see existing foods, except maybe strictly donors, but let's allow everyone to see it */}
                    {(!currentUser || userRole === 'receiver' || userRole === 'user' || userRole === 'admin' || userRole === 'donor') && (
                        <li className="nav-item">
                            <Link to="/browse" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Browse Food</Link>
                        </li>
                    )}
                    {currentUser && (
                        <>
                            <li className="nav-item">
                                <Link to="/donate" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Donate Food</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                            </li>
                            {userRole === 'admin' && (
                                <li className="nav-item">
                                    <Link to="/admin" className="nav-link nav-link-admin" onClick={() => setMobileMenuOpen(false)}>
                                        Admin
                                    </Link>
                                </li>
                            )}
                        </>
                    )}
                </ul>

                <div className="nav-actions">
                    {currentUser ? (
                        <div className="user-info">
                            <Link to="/profile" className="user-name-link">
                                <span className="user-name">{currentUser.name}</span>
                            </Link>
                            <button onClick={onLogout} className="btn btn-outline">Logout</button>
                        </div>
                    ) : (
                        <Link 
                            to="/" 
                            className="btn btn-outline"
                            onClick={() => {
                                setTimeout(() => {
                                    document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                            }}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
