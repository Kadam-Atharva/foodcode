import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, foodAPI } from '../services/api';

function ProfilePage({ currentUser, onLogin, onLogout }) {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        phone: currentUser?.phone || '',
    });
    const [stats, setStats] = useState({
        totalFoods: 0,
        claimedFoods: 0
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        fetchUserStats();
    }, [currentUser]);

    const fetchUserStats = async () => {
        const uid = currentUser?.id || currentUser?.userId;
        if (!uid) return;
        
        try {
            const foodsRes = await foodAPI.getAllFoods();
            const myFoods = foodsRes.data.filter(f => f.donorId === uid);
            
            setStats({
                totalFoods: myFoods.length,
                claimedFoods: myFoods.filter(f => f.claimed).length
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

        const uid = currentUser?.id || currentUser?.userId;

        try {
            const response = await userAPI.updateUser(uid, formData);
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
        const uid = currentUser?.id || currentUser?.userId;
        try {
            await userAPI.deleteUser(uid);
            onLogout();
            navigate('/');
            alert('Your account has been deleted successfully.');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete account. Please try again.');
        }
    };

    const getRoleBadge = (role) => {
        const badges = {
            admin: { label: 'Admin', color: '#1f4f2f' },
            user: { label: 'User', color: '#4eab68' }
        };
        // default fallback
        return badges[role?.toLowerCase()] || { label: role || 'User', color: '#4b78d1' };
    };

    const roleString = currentUser?.role || currentUser?.userType || 'user';
    const roleBadge = getRoleBadge(roleString);

    return (
        <div className="profile-page">
            <div className="page-header">
                <h1>My Profile</h1>
                <p>Manage your account settings and preferences</p>
            </div>

            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-avatar">
                        <div className="avatar-circle">
                            {currentUser.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="role-badge" style={{ background: roleBadge.color }}>
                            {roleBadge.label}
                        </span>
                    </div>

                    <div className="profile-details">
                        <h2>{currentUser.name}</h2>
                        <p className="profile-email">Email: {currentUser.email}</p>
                        <p className="profile-phone">Phone: {currentUser.phone || currentUser.phoneNumber || 'Not provided'}</p>
                    </div>

                    <div className="profile-stats-grid">
                        <div className="profile-stat">
                            <span className="profile-stat-number">{stats.totalFoods}</span>
                            <span className="profile-stat-label">Foods Posted</span>
                        </div>
                        <div className="profile-stat">
                            <span className="profile-stat-number">{stats.claimedFoods}</span>
                            <span className="profile-stat-label">Foods Claimed</span>
                        </div>
                    </div>

                    {!isEditing && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {isEditing && (
                    <div className="profile-edit-card">
                        <h2>Edit Profile</h2>

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
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: currentUser.name,
                                            phone: currentUser.phone || currentUser.phoneNumber || '',
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="danger-zone">
                    <h3>Danger Zone</h3>
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                    {!showDeleteConfirm ? (
                        <button
                            className="btn btn-danger"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            Delete Account
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
