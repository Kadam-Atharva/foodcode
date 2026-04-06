import React, { useState, useEffect } from 'react';
import { foodAPI } from '../services/api';
import DonationCard from '../components/DonationCard';

function BrowseDonations({ currentUser }) {
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchFoods();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = foods.filter(food =>
                food.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (food.description || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredFoods(filtered);
        } else {
            setFilteredFoods(foods);
        }
    }, [searchTerm, foods]);

    const fetchFoods = async () => {
        try {
            setLoading(true);
            const response = await foodAPI.getAllFoods();
            // Filter to only available ones
            const availableFoods = response.data.filter(f => !f.claimed);
            setFoods(availableFoods);
            setFilteredFoods(availableFoods);
        } catch (err) {
            setError('Failed to load foods. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClaimClick = async (food) => {
        if (!currentUser) {
            alert('Please login to claim food');
            return;
        }

        try {
            const updateData = {
                ...food,
                claimed: true
            };

            await foodAPI.updateFood(food.id, updateData);
            setSuccessMessage('✅ Food claimed successfully! Please pick it up soon.');

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);

            // Refresh foods
            fetchFoods();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to claim food. Please try again.');
        }
    };

    return (
        <div className="browse-page">
            <div className="page-header">
                <h1>🔍 Browse Foods</h1>
                <p>Find available foods near you</p>
            </div>

            <div className="search-section">
                <div className="search-bar-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="search-results-count">
                    {!loading && (
                        <span>{filteredFoods.length} food{filteredFoods.length !== 1 ? 's' : ''} found</span>
                    )}
                </div>
            </div>

            {successMessage && (
                <div className="success-message browse-message">{successMessage}</div>
            )}

            {error && <div className="error-message browse-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading foods...</div>
            ) : (
                <div className="donations-container">
                    {filteredFoods.length === 0 ? (
                        <div className="no-donations">
                            <h3>No foods found</h3>
                            <p>
                                {searchTerm
                                    ? 'Try a different search term'
                                    : 'Be the first to donate food!'}
                            </p>
                        </div>
                    ) : (
                        <div className="donations-grid">
                            {filteredFoods.map((food) => (
                                <div key={food.id} className="donation-card-wrapper">
                                    <DonationCard
                                        donation={food}
                                        onRequestClick={handleClaimClick}
                                        currentUser={currentUser}
                                        showActions={true}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default BrowseDonations;
