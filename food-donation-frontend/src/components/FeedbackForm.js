import React, { useState } from 'react';
import { feedbackAPI } from '../services/api';

function FeedbackForm({ donationId, userId, onFeedbackSubmitted, onClose }) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setError('');
        setLoading(true);

        try {
            await feedbackAPI.createFeedback({
                userId,
                donationId,
                rating,
                comment
            });
            if (onFeedbackSubmitted) onFeedbackSubmitted();
            if (onClose) onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
            >
                {star <= (hoveredRating || rating) ? '★' : '☆'}
            </span>
        ));
    };

    const getRatingLabel = () => {
        const labels = {
            1: 'Poor',
            2: 'Fair',
            3: 'Good',
            4: 'Very Good',
            5: 'Excellent!'
        };
        return labels[hoveredRating || rating] || 'Select a rating';
    };

    return (
        <div className="feedback-modal-overlay" onClick={onClose}>
            <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
                <div className="feedback-modal-header">
                    <h3>📝 Leave Feedback</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="feedback-form">
                    <div className="rating-section">
                        <label>How was your experience?</label>
                        <div className="stars-container">
                            {renderStars()}
                        </div>
                        <span className="rating-label">{getRatingLabel()}</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="feedback-comment">Your Comment</label>
                        <textarea
                            id="feedback-comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience about this food donation..."
                            rows="4"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : '✅ Submit Feedback'}
                        </button>
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FeedbackForm;
