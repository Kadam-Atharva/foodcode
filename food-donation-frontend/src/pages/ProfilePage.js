import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, donationAPI, requestAPI, feedbackAPI } from '../services/api';

function ProfilePage({ currentUser, onLogin, onLogout }) {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        phoneNumber: currentUser?.phoneNumber || '',
        address: currentUser?.address || ''
    });
    const [stats, setStats] = useState({
        totalDonations: 0,
        totalRequests: 0,
        totalFeedback: 0,
        completedDonations: 0
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        fetchUserStats();
    }, [currentUser]);

    const fetchUserStats = async () => {
        try {
            const feedbackCall = currentUser.userType === 'donor'
                ? feedbackAPI.getFeedbackByDonorId(currentUser.userId)
                : feedbackAPI.getFeedbackByUserId(currentUser.userId);

            const [donationsRes, requestsRes, feedbackRes] = await Promise.all([
                donationAPI.getDonationsByUserId(currentUser.userId),
                requestAPI.getRequestsByReceiverId(currentUser.userId),
                feedbackCall
            ]);
            setStats({
                totalDonations: donationsRes.data.length,
                totalRequests: requestsRes.data.length,
                totalFeedback: feedbackRes.data.length,
                completedDonations: donationsRes.data.filter(d => d.status === 'completed').length
            });
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await userAPI.updateUser(currentUser.userId, formData);
            const updatedUser = { ...currentUser, ...response.data };
            onLogin(updatedUser);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await userAPI.deleteUser(currentUser.userId);
            onLogout();
            navigate('/');
            alert('Your account has been deleted successfully.');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete account. Please try again.');
        }
    };

    const getRoleBadge = (userType) => {
        const badges = {
            donor: { label: 'Donor', color: '#4eab68' },
            receiver: { label: 'Receiver', color: '#4b78d1' },
            admin: { label: 'Admin', color: '#1f4f2f' }
        };
        return badges[userType] || badges.donor;
    };

    const roleBadge = getRoleBadge(currentUser.userType);

    // Calculate Dynamic Impact & Badges
    const impactScore = (stats.totalDonations * 25) + (stats.completedDonations * 100) + (stats.totalRequests * 15);
    const levelName = impactScore > 500 ? 'Platinum Hero' : impactScore > 200 ? 'Gold Champion' : impactScore > 50 ? 'Bronze Supporter' : 'New Member';
    const progressToNext = impactScore > 500 ? 100 : impactScore > 200 ? (impactScore/500)*100 : impactScore > 50 ? (impactScore/200)*100 : (impactScore/50)*100;

    return (
        <div className="profile-page">
            <div className="page-header profile-hero">
                <h1>My Profile</h1>
                <p>Manage your account settings and track your community impact</p>
            </div>

            <div className="profile-dashboard-container">
                {/* Left Column: Account Details */}
                <div className="profile-main-column">
                    <div className="profile-card premium-card">
                        <div className="profile-avatar-section">
                            <div className="avatar-circle pulse-glow">
                                {currentUser.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="avatar-info">
                                <h2>{currentUser.name}</h2>
                                <span className="role-badge" style={{ background: roleBadge.color, boxShadow: `0 4px 12px ${roleBadge.color}40` }}>
                                    {roleBadge.label}
                                </span>
                            </div>
                        </div>

                        <div className="profile-details-list">
                            <div className="detail-item">
                                <span className="detail-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </span>
                                <div className="detail-content">
                                    <label>Email Address</label>
                                    <p>{currentUser.email}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <span className="detail-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </span>
                                <div className="detail-content">
                                    <label>Phone Number</label>
                                    <p>{currentUser.phoneNumber || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <span className="detail-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </span>
                                <div className="detail-content">
                                    <label>Street Address</label>
                                    <p>{currentUser.address || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <span className="detail-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                </span>
                                <div className="detail-content">
                                    <label>Member Since</label>
                                    <p>{currentUser.createdDate ? new Date(currentUser.createdDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {!isEditing && (
                            <button className="btn btn-primary w-full mt-4" onClick={() => setIsEditing(true)}>
                                Edit Profile Details
                            </button>
                        )}
                    </div>

                    {isEditing && (
                        <div className="profile-edit-card premium-card slide-down">
                            <h2>Edit Profile</h2>
                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}
                            
                            <form onSubmit={handleUpdateProfile} className="profile-form">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows="3" />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button type="button" className="btn btn-outline" onClick={() => {
                                        setIsEditing(false);
                                        setFormData({ name: currentUser.name, phoneNumber: currentUser.phoneNumber || '', address: currentUser.address || '' });
                                    }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="danger-zone premium-card danger-card">
                        <div className="danger-header">
                            <span className="danger-icon">⚠️</span>
                            <div>
                                <h3>Danger Zone</h3>
                                <p>Once deleted, your account cannot be recovered.</p>
                            </div>
                        </div>
                        {!showDeleteConfirm ? (
                            <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>Delete Account</button>
                        ) : (
                            <div className="delete-confirm">
                                <p><strong>Are you sure?</strong> This will permanently delete your data.</p>
                                <div className="form-actions">
                                    <button className="btn btn-danger" onClick={handleDeleteAccount}>Yes, Delete My Account</button>
                                    <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Impact & Stats */}
                <div className="profile-side-column">
                    <div className="impact-card premium-card">
                        <div className="impact-header">
                            <h2>My Impact Score</h2>
                            <div className="impact-score-circle">
                                <span className="score-value">{impactScore}</span>
                                <span className="score-label">Points</span>
                            </div>
                        </div>
                        
                        <div className="level-indicator">
                            <div className="level-labels">
                                <strong>{levelName}</strong>
                                <span>{Math.round(progressToNext)}% to next</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${progressToNext}%` }}></div>
                            </div>
                        </div>

                        <div className="trust-badges">
                            <h3>Earned Badges</h3>
                            <div className="badges-list">
                                <div className="badge-item active">
                                    <span className="badge-emoji">🌱</span>
                                    <span>Verified</span>
                                </div>
                                <div className={`badge-item ${stats.totalDonations > 0 ? 'active' : 'locked'}`}>
                                    <span className="badge-emoji">🍲</span>
                                    <span>First Food</span>
                                </div>
                                <div className={`badge-item ${stats.completedDonations > 4 ? 'active' : 'locked'}`}>
                                    <span className="badge-emoji">⭐</span>
                                    <span>Top Hero</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="stats-grid premium-card">
                        <h2>Activity Overview</h2>
                        <div className="profile-stats-grid">
                            {(currentUser.userType === 'donor' || currentUser.userType === 'admin') && (
                                <div className="profile-stat advanced-stat">
                                    <div className="stat-icon-wrapper blue">📦</div>
                                    <span className="profile-stat-number">{stats.totalDonations}</span>
                                    <span className="profile-stat-label">Donations Listed</span>
                                </div>
                            )}
                            {(currentUser.userType === 'receiver' || currentUser.userType === 'admin') && (
                                <div className="profile-stat advanced-stat">
                                    <div className="stat-icon-wrapper orange">✋</div>
                                    <span className="profile-stat-number">{stats.totalRequests}</span>
                                    <span className="profile-stat-label">Food Requests</span>
                                </div>
                            )}
                            {(currentUser.userType === 'donor' || currentUser.userType === 'admin') && (
                                <div className="profile-stat advanced-stat">
                                    <div className="stat-icon-wrapper green">✅</div>
                                    <span className="profile-stat-number">{stats.completedDonations}</span>
                                    <span className="profile-stat-label">Successful Pickups</span>
                                </div>
                            )}
                            <div className="profile-stat advanced-stat">
                                <div className="stat-icon-wrapper purple">💬</div>
                                <span className="profile-stat-number">{stats.totalFeedback}</span>
                                <span className="profile-stat-label">Feedback Left</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
