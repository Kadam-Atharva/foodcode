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
            // Determine which feedback to fetch based on user role
            // Donors see feedback RECEIVED on their items
            // Receivers see feedback GIVEN by them
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
            setSuccess('✅ Profile updated successfully!');
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
            donor: { icon: '🎁', label: 'Donor', color: '#4CAF50' },
            receiver: { icon: '🙏', label: 'Receiver', color: '#2196F3' },
            admin: { icon: '👑', label: 'Admin', color: '#FF6B35' }
        };
        return badges[userType] || badges.donor;
    };

    const roleBadge = getRoleBadge(currentUser.userType);

    return (
        <div className="profile-page">
            <div className="page-header">
                <h1>👤 My Profile</h1>
                <p>Manage your account settings and preferences</p>
            </div>

            <div className="profile-container">
                {/* Profile Card */}
                <div className="profile-card">
                    <div className="profile-avatar">
                        <div className="avatar-circle">
                            {currentUser.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="role-badge" style={{ background: roleBadge.color }}>
                            {roleBadge.icon} {roleBadge.label}
                        </span>
                    </div>

                    <div className="profile-details">
                        <h2>{currentUser.name}</h2>
                        <p className="profile-email">📧 {currentUser.email}</p>
                        <p className="profile-phone">📱 {currentUser.phoneNumber || 'Not provided'}</p>
                        <p className="profile-address">📍 {currentUser.address || 'Not provided'}</p>
                        <p className="profile-date">📅 Member since: {
                            currentUser.createdDate
                                ? new Date(currentUser.createdDate).toLocaleDateString('en-IN', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })
                                : 'N/A'
                        }</p>
                    </div>

                    <div className="profile-stats-grid">
                        {(currentUser.userType === 'donor' || currentUser.userType === 'admin') && (
                            <div className="profile-stat">
                                <span className="profile-stat-number">{stats.totalDonations}</span>
                                <span className="profile-stat-label">Donations</span>
                            </div>
                        )}
                        {(currentUser.userType === 'receiver' || currentUser.userType === 'admin') && (
                            <div className="profile-stat">
                                <span className="profile-stat-number">{stats.totalRequests}</span>
                                <span className="profile-stat-label">Requests</span>
                            </div>
                        )}
                        {(currentUser.userType === 'donor' || currentUser.userType === 'admin') && (
                            <div className="profile-stat">
                                <span className="profile-stat-number">{stats.completedDonations}</span>
                                <span className="profile-stat-label">Completed</span>
                            </div>
                        )}
                        <div className="profile-stat">
                            <span className="profile-stat-number">{stats.totalFeedback}</span>
                            <span className="profile-stat-label">Feedbacks</span>
                        </div>
                    </div>

                    {!isEditing && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsEditing(true)}
                        >
                            ✏️ Edit Profile
                        </button>
                    )}
                </div>

                {/* Edit Form */}
                {isEditing && (
                    <div className="profile-edit-card">
                        <h2>✏️ Edit Profile</h2>

                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}

                        <form onSubmit={handleUpdateProfile} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Saving...' : '💾 Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: currentUser.name,
                                            phoneNumber: currentUser.phoneNumber || '',
                                            address: currentUser.address || ''
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Danger Zone */}
                <div className="danger-zone">
                    <h3>⚠️ Danger Zone</h3>
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                    {!showDeleteConfirm ? (
                        <button
                            className="btn btn-danger"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            🗑️ Delete Account
                        </button>
                    ) : (
                        <div className="delete-confirm">
                            <p><strong>Are you sure?</strong> This will permanently delete your account and all associated data.</p>
                            <div className="form-actions">
                                <button className="btn btn-danger" onClick={handleDeleteAccount}>
                                    Yes, Delete My Account
                                </button>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
