import React from 'react';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>🍽️ FoodShare</h3>
                    <p>Reducing food waste, feeding hope</p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/browse">Browse Donations</a></li>
                        <li><a href="/donate">Donate Food</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>Email: support@foodshare.com</p>
                    <p>Phone: +91 98765 43210</p>
                </div>

                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <div className="social-links">
                        <span>📘 Facebook</span>
                        <span>📷 Instagram</span>
                        <span>🐦 Twitter</span>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 FoodShare Platform. All rights reserved. Made with ❤️ for India</p>
            </div>
        </footer>
    );
}

export default Footer;
