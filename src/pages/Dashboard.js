import React, { useState, useEffect } from 'react';
import { donationAPI, requestAPI } from '../services/api';
import DonationCard from '../components/DonationCard';

function Dashboard({ currentUser }) {
    const [myDonations, setMyDonations] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [donationsWithRequests, setDonationsWithRequests] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('donations');

    useEffect(() => {
        fetchDashboardData();
    }, [currentUser]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch user's donations
            const donationsResponse = await donationAPI.getDonationsByUserId(currentUser.userId);
            setMyDonations(donationsResponse.data);

            // Fetch requests for each donation
            const requestsMap = {};
            for (const donation of donationsResponse.data) {
                const requestsResponse = await requestAPI.getRequestsByDonationId(donation.donationId);
                requestsMap[donation.donationId] = requestsResponse.data;
            }
            setDonationsWithRequests(requestsMap);

            // Fetch user's requests (if receiver)
            const myRequestsResponse = await requestAPI.getRequestsByReceiverId(currentUser.userId);
            setMyRequests(myRequestsResponse.data);
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveRequest = async (requestId) => {
        try {
            await requestAPI.updateRequestStatus(requestId, 'approved');
            alert('✅ Request approved successfully!');
            fetchDashboardData();
        } catch (err) {
            alert('Failed to approve request. Please try again.');
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await requestAPI.updateRequestStatus(requestId, 'rejected');
            alert('❌ Request rejected.');
            fetchDashboardData();
        } catch (err) {
            alert('Failed to reject request. Please try again.');
        }
    };

    const handleDeleteDonation = async (donationId) => {
        if (window.confirm('Are you sure you want to delete this donation?')) {
            try {
                await donationAPI.deleteDonation(donationId);
                alert('✅ Donation deleted successfully!');
                fetchDashboardData();
            } catch (err) {
                alert('Failed to delete donation. Please try again.');
            }
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: '⏳ Pending',
            approved: '✅ Approved',
            rejected: '❌ Rejected'
        };
        return badges[status] || status;
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>📊 My Dashboard</h1>
                <p>Welcome back, {currentUser.name}!</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>{myDonations.length}</h3>
                    <p>My Donations</p>
                </div>
                <div className="stat-card">
                    <h3>{myRequests.length}</h3>
                    <p>My Requests</p>
                </div>
                <div className="stat-card">
                    <h3>{myDonations.filter(d => d.status === 'completed').length}</h3>
                    <p>Completed</p>
                </div>
            </div>

            <div className="dashboard-tabs">
                <button
                    className={activeTab === 'donations' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('donations')}
                >
                    My Donations
                </button>
                <button
                    className={activeTab === 'requests' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('requests')}
                >
                    My Requests
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading dashboard...</div>
            ) : (
                <div className="dashboard-content">
                    {activeTab === 'donations' && (
                        <div className="donations-section">
                            <h2>My Food Donations</h2>
                            {myDonations.length === 0 ? (
                                <p className="empty-state">You haven't posted any donations yet.</p>
                            ) : (
                                <div className="donations-list">
                                    {myDonations.map((donation) => (
                                        <div key={donation.donationId} className="donation-item">
                                            <DonationCard
                                                donation={donation}
                                                showActions={false}
                                            />

                                            {donationsWithRequests[donation.donationId]?.length > 0 && (
                                                <div className="requests-for-donation">
                                                    <h4>Requests for this donation:</h4>
                                                    {donationsWithRequests[donation.donationId].map((request) => (
                                                        <div key={request.requestId} className="request-item">
                                                            <p>
                                                                <strong>Request ID:</strong> {request.requestId} |
                                                                <strong> Status:</strong> {getStatusBadge(request.status)}
                                                            </p>
                                                            {request.status === 'pending' && (
                                                                <div className="request-actions">
                                                                    <button
                                                                        onClick={() => handleApproveRequest(request.requestId)}
                                                                        className="btn btn-success btn-small"
                                                                    >
                                                                        ✅ Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleRejectRequest(request.requestId)}
                                                                        className="btn btn-danger btn-small"
                                                                    >
                                                                        ❌ Reject
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <button
                                                onClick={() => handleDeleteDonation(donation.donationId)}
                                                className="btn btn-danger btn-small"
                                            >
                                                🗑️ Delete Donation
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <div className="requests-section">
                            <h2>My Food Requests</h2>
                            {myRequests.length === 0 ? (
                                <p className="empty-state">You haven't made any requests yet.</p>
                            ) : (
                                <div className="requests-list">
                                    {myRequests.map((request) => (
                                        <div key={request.requestId} className="request-card">
                                            <h3>Request #{request.requestId}</h3>
                                            <p><strong>Donation ID:</strong> {request.donationId}</p>
                                            <p><strong>Status:</strong> {getStatusBadge(request.status)}</p>
                                            <p><strong>Requested on:</strong> {new Date(request.requestDate).toLocaleString('en-IN')}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
