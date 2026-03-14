-- Food Donation Platform Database Schema

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS food_donations;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    user_type ENUM('donor', 'receiver', 'admin') NOT NULL DEFAULT 'donor',
    address TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
);

-- Food Donations Table
CREATE TABLE food_donations (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_type VARCHAR(100) NOT NULL,
    quantity VARCHAR(50) NOT NULL,
    expiry_time DATETIME NOT NULL,
    pickup_address TEXT NOT NULL,
    description TEXT,
    status ENUM('available', 'claimed', 'completed') NOT NULL DEFAULT 'available',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_user_id (user_id),
    INDEX idx_created_date (created_date)
);

-- Requests Table
CREATE TABLE requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT NOT NULL,
    receiver_id INT NOT NULL,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    pickup_time DATETIME,
    FOREIGN KEY (donation_id) REFERENCES food_donations(donation_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_donation_id (donation_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_status (status)
);

-- Feedback Table
CREATE TABLE feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    donation_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (donation_id) REFERENCES food_donations(donation_id) ON DELETE CASCADE,
    INDEX idx_donation_id (donation_id),
    INDEX idx_user_id (user_id)
);

-- Insert sample admin user (password: admin123)
INSERT INTO users (name, email, password, phone_number, user_type, address) 
VALUES ('Admin User', 'admin@fooddonation.com', 'admin123', '9876543210', 'admin', 'Admin Office, Mumbai');

-- Insert sample donor
INSERT INTO users (name, email, password, phone_number, user_type, address) 
VALUES ('Hotel Taj', 'taj@hotel.com', 'donor123', '9876543211', 'donor', 'Colaba, Mumbai');

-- Insert sample receiver
INSERT INTO users (name, email, password, phone_number, user_type, address) 
VALUES ('NGO Helper', 'ngo@helper.org', 'receiver123', '9876543212', 'receiver', 'Andheri, Mumbai');
