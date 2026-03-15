import React, { useState, useEffect, useCallback, useRef } from 'react';
import { donationAPI, requestAPI } from '../services/api';
import DonationCard from '../components/DonationCard';
import FeedbackDisplay from '../components/FeedbackDisplay';

function BrowseDonations({ currentUser }) {
    const [donations, setDonations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [expandedFeedback, setExpandedFeedback] = useState(null);
    const [useServerSearch, setUseServerSearch] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
    const browseMapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        fetchDonations();
    }, []);

    // Debounced server-side search
    const serverSearch = useCallback(
        debounce(async (term) => {
            if (!term.trim()) {
                fetchDonations();
                return;
            }
            try {
                setLoading(true);
                const response = await donationAPI.searchDonations(term);
                // Filter to only available ones
                const availableDonations = response.data.filter(d => d.status === 'available');
                setFilteredDonations(availableDonations);
            } catch (err) {
                setError('Search failed. Please try again.');
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        if (useServerSearch) {
            serverSearch(searchTerm);
        } else {
            // Client-side filter
            if (searchTerm) {
                const filtered = donations.filter(donation =>
                    donation.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    donation.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (donation.description || '').toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredDonations(filtered);
            } else {
                setFilteredDonations(donations);
            }
        }
    }, [searchTerm, donations, useServerSearch]);

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

    useEffect(() => {
        if (viewMode === 'map' && window.google && browseMapRef.current) {
            // Default center
            const mumbai = { lat: 19.0760, lng: 72.8777 };
            
            const map = new window.google.maps.Map(browseMapRef.current, {
                center: mumbai,
                zoom: 11,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false
            });
            mapInstanceRef.current = map;

            // Clear old markers
            markersRef.current.forEach(m => m.setMap(null));
            markersRef.current = [];

            // Add markers
            const bounds = new window.google.maps.LatLngBounds();
            let hasPoints = false;

            filteredDonations.forEach(donation => {
                if (donation.latitude && donation.longitude) {
                    hasPoints = true;
                    const pos = { lat: donation.latitude, lng: donation.longitude };
                    
                    const marker = new window.google.maps.Marker({
                        position: pos,
                        map: map,
                        title: donation.foodType,
                        animation: window.google.maps.Animation.DROP
                    });

                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `
                            <div style="color: #333; padding: 5px;">
                                <h4 style="margin: 0 0 5px 0;">${donation.foodType}</h4>
                                <p style="margin: 0 0 5px 0;"><b>Qty:</b> ${donation.quantity}</p>
                                <p style="margin: 0 0 10px 0;">${donation.pickupAddress}</p>
                                <button onclick="window.requestFromMap(${donation.donationId})" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                                    Request Now
                                </button>
                            </div>
                        `
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });

                    markersRef.current.push(marker);
                    bounds.extend(pos);
                }
            });

            if (hasPoints) {
                map.fitBounds(bounds);
            }

            // Expose a global function for InfoWindow button
            window.requestFromMap = (id) => {
                const donation = filteredDonations.find(d => d.donationId === id);
                if (donation) handleRequestClick(donation);
            };
        }
    }, [viewMode, filteredDonations]);

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

    const toggleFeedback = (donationId) => {
        setExpandedFeedback(expandedFeedback === donationId ? null : donationId);
    };

    return (
        <div className="browse-page">
            <div className="page-header">
                <h1>🔍 Browse Food Donations</h1>
                <p>Find available food donations near you</p>
            </div>

            <div className="search-section">
                <div className="search-bar-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search by food type, location, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <label className="search-mode-toggle">
                        <input
                            type="checkbox"
                            checked={useServerSearch}
                            onChange={(e) => setUseServerSearch(e.target.checked)}
                        />
                        <span className="toggle-label">Server Search</span>
                    </label>
                </div>
                <div className="search-results-count">
                    {!loading && (
                        <span>{filteredDonations.length} donation{filteredDonations.length !== 1 ? 's' : ''} found</span>
                    )}
                    <div className="view-toggle">
                        <button 
                            className={`btn btn-small ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setViewMode('grid')}
                        >
                            📱 Grid View
                        </button>
                        <button 
                            className={`btn btn-small ${viewMode === 'map' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setViewMode('map')}
                        >
                            📍 Map View
                        </button>
                    </div>
                </div>
            </div>

            {successMessage && (
                <div className="success-message browse-message">{successMessage}</div>
            )}

            {error && <div className="error-message browse-message">{error}</div>}

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
                        viewMode === 'grid' ? (
                            <div className="donations-grid">
                                {filteredDonations.map((donation) => (
                                    <div key={donation.donationId} className="donation-card-wrapper">
                                        <DonationCard
                                            donation={donation}
                                            onRequestClick={handleRequestClick}
                                            currentUser={currentUser}
                                            showActions={true}
                                        />
                                        <div className="browse-card-extras">
                                            <button
                                                className="btn btn-outline btn-small"
                                                onClick={() => toggleFeedback(donation.donationId)}
                                            >
                                                ⭐ {expandedFeedback === donation.donationId ? 'Hide' : 'View'} Reviews
                                            </button>
                                        </div>
                                        {expandedFeedback === donation.donationId && (
                                            <div className="browse-feedback-section">
                                                <FeedbackDisplay donationId={donation.donationId} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="map-view-container">
                                <div 
                                    ref={browseMapRef} 
                                    style={{ 
                                        width: '100%', 
                                        height: '600px', 
                                        borderRadius: '12px', 
                                        boxShadow: 'var(--shadow-lg)',
                                        border: '1px solid #ddd'
                                    }}
                                ></div>
                                <div className="map-legend">
                                    <p>📍 Click on markers to see details and request food directly from the map.</p>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default BrowseDonations;
