import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

function Home({ onLogin }) {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        userType: 'donor',
        address: ''
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
            const response = await userAPI.login({
                email: formData.email,
                password: formData.password
            });
            onLogin(response.data);
            if (response.data.userType === 'donor') {
                navigate('/dashboard');
            } else {
                navigate('/browse');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await userAPI.register(formData);
            onLogin(response.data);
            if (response.data.userType === 'donor') {
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
                        <p>Request food and coordinate pickup.</p>
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
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
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
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                            <select
                                name="userType"
                                value={formData.userType}
                                onChange={handleChange}
                                required
                            >
                                <option value="donor">Donor - I want to donate food</option>
                                <option value="receiver">Receiver - I need food</option>
                            </select>
                            <textarea
                                name="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                required
                            />
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
