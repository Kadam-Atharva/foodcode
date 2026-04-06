import React, { useState } from 'react';
import { foodAPI } from '../services/api';

function EditDonationModal({ donation, onDonationUpdated, onClose }) {
    const [formData, setFormData] = useState({
        title: donation.title || '',
        quantity: donation.quantity || '',
        description: donation.description || '',
        claimed: donation.claimed || false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const updateData = {
                ...formData,
                donorId: donation.donorId
            };
            await foodAPI.updateFood(donation.id, updateData);
            if (onDonationUpdated) onDonationUpdated();
            if (onClose) onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update food. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feedback-modal-overlay" onClick={onClose}>
            <div className="feedback-modal edit-donation-modal" onClick={(e) => e.stopPropagation()}>
                <div className="feedback-modal-header">
                    <h3>Edit Food</h3>
                    <button className="modal-close" onClick={onClose}>x</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="donate-form">
                    <div className="form-group">
                        <label htmlFor="edit-title">Title</label>
                        <input
                            type="text"
                            id="edit-title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-quantity">Quantity</label>
                        <input
                            type="number"
                            id="edit-quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-description">Description</label>
                        <textarea
                            id="edit-description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label htmlFor="edit-claimed" style={{ marginBottom: 0 }}>Is Claimed?</label>
                        <input
                            type="checkbox"
                            id="edit-claimed"
                            name="claimed"
                            checked={formData.claimed}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
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

export default EditDonationModal;
