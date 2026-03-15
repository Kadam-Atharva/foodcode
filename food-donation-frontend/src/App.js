import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DonatePage from './pages/DonatePage';
import BrowseDonations from './pages/BrowseDonations';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/AdminPanel';
import { NotificationProvider } from './context/NotificationContext';

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in (from localStorage)
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <Router>
            <NotificationProvider currentUser={currentUser}>
                <div className="app">
                    <Navbar currentUser={currentUser} onLogout={handleLogout} />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home onLogin={handleLogin} />} />
                            <Route
                                path="/donate"
                                element={currentUser ? <DonatePage currentUser={currentUser} /> : <Navigate to="/" />}
                            />
                            <Route path="/browse" element={<BrowseDonations currentUser={currentUser} />} />
                            <Route
                                path="/dashboard"
                                element={currentUser ? <Dashboard currentUser={currentUser} /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/profile"
                                element={currentUser ? <ProfilePage currentUser={currentUser} onLogin={handleLogin} onLogout={handleLogout} /> : <Navigate to="/" />}
                            />
                            <Route
                                path="/admin"
                                element={currentUser ? <AdminPanel currentUser={currentUser} /> : <Navigate to="/" />}
                            />
                        </Routes>
                    </main>
                    <Footer currentUser={currentUser} />
                </div>
            </NotificationProvider>
        </Router>
    );
}

export default App;
