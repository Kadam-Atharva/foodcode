import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

function Home({ onLogin }) {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Simulate login by verifying email exists in backend
            const response = await userAPI.getAllUsers();
            const users = response.data;
            const matchedUser = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());

            if (matchedUser) {
                onLogin(matchedUser);
                if (matchedUser.role === 'admin') {
                    navigate('/admin');
                } else if (matchedUser.role === 'donor') {
                    navigate('/dashboard');
                } else {
                    navigate('/browse');
                }
            } else {
                setError('Account not found. Please register or check your email.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Could not fetch users.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await userAPI.register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: formData.role
            });
            onLogin(response.data);
            if (response.data.role === 'donor') {
                navigate('/dashboard');
            } else {
                navigate('/browse');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">Share Food, Share Hope</h1>
                    <p className="hero-subtitle">
                        A cleaner, calmer way to reduce waste and help people nearby with food that still matters.
                    </p>
                    <div className="hero-stats">
                        <div className="stat">
                            <h3>Zero Waste</h3>
                            <p>Turn extra meals into meaningful impact.</p>
                        </div>
                        <div className="stat">
                            <h3>Fast Matching</h3>
                            <p>Help donors and receivers connect quickly.</p>
                        </div>
                        <div className="stat">
                            <h3>Local Community</h3>
                            <p>Build trust through nearby food sharing.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Register</h3>
                        <p>Create an account as a donor or receiver.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Share or Browse</h3>
                        <p>Post surplus food or explore nearby donations.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Connect</h3>
                        <p>Claim food to let others know.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">4</div>
                        <h3>Make Impact</h3>
                        <p>Reduce waste and feed someone with dignity.</p>
                    </div>
                </div>
            </section>

            <section className="auth-section">
                <div className="auth-container">
                    <div className="auth-toggle">
                        <button
                            className={showLogin ? 'active' : ''}
                            onClick={() => setShowLogin(true)}
                        >
                            Login
                        </button>
                        <button
                            className={!showLogin ? 'active' : ''}
                            onClick={() => setShowLogin(false)}
                        >
                            Register
                        </button>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {showLogin ? (
                        <form onSubmit={handleLogin} className="auth-form">
                            <h2>Welcome Back</h2>
                            <p className="auth-hint" style={{fontSize: '0.85rem', color: '#666', marginBottom: '1rem'}}>
                                Since backend authentication is simulated, you only need to enter your email.
                            </p>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="auth-form">
                            <h2>Join FoodShare</h2>
                            <p className="auth-hint" style={{fontSize: '0.85rem', color: '#666', marginBottom: '1rem'}}>
                                Passwords are not required in this version.
                            </p>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="user">Receiver - I need food</option>
                                <option value="donor">Donor - I want to donate food</option>
                            </select>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Home;
