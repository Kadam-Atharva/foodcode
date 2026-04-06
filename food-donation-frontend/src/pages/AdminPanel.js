import React, { useEffect, useState } from 'react';
import { userAPI, foodAPI } from '../services/api';

function AdminPanel({ currentUser }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [usersRes, foodsRes] = await Promise.all([
                userAPI.getAllUsers(),
                foodAPI.getAllFoods()
            ]);
            setUsers(usersRes.data);
            setFoods(foodsRes.data);
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

    const handleDeleteFood = async (foodId) => {
        if (!window.confirm('Are you sure you want to delete this food?')) return;
        try {
            await foodAPI.deleteFood(foodId);
            alert('Food deleted successfully!');
            fetchAllData();
        } catch {
            alert('Failed to delete food.');
        }
    };

    const getStatusColor = (status) => ({
        available: '#4eab68',
        claimed: '#8a9d3a',
        admin: '#4eab68',
        donor: '#d9a83b',
        receiver: '#225334'
    }[status] || '#757575');

    if (currentUser.role !== 'admin' && currentUser.userType !== 'admin') {
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
                <div className="admin-stat-card" onClick={() => setActiveTab('users')}>
                    <div className="admin-stat-icon">Users</div>
                    <h3>{users.length}</h3>
                    <p>Total Users</p>
                </div>
                <div className="admin-stat-card" onClick={() => setActiveTab('foods')}>
                    <div className="admin-stat-icon">Food</div>
                    <h3>{foods.length}</h3>
                    <p>Total Foods</p>
                </div>
            </div>

            <div className="dashboard-tabs admin-tabs">
                {['overview', 'users', 'foods'].map((tab) => (
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
                                    <div className="summary-item"><h4>Total Users</h4><span>{users.length}</span></div>
                                    <div className="summary-item"><h4>Total Foods Posted</h4><span>{foods.length}</span></div>
                                    <div className="summary-item highlight"><h4>Foods Claimed</h4><span>{foods.filter(f => f.claimed).length}</span></div>
                                    <div className="summary-item"><h4>Foods Available</h4><span>{foods.filter(f => !f.claimed).length}</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="admin-section">
                            <h2>All Users ({users.length})</h2>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id || user.userId}>
                                                <td>{user.id || user.userId}</td>
                                                <td><strong>{user.name}</strong></td>
                                                <td>{user.email}</td>
                                                <td>{user.phone || '-'}</td>
                                                <td><span className="table-badge" style={{ background: getStatusColor(user.role || user.userType) }}>{user.role || user.userType}</span></td>
                                                <td>{(user.id || user.userId) !== (currentUser.id || currentUser.userId) && <button className="btn btn-danger btn-small" onClick={() => handleDeleteUser(user.id || user.userId)}>Delete</button>}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'foods' && (
                        <div className="admin-section">
                            <h2>All Foods ({foods.length})</h2>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead><tr><th>ID</th><th>Title</th><th>Quantity</th><th>Status</th><th>Donor ID</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {foods.map((food) => (
                                            <tr key={food.id}>
                                                <td>{food.id}</td>
                                                <td><strong>{food.title}</strong></td>
                                                <td>{food.quantity}</td>
                                                <td><span className="table-badge" style={{ background: getStatusColor(food.claimed ? 'claimed' : 'available') }}>{food.claimed ? 'Claimed' : 'Available'}</span></td>
                                                <td>{food.donorId}</td>
                                                <td><button className="btn btn-danger btn-small" onClick={() => handleDeleteFood(food.id)}>Delete</button></td>
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
