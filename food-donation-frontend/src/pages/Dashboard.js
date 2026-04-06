import React, { useEffect, useState } from 'react';
import { foodAPI } from '../services/api';
import DonationCard from '../components/DonationCard';
import EditDonationModal from '../components/EditDonationModal';

function Dashboard({ currentUser }) {
    const [myFoods, setMyFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingFood, setEditingFood] = useState(null);

    useEffect(() => {
        if (!currentUser) return;
        fetchDashboardData();
    }, [currentUser]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await foodAPI.getAllFoods();
            const filtered = response.data.filter(
                (food) => food.donorId === currentUser.id || food.donorId === currentUser.userId
            );
            setMyFoods(filtered);
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFood = async (foodId) => {
        if (!window.confirm('Are you sure you want to delete this food item?')) return;
        try {
            await foodAPI.deleteFood(foodId);
            alert('Food deleted successfully!');
            fetchDashboardData();
        } catch {
            alert('Failed to delete food. Please try again.');
        }
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>My Dashboard</h1>
                <p>Welcome back, {currentUser.name}!</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>{myFoods.length}</h3>
                    <p>Total Foods Posted</p>
                </div>
                <div className="stat-card">
                    <h3>{myFoods.filter((f) => !f.claimed).length}</h3>
                    <p>Available Foods</p>
                </div>
                <div className="stat-card">
                    <h3>{myFoods.filter((f) => f.claimed).length}</h3>
                    <p>Claimed Foods</p>
                </div>
            </div>

            {loading ? <div className="loading">Loading dashboard...</div> : (
                <div className="dashboard-content">
                    <div className="donations-section">
                        <h2>My Foods</h2>
                        {myFoods.length === 0 ? <p className="empty-state">You have not posted any foods yet.</p> : (
                            <div className="donations-list">
                                {myFoods.map((food) => (
                                    <div key={food.id} className="donation-item">
                                        <DonationCard donation={food} currentUser={currentUser} showActions={false} />
                                        <div className="donation-management-actions" style={{ marginTop: '1rem' }}>
                                            <button onClick={() => setEditingFood(food)} className="btn btn-primary btn-small">Edit</button>
                                            <button onClick={() => handleDeleteFood(food.id)} className="btn btn-danger btn-small" style={{ marginLeft: '10px' }}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {editingFood && (
                <EditDonationModal 
                    donation={editingFood} 
                    onDonationUpdated={() => { 
                        alert('Food updated successfully!'); 
                        fetchDashboardData(); 
                    }} 
                    onClose={() => setEditingFood(null)} 
                />
            )}
        </div>
    );
}

export default Dashboard;
