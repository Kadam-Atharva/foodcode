import React from 'react';

function DonationCard({ donation, onRequestClick, currentUser, showActions = true }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            available: '✅ Available',
            claimed: '📦 Claimed',
            completed: '✔️ Completed'
        };
        return badges[status] || status;
    };

    return (
        <div className={`donation-card status-${donation.status}`}>
            <div className="card-header">
                <h3>{donation.foodType}</h3>
                <span className={`status-badge ${donation.status}`}>
                    {getStatusBadge(donation.status)}
                </span>
            </div>

            <div className="card-body">
                <p className="card-info">
                    <strong>📦 Quantity:</strong> {donation.quantity}
                </p>
                <p className="card-info">
                    <strong>⏰ Expires:</strong> {formatDate(donation.expiryTime)}
                </p>
                <p className="card-info">
                    <strong>📍 Pickup:</strong> {donation.pickupAddress}
                </p>
                {donation.description && (
                    <p className="card-description">
                        <strong>📝 Description:</strong> {donation.description}
                    </p>
                )}
                <p className="card-info">
                    <strong>📅 Posted:</strong> {formatDate(donation.createdDate)}
                </p>
            </div>

            {showActions && donation.status === 'available' && currentUser && (
                <div className="card-actions">
                    <button
                        onClick={() => onRequestClick(donation)}
                        className="btn btn-primary"
                    >
                        Request This Food
                    </button>
                </div>
            )}
        </div>
    );
}

export default DonationCard;
