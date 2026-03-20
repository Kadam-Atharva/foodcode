import React, { useState, useEffect } from 'react';
import { feedbackAPI, userAPI } from '../services/api';

function FeedbackDisplay({ donationId }) {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userNames, setUserNames] = useState({});

    useEffect(() => {
        fetchFeedbacks();
    }, [donationId]);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await feedbackAPI.getFeedbackByDonationId(donationId);
            setFeedbacks(response.data);

            const names = {};
            for (const fb of response.data) {
                if (!names[fb.userId]) {
                    try {
                        const userRes = await userAPI.getUserById(fb.userId);
                        names[fb.userId] = userRes.data.name;
                    } catch {
                        names[fb.userId] = 'Anonymous';
                    }
                }
            }
            setUserNames(names);
        } catch (err) {
            console.error('Failed to load feedbacks:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={`star-display ${star <= rating ? 'filled' : ''}`}>
                {star <= rating ? '★' : '☆'}
            </span>
        ));
    };

    const getAverageRating = () => {
        if (feedbacks.length === 0) return 0;
        const sum = feedbacks.reduce((acc, fb) => acc + fb.rating, 0);
        return (sum / feedbacks.length).toFixed(1);
    };

    if (loading) {
        return <div className="feedback-loading">Loading feedback...</div>;
    }

    if (feedbacks.length === 0) {
        return (
            <div className="no-feedback">
                <p>No feedback yet for this donation.</p>
            </div>
        );
    }

    return (
        <div className="feedback-display">
            <div className="feedback-summary">
                <div className="average-rating">
                    <span className="avg-number">{getAverageRating()}</span>
                    <div className="avg-stars">{renderStars(Math.round(getAverageRating()))}</div>
                    <span className="feedback-count">({feedbacks.length} review{feedbacks.length !== 1 ? 's' : ''})</span>
                </div>
            </div>

            <div className="feedback-list">
                {feedbacks.map((fb) => (
                    <div key={fb.feedbackId} className="feedback-item">
                        <div className="feedback-header">
                            <span className="feedback-user">
                                {userNames[fb.userId] || 'User'}
                            </span>
                            <div className="feedback-stars">
                                {renderStars(fb.rating)}
                            </div>
                        </div>
                        {fb.comment && (
                            <p className="feedback-comment">{fb.comment}</p>
                        )}
                        <span className="feedback-date">
                            {new Date(fb.feedbackDate).toLocaleDateString('en-IN', {
                                year: 'numeric', month: 'short', day: 'numeric'
                            })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FeedbackDisplay;
