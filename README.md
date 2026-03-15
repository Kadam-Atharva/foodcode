# 🍎 Food Donation Platform - Real-time Community Support

A premium, full-stack application designed to reduce food waste and support those in need. This platform connects individual donors, hotels, and businesses with NGOs and community centers using real-time communication and advanced mapping.

---

## 🌟 Premium Features

### ⚡ Real-Time Notifications
Developed using **WebSockets (STOMP)**, the platform provides instant, bidirectional updates:
- **Instant Donor Alerts:** Get notified the second someone requests your food.
- **Instant Status Reveals:** Receivers get immediate confirmation when a request is approved.
- **Global Broadcasts:** Real-time alerts to all logged-in users when new food is posted.
- **Micro-Animations:** Beautiful, glassmorphic toast alerts for a state-of-the-art user experience.

### 🗺️ Interactive Map & Discovery
- **Live Maps:** Integrated with Leaflet.js to visualize donations across the city.
- **Precise Location:** Geolocation mapping for accurate pickup points.
- **Smart Filtering:** Search for specific food types (e.g., "Veg", "Meals") instantly.

### 🤝 Transparency & Role-Based UI
- **Verified History:** Dedicated **"Recipient History"** for Donors and **"Support History"** for Receivers.
- **Privacy Controls:** Donor/Receiver contact details are revealed **only** after a mutual agreement (Approval).
- **Custom Dashboards:** Tailored interfaces for Donors, Receivers, and Admins to manage their specific workflows.

---

## 🚀 Technology Stack

- **Backend:** Spring Boot (Java 17), Spring Data JPA, Spring WebSocket, Spring Mail, MySQL
- **Frontend:** React.js, Leaflet.js, SockJS, StompJS, Axios, CSS3 (Modern Glassmorphism)
- **Tools:** Maven, Git, VS Code

---

## 🛠️ Detailed Setup Instructions

### 1. Prerequisites
- **Java 17** or higher
- **Maven** (optional if using `mvnw`)
- **Node.js 18+** and npm
- **MySQL 8.x**

### 2. Database Configuration
1. Create a database named `food_donation_db` in MySQL.
2. Edit `food-donation-backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/food_donation_db
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```

### 3. Running the Backend
```bash
cd food-donation-backend
.\mvnw.cmd clean spring-boot:run
```
*The backend will be available at `http://localhost:8080`*

### 4. Running the Frontend
```bash
cd food-donation-frontend
npm install
npm run dev
```
*Open `http://localhost:5173` to view the application.*

---

## 🍱 API Architecture

### 👤 User Services
- `POST /api/users/register` - New user signup
- `POST /api/users/login` - Secure authentication
- `GET /api/users/{id}` - Profile retrieval

### 🍎 Donation & Tracking
- `POST /api/donations` - Create a new listing
- `GET /api/donations/available` - Fetch active items for the map
- `PATCH /api/donations/{id}/status` - Update lifecycle (Available -> Claimed -> Completed)

### 📩 Request Management
- `POST /api/requests` - Claim a food item
- `PATCH /api/requests/{id}/status` - Donor approval/rejection logic
- `GET /api/requests/receiver/{id}` - Receiver-side history

---

## 👥 Access & Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@fooddonation.com` | `admin123` |
| **Donor** | `taj@hotel.com` | `donor123` |
| **Receiver** | `ngo@helper.org` | `receiver123` |

---

## 📂 Project Structure
```text
├── food-donation-backend/     # Spring Boot Source & Resources
├── food-donation-frontend/    # React Components, Context & Context
└── README.md                  # Detailed Documentation
```

Developed with ❤️ to bridge the gap between surplus and scarcity.
