import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { Leaf, Zap, Users, HeartHandshake, ArrowRight, CheckCircle2 } from 'lucide-react';
import heroImage from '../assets/images/hero-image.png';

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
    const authSectionRef = useRef(null);

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

    const scrollToAuth = () => {
        authSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-content-split">
                    <div className="hero-text">
                        <div className="badge-pill">
                            <span className="pulse-dot"></span> Over 10,000 meals shared locally
                        </div>
                        <h1 className="hero-title">Share Food, <br/><span className="text-gradient">Share Hope.</span></h1>
                        <p className="hero-subtitle">
                            A cleaner, calmer way to reduce waste and help people nearby with food that still matters. Join our community today.
                        </p>
                        
                        <div className="hero-actions">
                            <button className="btn btn-primary btn-large" onClick={scrollToAuth}>
                                Get Started <ArrowRight size={20} />
                            </button>
                            <button className="btn btn-outline btn-large" onClick={() => {
                                setShowLogin(true);
                                scrollToAuth();
                            }}>
                                Login to Account
                            </button>
                        </div>
                        
                        <div className="hero-stats">
                            <div className="stat">
                                <Leaf className="stat-icon" size={32} />
                                <div>
                                    <h3>Zero Waste</h3>
                                    <p>Turn extra meals into meaningful impact.</p>
                                </div>
                            </div>
                            <div className="stat">
                                <Zap className="stat-icon" size={32} />
                                <div>
                                    <h3>Fast Matching</h3>
                                    <p>Connect with locals quickly.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hero-image-container">
                        <div className="hero-image-wrapper">
                            <img src={heroImage} alt="Community sharing food" className="hero-image" />
                            <div className="floating-card card-1">
                                <HeartHandshake size={24} color="#4eab68" />
                                <div>
                                    <h4>Donation Success</h4>
                                    <p>Just now</p>
                                </div>
                            </div>
                            <div className="floating-card card-2">
                                <Users size={24} color="#1f4f2f" />
                                <div>
                                    <h4>New Receiver</h4>
                                    <p>Joined 2m ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="how-it-works">
                <div className="section-header">
                    <h2>How It Works</h2>
                    <p>Simple steps to make a difference in your community.</p>
                </div>
                <div className="steps">
                    <div className="step">
                        <div className="step-icon-wrapper"><Users size={36} /></div>
                        <h3>1. Register</h3>
                        <p>Create a secure account as either a generous donor or a receiver.</p>
                    </div>
                    <div className="step">
                        <div className="step-icon-wrapper"><HeartHandshake size={36} /></div>
                        <h3>2. Share or Browse</h3>
                        <p>Post your surplus food or explore nearby available donations.</p>
                    </div>
                    <div className="step">
                        <div className="step-icon-wrapper"><Zap size={36} /></div>
                        <h3>3. Connect</h3>
                        <p>Seamlessly request food and coordinate a quick local pickup.</p>
                    </div>
                    <div className="step">
                        <div className="step-icon-wrapper"><Leaf size={36} /></div>
                        <h3>4. Make Impact</h3>
                        <p>Reduce environmental waste and feed someone with dignity.</p>
                    </div>
                </div>
            </section>

            <section className="auth-section" ref={authSectionRef}>
                <div className="auth-split">
                    <div className="auth-info">
                        <h2>Join the Movement.</h2>
                        <p>Whether you have extra food to share, or you're looking for meals, you're in the right place.</p>
                        <ul className="auth-benefits">
                            <li><CheckCircle2 size={20} color="#4eab68" /> <span>Completely free to use</span></li>
                            <li><CheckCircle2 size={20} color="#4eab68" /> <span>Secure and private messaging</span></li>
                            <li><CheckCircle2 size={20} color="#4eab68" /> <span>Real-time local notifications</span></li>
                        </ul>
                    </div>
                    
                    <div className="auth-container">
                        <div className="auth-toggle">
                            <button
                                className={showLogin ? 'active' : ''}
                                onClick={() => setShowLogin(true)}
                                type="button"
                            >
                                Login
                            </button>
                            <button
                                className={!showLogin ? 'active' : ''}
                                onClick={() => setShowLogin(false)}
                                type="button"
                            >
                                Register
                            </button>
                        </div>

                        {error && <div className="error-message">
                            <Zap size={18} /> {error}
                        </div>}

                        <div className={`form-wrapper ${showLogin ? 'show-login' : 'show-register'}`}>
                            {showLogin ? (
                                <form onSubmit={handleLogin} className="auth-form fade-in">
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                                        {loading ? 'Logging in...' : 'Login to Account'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleRegister} className="auth-form fade-in">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Jane Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone</label>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                placeholder="(555) 123-4567"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>I want to...</label>
                                            <select
                                                name="userType"
                                                value={formData.userType}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="donor">Donate Food</option>
                                                <option value="receiver">Receive Food</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Address</label>
                                        <textarea
                                            name="address"
                                            placeholder="Your full address for coordination..."
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="2"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
