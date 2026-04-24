import React, { useEffect, useState } from 'react';
import { donationAPI, requestAPI, userAPI } from '../services/api';
import DonationCard from '../components/DonationCard';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackDisplay from '../components/FeedbackDisplay';
import EditDonationModal from '../components/EditDonationModal';

function Dashboard({ currentUser }) {
    const [myDonations, setMyDonations] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [donationsWithRequests, setDonationsWithRequests] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(currentUser?.userType === 'receiver' ? 'requests' : 'donations');
    const [showFeedbackForm, setShowFeedbackForm] = useState(null);
    const [showFeedbackDisplay, setShowFeedbackDisplay] = useState(null);
    const [editingDonation, setEditingDonation] = useState(null);
    const [userMap, setUserMap] = useState({});
    const [requestDonations, setRequestDonations] = useState({});

    useEffect(() => {
        if (!currentUser) return;
        setActiveTab(currentUser.userType === 'receiver' ? 'requests' : 'donations');
        fetchDashboardData();
    }, [currentUser]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const donationsResponse = await donationAPI.getDonationsByUserId(currentUser.userId);
            setMyDonations(donationsResponse.data);

            const requestsMap = {};
            for (const donation of donationsResponse.data) {
                const requestsResponse = await requestAPI.getRequestsByDonationId(donation.donationId);
                requestsMap[donation.donationId] = requestsResponse.data;
            }
            setDonationsWithRequests(requestsMap);

            const myRequestsResponse = await requestAPI.getRequestsByReceiverId(currentUser.userId);
            setMyRequests(myRequestsResponse.data);

            const reqDonMap = {};
            for (const req of myRequestsResponse.data) {
                if (!reqDonMap[req.donationId]) {
                    const donRes = await donationAPI.getDonationById(req.donationId);
                    reqDonMap[req.donationId] = donRes.data;
                }
            }
            setRequestDonations(reqDonMap);

            const usersResponse = await userAPI.getAllUsers();
            const map = {};
            usersResponse.data.forEach((user) => {
                map[user.userId] = user;
            });
            setUserMap(map);
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveRequest = async (requestId) => {
        try {
            await requestAPI.updateRequestStatus(requestId, 'approved');
            alert('Request approved successfully!');
            fetchDashboardData();
        } catch {
            alert('Failed to approve request. Please try again.');
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await requestAPI.updateRequestStatus(requestId, 'rejected');
            alert('Request rejected.');
            fetchDashboardData();
        } catch {
            alert('Failed to reject request. Please try again.');
        }
    };

    const handleDeleteDonation = async (donationId) => {
        if (!window.confirm('Are you sure you want to delete this donation?')) return;
        try {
            await donationAPI.deleteDonation(donationId);
            alert('Donation deleted successfully!');
            fetchDashboardData();
        } catch {
            alert('Failed to delete donation. Please try again.');
        }
    };

    const handleMarkCompleted = async (donationId) => {
        if (!window.confirm('Mark this donation as completed? This means the food has been picked up.')) return;
        try {
            await donationAPI.updateDonationStatus(donationId, 'completed');
            alert('Donation marked as completed!');
            fetchDashboardData();
        } catch {
            alert('Failed to update status. Please try again.');
        }
    };

    const handleDeleteRequest = async (requestId) => {
        if (!window.confirm('Are you sure you want to cancel/delete this request?')) return;
        try {
            await requestAPI.deleteRequest(requestId);
            alert('Request deleted successfully!');
            fetchDashboardData();
        } catch {
            alert('Failed to delete request. Please try again.');
        }
    };

    const getStatusBadge = (status) => ({
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected'
    }[status] || status);

    const recipientHistory = myDonations.flatMap((donation) =>
        (donationsWithRequests[donation.donationId] || [])
            .filter((request) => request.status === 'approved' || request.status === 'completed')
            .map((request) => ({ donation, request }))
    );

    const approvedHistory = myRequests.filter((request) => request.status === 'approved' || request.status === 'completed');

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>My Dashboard</h1>
                <p>Welcome back, {currentUser.name}!</p>
            </div>

            <div className="dashboard-stats">
                {(currentUser.userType === 'donor' || currentUser.userType === 'admin') && <div className="stat-card"><h3>{myDonations.length}</h3><p>My Donations</p></div>}
                {(currentUser.userType === 'receiver' || currentUser.userType === 'admin') && <div className="stat-card"><h3>{myRequests.length}</h3><p>My Requests</p></div>}
                {(currentUser.userType === 'donor' || currentUser.userType === 'admin') && <div className="stat-card"><h3>{myDonations.filter((d) => d.status === 'completed').length}</h3><p>Completed</p></div>}
                {(currentUser.userType === 'donor' || currentUser.userType === 'admin') && <div className="stat-card"><h3>{myDonations.filter((d) => d.status === 'claimed').length}</h3><p>Claimed</p></div>}
            </div>

            {currentUser.userType === 'admin' && (
                <div className="dashboard-tabs">
                    <button className={activeTab === 'donations' ? 'tab active' : 'tab'} onClick={() => setActiveTab('donations')}>My Donations</button>
                    <button className={activeTab === 'requests' ? 'tab active' : 'tab'} onClick={() => setActiveTab('requests')}>My Requests</button>
                </div>
            )}

            {loading ? <div className="loading">Loading dashboard...</div> : (
                <div className="dashboard-content">
                    {activeTab === 'donations' && (
                        <div className="donations-section">
                            <h2>My Food Donations</h2>
                            {myDonations.length === 0 ? <p className="empty-state">You have not posted any donations yet.</p> : (
                                <div className="donations-list">
                                    {myDonations.map((donation) => (
                                        <div key={donation.donationId} className="donation-item">
                                            <DonationCard donation={donation} showActions={false} />
                                            <div className="donation-management-actions">
                                                {donation.status === 'available' && <button onClick={() => setEditingDonation(donation)} className="btn btn-primary btn-small">Edit</button>}
                                                {donation.status === 'claimed' && <button onClick={() => handleMarkCompleted(donation.donationId)} className="btn btn-success btn-small">Mark Completed</button>}
                                                <button onClick={() => setShowFeedbackDisplay(showFeedbackDisplay === donation.donationId ? null : donation.donationId)} className="btn btn-outline btn-small">View Feedback</button>
                                                <button onClick={() => handleDeleteDonation(donation.donationId)} className="btn btn-danger btn-small">Delete</button>
                                            </div>
                                            {showFeedbackDisplay === donation.donationId && <div className="feedback-section"><FeedbackDisplay donationId={donation.donationId} /></div>}
                                            {donationsWithRequests[donation.donationId]?.length > 0 && (
                                                <div className="requests-for-donation">
                                                    <h4>Requests for this donation:</h4>
                                                    {donationsWithRequests[donation.donationId].map((request) => (
                                                        <div key={request.requestId} className="request-item">
                                                            <p><strong>Request #{request.requestId}</strong> | <strong>Receiver:</strong> {userMap[request.receiverId]?.name || `User #${request.receiverId}`} | <strong>Status:</strong> {getStatusBadge(request.status)}</p>
                                                            {request.status === 'approved' && <p className="contact-info-text"><strong>Contact:</strong> {userMap[request.receiverId]?.phoneNumber}</p>}
                                                            {request.pickupTime && <p><strong>Pickup Time:</strong> {new Date(request.pickupTime).toLocaleString('en-IN')}</p>}
                                                            {request.status === 'pending' && (
                                                                <div className="request-actions">
                                                                    <button onClick={() => handleApproveRequest(request.requestId)} className="btn btn-success btn-small">Approve</button>
                                                                    <button onClick={() => handleRejectRequest(request.requestId)} className="btn btn-danger btn-small">Reject</button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <div className="requests-section">
                            <h2>My Food Requests</h2>
                            {myRequests.length === 0 ? <p className="empty-state">You have not made any requests yet.</p> : (
                                <div className="requests-list">
                                    {myRequests.map((request) => (
                                        <div key={request.requestId} className="request-card">
                                            <div className="request-card-header">
                                                <h3>{requestDonations[request.donationId]?.foodType || 'Food Donation'}</h3>
                                                <span className={`status-badge ${request.status}`}>{getStatusBadge(request.status)}</span>
                                            </div>
                                            <p><strong>Donor:</strong> {userMap[requestDonations[request.donationId]?.userId]?.name || 'Loading...'}</p>
                                            <p><strong>Requested on:</strong> {new Date(request.requestDate).toLocaleString('en-IN')}</p>
                                            {request.status === 'approved' && <p className="contact-info-text"><strong>Donor Contact:</strong> {userMap[requestDonations[request.donationId]?.userId]?.phoneNumber || 'N/A'}</p>}
                                            {request.pickupTime && <p><strong>Pickup Time:</strong> {new Date(request.pickupTime).toLocaleString('en-IN')}</p>}
                                            <div className="request-card-actions">
                                                {request.status === 'approved' && <button onClick={() => setShowFeedbackForm(request.donationId)} className="btn btn-primary btn-small">Leave Feedback</button>}
                                                <button onClick={() => setShowFeedbackDisplay(showFeedbackDisplay === request.donationId ? null : request.donationId)} className="btn btn-outline btn-small">View Feedback</button>
                                                {request.status === 'pending' && <button onClick={() => handleDeleteRequest(request.requestId)} className="btn btn-danger btn-small">Cancel Request</button>}
                                            </div>
                                            {showFeedbackDisplay === request.donationId && <div className="feedback-section"><FeedbackDisplay donationId={request.donationId} /></div>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {approvedHistory.length > 0 && (
                                <div className="history-section mt-4">
                                    <h2>My Support History</h2>
                                    <div className="admin-table-wrapper">
                                        <table className="admin-table">
                                            <thead><tr><th>Food Item</th><th>Donor Name</th><th>Donor Contact</th><th>Date</th><th>Status</th></tr></thead>
                                            <tbody>
                                                {approvedHistory.map((request) => (
                                                    <tr key={request.requestId}>
                                                        <td><strong>{requestDonations[request.donationId]?.foodType || 'Food'}</strong></td>
                                                        <td>{userMap[requestDonations[request.donationId]?.userId]?.name || 'Unknown'}</td>
                                                        <td>{userMap[requestDonations[request.donationId]?.userId]?.phoneNumber || 'N/A'}</td>
                                                        <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                                                        <td><span className={`status-badge ${request.status}`}>{request.status}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'donations' && currentUser.userType !== 'receiver' && (
                        <div className="history-section mt-4">
                            <h2>Recipient History</h2>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead><tr><th>Food Item</th><th>Recipient Name</th><th>Contact</th><th>Date</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {recipientHistory.length === 0 ? <tr><td colSpan="5" className="text-center">No recipient history found yet.</td></tr> : recipientHistory.map(({ donation, request }) => (
                                            <tr key={request.requestId}>
                                                <td><strong>{donation.foodType}</strong></td>
                                                <td>{userMap[request.receiverId]?.name || `User #${request.receiverId}`}</td>
                                                <td>{userMap[request.receiverId]?.phoneNumber || 'N/A'}</td>
                                                <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                                                <td><span className={`status-badge ${request.status}`}>{request.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {showFeedbackForm && <FeedbackForm donationId={showFeedbackForm} userId={currentUser.userId} onFeedbackSubmitted={() => { alert('Thank you for your feedback!'); fetchDashboardData(); }} onClose={() => setShowFeedbackForm(null)} />}
            {editingDonation && <EditDonationModal donation={editingDonation} onDonationUpdated={() => { alert('Donation updated successfully!'); fetchDashboardData(); }} onClose={() => setEditingDonation(null)} />}
        </div>
    );
}

export default Dashboard;
