import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { foodAPI } from '../services/api';

function DonatePage({ currentUser }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        quantity: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const foodData = {
                ...formData,
                donorId: currentUser.id || currentUser.userId,
                claimed: false
            };

            await foodAPI.createFood(foodData);
            setSuccess('Food posted successfully!');

            setFormData({
                title: '',
                quantity: '',
                description: ''
            });

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create food post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="donate-page">
            <div className="page-header">
                <h1>Donate Food</h1>
                <p>Share your surplus food and make a difference</p>
            </div>

            <div className="donate-container">
                <div className="donate-info">
                    <h2>Why Donate?</h2>
                    <ul>
                        <li>Reduce food wastage</li>
                        <li>Help those in need</li>
                        <li>Contribute to sustainability</li>
                        <li>Build community connections</li>
                    </ul>

                    <div className="tips">
                        <h3>Tips for Donors</h3>
                        <p>Ensure food is fresh and safe to consume.</p>
                        <p>Pack food properly for transport.</p>
                    </div>
                </div>

                <div className="donate-form-container">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit} className="donate-form">
                        <div className="form-group">
                            <label htmlFor="title">Food Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="e.g., Rice, Curry, Snacks, Fruits"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="quantity">Quantity *</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                placeholder="e.g., 5, 20, 10"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description (Optional)</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Additional details about the food..."
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                            {loading ? 'Posting...' : 'Post Food'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DonatePage;
