import React, { useState, useEffect } from 'react';
import { userAPI, donationAPI, requestAPI, feedbackAPI } from '../services/api';

function AdminPanel({ currentUser }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [requests, setRequests] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [usersRes, donationsRes, requestsRes, feedbacksRes] = await Promise.all([
                userAPI.getAllUsers(),
                donationAPI.getAllDonations(),
                requestAPI.getAllRequests(),
                feedbackAPI.getAllFeedback()
            ]);
            setUsers(usersRes.data);
            setDonations(donationsRes.data);
            setRequests(requestsRes.data);
            setFeedbacks(feedbacksRes.data);
        } catch (err) {
            console.error('Failed to fetch admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await userAPI.deleteUser(userId);
                alert('✅ User deleted successfully!');
                fetchAllData();
            } catch (err) {
                alert('Failed to delete user. They may have associated data.');
            }
        }
    };

    const handleDeleteDonation = async (donationId) => {
        if (window.confirm('Are you sure you want to delete this donation?')) {
            try {
                await donationAPI.deleteDonation(donationId);
                alert('✅ Donation deleted successfully!');
                fetchAllData();
            } catch (err) {
                alert('Failed to delete donation.');
            }
        }
    };

    const handleDeleteFeedback = async (feedbackId) => {
        if (window.confirm('Delete this feedback?')) {
            try {
                await feedbackAPI.deleteFeedback(feedbackId);
                alert('✅ Feedback deleted!');
                fetchAllData();
            } catch (err) {
                alert('Failed to delete feedback.');
            }
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            available: '#4CAF50',
            claimed: '#FF9800',
            completed: '#2196F3',
            pending: '#FFC107',
            approved: '#4CAF50',
            rejected: '#F44336'
        };
        return colors[status] || '#757575';
    };

    if (currentUser.userType !== 'admin') {
        return (
            <div className="admin-page">
                <div className="page-header">
                    <h1>🚫 Access Denied</h1>
                    <p>You do not have admin privileges to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>👑 Admin Panel</h1>
                <p>Manage all platform data and users</p>
            </div>

            {/* Overview Stats */}
            <div className="admin-stats">
                <div className="admin-stat-card" onClick={() => setActiveTab('users')}>
                    <div className="admin-stat-icon">👥</div>
                    <h3>{users.length}</h3>
                    <p>Total Users</p>
                </div>
                <div className="admin-stat-card" onClick={() => setActiveTab('donations')}>
                    <div className="admin-stat-icon">🍽️</div>
                    <h3>{donations.length}</h3>
                    <p>Total Donations</p>
                </div>
                <div className="admin-stat-card" onClick={() => setActiveTab('requests')}>
                    <div className="admin-stat-icon">📋</div>
                    <h3>{requests.length}</h3>
                    <p>Total Requests</p>
                </div>
                <div className="admin-stat-card" onClick={() => setActiveTab('feedbacks')}>
                    <div className="admin-stat-icon">⭐</div>
                    <h3>{feedbacks.length}</h3>
                    <p>Total Feedbacks</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="dashboard-tabs admin-tabs">
                {['overview', 'users', 'donations', 'requests', 'feedbacks'].map(tab => (
                    <button
                        key={tab}
                        className={activeTab === tab ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading">Loading admin data...</div>
            ) : (
                <div className="admin-content">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="admin-overview">
                            <div className="admin-section">
                                <h2>📊 Platform Summary</h2>
                                <div className="admin-summary-grid">
                                    <div className="summary-item">
                                        <h4>Donors</h4>
                                        <span>{users.filter(u => u.userType === 'donor').length}</span>
                                    </div>
                                    <div className="summary-item">
                                        <h4>Receivers</h4>
                                        <span>{users.filter(u => u.userType === 'receiver').length}</span>
                                    </div>
                                    <div className="summary-item">
                                        <h4>Available Donations</h4>
                                        <span>{donations.filter(d => d.status === 'available').length}</span>
                                    </div>
                                    <div className="summary-item">
                                        <h4>Claimed Donations</h4>
                                        <span>{donations.filter(d => d.status === 'claimed').length}</span>
                                    </div>
                                    <div className="summary-item">
                                        <h4>Completed Donations</h4>
                                        <span>{donations.filter(d => d.status === 'completed').length}</span>
                                    </div>
                                    <div className="summary-item">
                                        <h4>Pending Requests</h4>
                                        <span>{requests.filter(r => r.status === 'pending').length}</span>
                                    </div>
                                    <div className="summary-item">
                                        <h4>Avg. Rating</h4>
                                        <span>
                                            {feedbacks.length > 0
                                                ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
                                                : 'N/A'
                                            } ⭐
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="admin-section">
                            <h2>👥 All Users ({users.length})</h2>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Type</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.userId}>
                                                <td>{user.userId}</td>
                                                <td><strong>{user.name}</strong></td>
                                                <td>{user.email}</td>
                                                <td>{user.phoneNumber || '—'}</td>
                                                <td>
                                                    <span className="table-badge" style={{ background: getStatusColor(user.userType === 'admin' ? 'approved' : user.userType === 'donor' ? 'available' : 'claimed') }}>
                                                        {user.userType}
                                                    </span>
                                                </td>
                                                <td>{user.createdDate ? new Date(user.createdDate).toLocaleDateString('en-IN') : '—'}</td>
                                                <td>
                                                    {user.userId !== currentUser.userId && (
                                                        <button
                                                            className="btn btn-danger btn-small"
                                                            onClick={() => handleDeleteUser(user.userId)}
                                                        >
                                                            🗑️
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Donations Tab */}
                    {activeTab === 'donations' && (
                        <div className="admin-section">
                            <h2>🍽️ All Donations ({donations.length})</h2>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Food Type</th>
                                            <th>Quantity</th>
                                            <th>Status</th>
                                            <th>Donor ID</th>
                                            <th>Expiry</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donations.map(donation => (
                                            <tr key={donation.donationId}>
                                                <td>{donation.donationId}</td>
                                                <td><strong>{donation.foodType}</strong></td>
                                                <td>{donation.quantity}</td>
                                                <td>
                                                    <span className="table-badge" style={{ background: getStatusColor(donation.status) }}>
                                                        {donation.status}
                                                    </span>
                                                </td>
                                                <td>{donation.userId}</td>
                                                <td>{new Date(donation.expiryTime).toLocaleDateString('en-IN')}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-danger btn-small"
                                                        onClick={() => handleDeleteDonation(donation.donationId)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Requests Tab */}
                    {activeTab === 'requests' && (
                        <div className="admin-section">
                            <h2>📋 All Requests ({requests.length})</h2>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Donation ID</th>
                                            <th>Receiver ID</th>
                                            <th>Status</th>
                                            <th>Request Date</th>
                                            <th>Pickup Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map(req => (
                                            <tr key={req.requestId}>
                                                <td>{req.requestId}</td>
                                                <td>{req.donationId}</td>
                                                <td>{req.receiverId}</td>
                                                <td>
                                                    <span className="table-badge" style={{ background: getStatusColor(req.status) }}>
                                                        {req.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(req.requestDate).toLocaleDateString('en-IN')}</td>
                                                <td>{req.pickupTime ? new Date(req.pickupTime).toLocaleDateString('en-IN') : '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Feedbacks Tab */}
                    {activeTab === 'feedbacks' && (
                        <div className="admin-section">
                            <h2>⭐ All Feedbacks ({feedbacks.length})</h2>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>User ID</th>
                                            <th>Donation ID</th>
                                            <th>Rating</th>
                                            <th>Comment</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {feedbacks.map(fb => (
                                            <tr key={fb.feedbackId}>
                                                <td>{fb.feedbackId}</td>
                                                <td>{fb.userId}</td>
                                                <td>{fb.donationId}</td>
                                                <td>{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</td>
                                                <td className="comment-cell">{fb.comment || '—'}</td>
                                                <td>{new Date(fb.feedbackDate).toLocaleDateString('en-IN')}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-danger btn-small"
                                                        onClick={() => handleDeleteFeedback(fb.feedbackId)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminPanel;
