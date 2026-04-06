import React from 'react';

function DonationCard({ donation, onRequestClick, currentUser, showActions = true }) {
    const statusText = donation.claimed ? 'Claimed' : 'Available';
    const statusClass = donation.claimed ? 'claimed' : 'available';

    return (
        <div className={`donation-card status-${statusClass}`}>
            <div className="card-header">
                <h3>{donation.title}</h3>
                <span className={`status-badge ${statusClass}`}>
                    {statusText}
                </span>
            </div>

            <div className="card-body">
                <p className="card-info">
                    <strong>Quantity:</strong> {donation.quantity}
                </p>
                {donation.description && (
                    <p className="card-description">
                        <strong>Description:</strong> {donation.description}
                    </p>
                )}
            </div>

            {showActions && !donation.claimed && currentUser && currentUser.id !== donation.donorId && (
                <div className="card-actions">
                    <button
                        onClick={() => onRequestClick(donation)}
                        className="btn btn-primary"
                    >
                        Claim This Food
                    </button>
                </div>
            )}
        </div>
    );
}

export default DonationCard;
