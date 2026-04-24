import React, { useState } from 'react';
import { donationAPI, fileAPI } from '../services/api';

function EditDonationModal({ donation, onDonationUpdated, onClose }) {
    const [formData, setFormData] = useState({
        foodType: donation.foodType || '',
        quantity: donation.quantity || '',
        expiryTime: donation.expiryTime ? donation.expiryTime.slice(0, 16) : '',
        pickupAddress: donation.pickupAddress || '',
        description: donation.description || '',
        status: donation.status || 'available'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let imageUrl = donation.imageUrl;
            if (imageFile) {
                const uploadRes = await fileAPI.uploadImage(imageFile);
                imageUrl = uploadRes.data.imageUrl;
            }

            const updateData = {
                ...formData,
                imageUrl,
                userId: donation.userId
            };
            await donationAPI.updateDonation(donation.donationId, updateData);
            if (onDonationUpdated) onDonationUpdated();
            if (onClose) onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update donation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feedback-modal-overlay" onClick={onClose}>
            <div className="feedback-modal edit-donation-modal" onClick={(e) => e.stopPropagation()}>
                <div className="feedback-modal-header">
                    <h3>Edit Donation</h3>
                    <button className="modal-close" onClick={onClose}>x</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="donate-form">
                    <div className="form-group">
                        <label htmlFor="edit-foodType">Food Type</label>
                        <input
                            type="text"
                            id="edit-foodType"
                            name="foodType"
                            value={formData.foodType}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-imageFile">Update Food Image (Optional)</label>
                        <input
                            type="file"
                            id="edit-imageFile"
                            name="imageFile"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                        {donation.imageUrl && !imageFile && (
                            <p className="small-text">Current image stored. Upload a new file to replace it.</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-quantity">Quantity</label>
                        <input
                            type="text"
                            id="edit-quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-expiryTime">Expiry Date & Time</label>
                        <input
                            type="datetime-local"
                            id="edit-expiryTime"
                            name="expiryTime"
                            value={formData.expiryTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-pickupAddress">Pickup Address</label>
                        <textarea
                            id="edit-pickupAddress"
                            name="pickupAddress"
                            value={formData.pickupAddress}
                            onChange={handleChange}
                            rows="3"
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
