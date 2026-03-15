import React, { useState, useEffect } from 'react';
import { donationAPI, requestAPI } from '../services/api';
import DonationCard from '../components/DonationCard';

function BrowseDonations({ currentUser }) {
    const [donations, setDonations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchDonations();
    }, []);

    useEffect(() => {
        // Filter donations based on search term
        if (searchTerm) {
            const filtered = donations.filter(donation =>
                donation.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donation.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDonations(filtered);
        } else {
            setFilteredDonations(donations);
        }
    }, [searchTerm, donations]);

    const fetchDonations = async () => {
        try {
            setLoading(true);
            const response = await donationAPI.getAvailableDonations();
            setDonations(response.data);
            setFilteredDonations(response.data);
        } catch (err) {
            setError('Failed to load donations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestClick = async (donation) => {
        if (!currentUser) {
            alert('Please login to request food donations');
            return;
        }

        try {
            const requestData = {
                donationId: donation.donationId,
                receiverId: currentUser.userId,
                pickupTime: donation.expiryTime
            };

            await requestAPI.createRequest(requestData);
            setSuccessMessage('✅ Request submitted successfully! Check your dashboard for updates.');

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);

            // Refresh donations
            fetchDonations();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to submit request. Please try again.');
        }
    };

    return (
        <div className="browse-page">
            <div className="page-header">
                <h1>🔍 Browse Food Donations</h1>
                <p>Find available food donations near you</p>
            </div>

            <div className="search-section">
                <input
                    type="text"
                    className="search-input"
                    placeholder="🔍 Search by food type or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading donations...</div>
            ) : (
                <div className="donations-container">
                    {filteredDonations.length === 0 ? (
                        <div className="no-donations">
                            <h3>No donations found</h3>
                            <p>
                                {searchTerm
                                    ? 'Try a different search term'
                                    : 'Be the first to donate food!'}
                            </p>
                        </div>
                    ) : (
                        <div className="donations-grid">
                            {filteredDonations.map((donation) => (
                                <DonationCard
                                    key={donation.donationId}
                                    donation={donation}
                                    onRequestClick={handleRequestClick}
                                    currentUser={currentUser}
                                    showActions={true}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default BrowseDonations;
