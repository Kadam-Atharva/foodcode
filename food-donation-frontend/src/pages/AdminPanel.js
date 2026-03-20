import React, { useEffect, useState } from 'react';
import { userAPI, donationAPI, requestAPI, feedbackAPI, analyticsAPI } from '../services/api';

function AdminPanel({ currentUser }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [requests, setRequests] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [usersRes, donationsRes, requestsRes, feedbacksRes, statsRes] = await Promise.all([
                userAPI.getAllUsers(),
                donationAPI.getAllDonations(),
                requestAPI.getAllRequests(),
                feedbackAPI.getAllFeedback(),
                analyticsAPI.getStats()
            ]);
            setUsers(usersRes.data);
            setDonations(donationsRes.data);
            setRequests(requestsRes.data);
            setFeedbacks(feedbacksRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error('Failed to fetch admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await userAPI.deleteUser(userId);
            alert('User deleted successfully!');
            fetchAllData();
        } catch {
            alert('Failed to delete user. They may have associated data.');
        }
    };

    const handleDeleteDonation = async (donationId) => {
        if (!window.confirm('Are you sure you want to delete this donation?')) return;
        try {
            await donationAPI.deleteDonation(donationId);
            alert('Donation deleted successfully!');
            fetchAllData();
        } catch {
            alert('Failed to delete donation.');
        }
    };

    const handleDeleteFeedback = async (feedbackId) => {
        if (!window.confirm('Delete this feedback?')) return;
        try {
            await feedbackAPI.deleteFeedback(feedbackId);
            alert('Feedback deleted!');
            fetchAllData();
        } catch {
            alert('Failed to delete feedback.');
        }
    };

    const getStatusColor = (status) => ({
        available: '#4eab68',
        claimed: '#8a9d3a',
        completed: '#225334',
        pending: '#d9a83b',
        approved: '#4eab68',
        rejected: '#d94d45'
    }[status] || '#757575');

    if (currentUser.userType !== 'admin') {
        return (
            <div className="admin-page">
                <div className="page-header">
                    <h1>Access Denied</h1>
                    <p>You do not have admin privileges to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>Admin Panel</h1>
                <p>Manage all platform data and users</p>
            </div>

            <div className="admin-stats">
                <div className="admin-stat-card" onClick={() => setActiveTab('users')}><div className="admin-stat-icon">Users</div><h3>{users.length}</h3><p>Total Users</p></div>
                <div className="admin-stat-card" onClick={() => setActiveTab('donations')}><div className="admin-stat-icon">Food</div><h3>{donations.length}</h3><p>Total Donations</p></div>
                <div className="admin-stat-card" onClick={() => setActiveTab('requests')}><div className="admin-stat-icon">Requests</div><h3>{requests.length}</h3><p>Total Requests</p></div>
                <div className="admin-stat-card" onClick={() => setActiveTab('feedbacks')}><div className="admin-stat-icon">Reviews</div><h3>{feedbacks.length}</h3><p>Total Feedbacks</p></div>
                {stats && <div className="admin-stat-card impact-card"><div className="admin-stat-icon">Impact</div><h3>{stats.successRate.toFixed(1)}%</h3><p>Platform Success Rate</p></div>}
            </div>

            <div className="dashboard-tabs admin-tabs">
                {['overview', 'users', 'donations', 'requests', 'feedbacks'].map((tab) => (
                    <button key={tab} className={activeTab === tab ? 'tab active' : 'tab'} onClick={() => setActiveTab(tab)}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? <div className="loading">Loading admin data...</div> : (
                <div className="admin-content">
                    {activeTab === 'overview' && (
                        <div className="admin-overview">
                            <div className="admin-section">
                                <h2>Platform Summary</h2>
                                <div className="admin-summary-grid">
                                    <div className="summary-item highlight"><h4>Platform Success</h4><span>{stats?.successRate.toFixed(1)}%</span></div>
                                    <div className="summary-item"><h4>Fulfillment Rate</h4><span>{stats?.fulfillmentRate.toFixed(1)}%</span></div>
                                    <div className="summary-item impact-indicator"><h4>Estimated Impact</h4><span>{stats?.estimatedImpact} People Helped</span></div>
                                    <div className="summary-item"><h4>Active Donors</h4><span>{stats?.activeDonors}</span></div>
                                    <div className="summary-item"><h4>Total Donations</h4><span>{stats?.totalDonations}</span></div>
                                    <div className="summary-item highlights-secondary"><h4>Efficiency</h4><span>{((stats?.approvedRequests / (stats?.totalRequests || 1)) * 100).toFixed(1)}%</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="admin-section">
                            <h2>All Users ({users.length})</h2>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Type</th><th>Joined</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.userId}>
                                                <td>{user.userId}</td>
                                                <td><strong>{user.name}</strong></td>
                                                <td>{user.email}</td>
                                                <td>{user.phoneNumber || '-'}</td>
                                                <td><span className="table-badge" style={{ background: getStatusColor(user.userType === 'admin' ? 'approved' : user.userType === 'donor' ? 'available' : 'claimed') }}>{user.userType}</span></td>
                                                <td>{user.createdDate ? new Date(user.createdDate).toLocaleDateString('en-IN') : '-'}</td>
                                                <td>{user.userId !== currentUser.userId && <button className="btn btn-danger btn-small" onClick={() => handleDeleteUser(user.userId)}>Delete</button>}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'donations' && (
                        <div className="admin-section">
                            <h2>All Donations ({donations.length})</h2>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead><tr><th>ID</th><th>Food Type</th><th>Quantity</th><th>Status</th><th>Donor ID</th><th>Expiry</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {donations.map((donation) => (
                                            <tr key={donation.donationId}>
                                                <td>{donation.donationId}</td>
                                                <td><strong>{donation.foodType}</strong></td>
                                                <td>{donation.quantity}</td>
                                                <td><span className="table-badge" style={{ background: getStatusColor(donation.status) }}>{donation.status}</span></td>
                                                <td>{donation.userId}</td>
                                                <td>{new Date(donation.expiryTime).toLocaleDateString('en-IN')}</td>
                                                <td><button className="btn btn-danger btn-small" onClick={() => handleDeleteDonation(donation.donationId)}>Delete</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <div className="admin-section">
                            <h2>All Requests ({requests.length})</h2>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead><tr><th>ID</th><th>Donation ID</th><th>Receiver ID</th><th>Status</th><th>Request Date</th><th>Pickup Time</th></tr></thead>
                                    <tbody>
                                        {requests.map((request) => (
                                            <tr key={request.requestId}>
                                                <td>{request.requestId}</td>
                                                <td>{request.donationId}</td>
                                                <td>{request.receiverId}</td>
                                                <td><span className="table-badge" style={{ background: getStatusColor(request.status) }}>{request.status}</span></td>
                                                <td>{new Date(request.requestDate).toLocaleDateString('en-IN')}</td>
                                                <td>{request.pickupTime ? new Date(request.pickupTime).toLocaleDateString('en-IN') : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'feedbacks' && (
                        <div className="admin-section">
                            <h2>All Feedbacks ({feedbacks.length})</h2>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead><tr><th>ID</th><th>User ID</th><th>Donation ID</th><th>Rating</th><th>Comment</th><th>Date</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {feedbacks.map((feedback) => (
                                            <tr key={feedback.feedbackId}>
                                                <td>{feedback.feedbackId}</td>
                                                <td>{feedback.userId}</td>
                                                <td>{feedback.donationId}</td>
                                                <td>{'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}</td>
                                                <td className="comment-cell">{feedback.comment || '-'}</td>
                                                <td>{new Date(feedback.feedbackDate).toLocaleDateString('en-IN')}</td>
                                                <td><button className="btn btn-danger btn-small" onClick={() => handleDeleteFeedback(feedback.feedbackId)}>Delete</button></td>
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
