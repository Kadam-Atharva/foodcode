import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationAPI, fileAPI } from '../services/api';

function DonatePage({ currentUser }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        foodType: '',
        quantity: '',
        expiryTime: '',
        pickupAddress: '',
        description: '',
        latitude: null,
        longitude: null
    });
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
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
        setSuccess('');
        setLoading(true);

        try {
            let imageUrl = null;
            if (imageFile) {
                const uploadRes = await fileAPI.uploadImage(imageFile);
                imageUrl = uploadRes.data.imageUrl;
            }

            const donationData = {
                ...formData,
                imageUrl: imageUrl,
                userId: currentUser.userId
            };

            await donationAPI.createDonation(donationData);
            setSuccess('✅ Donation posted successfully!');

            // Reset form
            setFormData({
                foodType: '',
                quantity: '',
                expiryTime: '',
                pickupAddress: '',
                description: '',
                latitude: null,
                longitude: null
            });

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create donation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (window.L && mapRef.current && !mapInstanceRef.current) {
            // Default center (Mumbai)
            const defaultPos = [19.0760, 72.8777];
            
            const map = window.L.map(mapRef.current).setView(defaultPos, 13);
            mapInstanceRef.current = map;

            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            const marker = window.L.marker(defaultPos, {
                draggable: true
            }).addTo(map);
            markerRef.current = marker;

            // Try to get user's current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    const userPos = [latitude, longitude];
                    map.setView(userPos, 15);
                    marker.setLatLng(userPos);
                    updateCoords(latitude, longitude);
                });
            }

            marker.on('dragend', () => {
                const pos = marker.getLatLng();
                updateCoords(pos.lat, pos.lng);
            });

            map.on('click', (e) => {
                const pos = e.latlng;
                marker.setLatLng(pos);
                updateCoords(pos.lat, pos.lng);
            });
        }
    }, []);

    const updateCoords = (lat, lng) => {
        setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    };

    return (
        <div className="donate-page">
            <div className="page-header">
                <h1>🍽️ Donate Food</h1>
                <p>Share your surplus food and make a difference</p>
            </div>

            <div className="donate-container">
                <div className="donate-info">
                    <h2>Why Donate?</h2>
                    <ul>
                        <li>✅ Reduce food wastage</li>
                        <li>❤️ Help those in need</li>
                        <li>🌍 Contribute to sustainability</li>
                        <li>🤝 Build community connections</li>
                    </ul>

                    <div className="tips">
                        <h3>Tips for Donors</h3>
                        <p>• Ensure food is fresh and safe to consume</p>
                        <p>• Provide accurate expiry information</p>
                        <p>• Be available for pickup coordination</p>
                        <p>• Pack food properly for transport</p>
                    </div>
                </div>

                <div className="donate-form-container">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit} className="donate-form">
                        <div className="form-group">
                            <label htmlFor="foodType">Food Type *</label>
                            <input
                                type="text"
                                id="foodType"
                                name="foodType"
                                placeholder="e.g., Rice, Curry, Snacks, Fruits"
                                value={formData.foodType}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="imageFile">Food Image (Optional)</label>
                            <input
                                type="file"
                                id="imageFile"
                                name="imageFile"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="quantity">Quantity *</label>
                            <input
                                type="text"
                                id="quantity"
                                name="quantity"
                                placeholder="e.g., 5 kg, 20 plates, 10 boxes"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="expiryTime">Expiry Date & Time *</label>
                            <input
                                type="datetime-local"
                                id="expiryTime"
                                name="expiryTime"
                                value={formData.expiryTime}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="pickupAddress">Pickup Address *</label>
                            <textarea
                                id="pickupAddress"
                                name="pickupAddress"
                                placeholder="Enter complete pickup address with landmarks"
                                value={formData.pickupAddress}
                                onChange={handleChange}
                                rows="3"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Pin Location on Map *</label>
                            <p className="small-text">Drag the marker or click on the map to set exact location</p>
                            <div 
                                ref={mapRef} 
                                style={{ 
                                    width: '100%', 
                                    height: '300px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #ddd',
                                    marginBottom: '1rem' 
                                }}
                            ></div>
                            {formData.latitude && (
                                <p className="success-text" style={{ fontSize: '0.85rem' }}>
                                    📍 Coordinates Set: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                                </p>
                            )}
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
                            {loading ? 'Posting...' : '🎁 Post Donation'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DonatePage;
