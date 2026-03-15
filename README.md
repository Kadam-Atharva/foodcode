<<<<<<< HEAD
# Food Donation Platform - Setup Instructions

## Prerequisites
- Java 17 or higher
- Maven
- MySQL 8.x
- Node.js 18+ and npm

## Backend Setup (Spring Boot)

### 1. Database Setup
```sql
-- Create database
CREATE DATABASE food_donation_db;

-- Use the database
USE food_donation_db;

-- Run the schema.sql file
-- The schema will be automatically created when you run the Spring Boot application
```

### 2. Configure Database Connection
Edit `food-donation-backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/food_donation_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 3. Run Backend
```bash
cd food-donation-backend
mvn clean install
mvn spring-boot:run
```

Backend will run on: http://localhost:8080

## Frontend Setup (React)

### 1. Install Dependencies
```bash
cd food-donation-frontend
npm install
```

### 2. Run Frontend
```bash
npm run dev
```

Frontend will run on: http://localhost:5173

## Testing the Application

### Sample Login Credentials
After running the backend, the database will have sample users:

**Admin:**
- Email: admin@fooddonation.com
- Password: admin123

**Donor:**
- Email: taj@hotel.com
- Password: donor123

**Receiver:**
- Email: ngo@helper.org
- Password: receiver123

### User Flow Testing

1. **Register/Login**: Go to http://localhost:5173 and register or login
2. **Donate Food**: Click "Donate Food" and fill the form
3. **Browse Donations**: View all available donations
4. **Request Food**: Click "Request This Food" on any donation
5. **Dashboard**: View your donations and requests
6. **Approve Requests**: As a donor, approve/reject requests for your donations

## API Endpoints

### Users
- POST `/api/users/register` - Register new user
- POST `/api/users/login` - Login user
- GET `/api/users` - Get all users
- GET `/api/users/{id}` - Get user by ID
- PUT `/api/users/{id}` - Update user
- DELETE `/api/users/{id}` - Delete user

### Donations
- POST `/api/donations` - Create donation
- GET `/api/donations` - Get all donations
- GET `/api/donations/{id}` - Get donation by ID
- GET `/api/donations/user/{userId}` - Get donations by user
- GET `/api/donations/available` - Get available donations
- GET `/api/donations/search?foodType={type}` - Search donations
- PUT `/api/donations/{id}` - Update donation
- PATCH `/api/donations/{id}/status` - Update donation status
- DELETE `/api/donations/{id}` - Delete donation

### Requests
- POST `/api/requests` - Create request
- GET `/api/requests` - Get all requests
- GET `/api/requests/{id}` - Get request by ID
- GET `/api/requests/donation/{donationId}` - Get requests by donation
- GET `/api/requests/receiver/{receiverId}` - Get requests by receiver
- PATCH `/api/requests/{id}/status` - Update request status
- PUT `/api/requests/{id}` - Update request
- DELETE `/api/requests/{id}` - Delete request

### Feedback
- POST `/api/feedback` - Create feedback
- GET `/api/feedback` - Get all feedback
- GET `/api/feedback/{id}` - Get feedback by ID
- GET `/api/feedback/donation/{donationId}` - Get feedback by donation
- GET `/api/feedback/user/{userId}` - Get feedback by user
- PUT `/api/feedback/{id}` - Update feedback
- DELETE `/api/feedback/{id}` - Delete feedback

## Project Structure

```
Full Stack Project/
├── food-donation-backend/
│   ├── src/main/java/com/fooddonation/
│   │   ├── FoodDonationApplication.java
│   │   ├── config/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   └── controller/
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── schema.sql
│   └── pom.xml
└── food-donation-frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── styles/
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── vite.config.js
```

## Troubleshooting

### Backend Issues
- Ensure MySQL is running
- Check database credentials in application.properties
- Verify Java 17+ is installed: `java -version`
- Check port 8080 is not in use

### Frontend Issues
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check port 5173 is not in use
- Ensure backend is running before testing frontend

## Future Enhancements
- Image upload for food donations
- Real-time notifications
- Location-based search with maps
- Mobile app (React Native)
- Admin dashboard
- Email notifications
- SMS alerts
- Rating system for donors
=======
# Food Donation Platform - Setup Instructions

## Prerequisites
- Java 17 or higher
- Maven
- MySQL 8.x
- Node.js 18+ and npm

## Backend Setup (Spring Boot)

### 1. Database Setup
```sql
-- Create database
CREATE DATABASE food_donation_db;

-- Use the database
USE food_donation_db;

-- Run the schema.sql file
-- The schema will be automatically created when you run the Spring Boot application
```

### 2. Configure Database Connection
Edit `food-donation-backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/food_donation_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 3. Run Backend
```bash
cd food-donation-backend
mvn clean install
mvn spring-boot:run
```

Backend will run on: http://localhost:8080

## Frontend Setup (React)

### 1. Install Dependencies
```bash
cd food-donation-frontend
npm install
```

### 2. Run Frontend
```bash
npm run dev
```

Frontend will run on: http://localhost:5173

## Testing the Application

### Sample Login Credentials
After running the backend, the database will have sample users:

**Admin:**
- Email: admin@fooddonation.com
- Password: admin123

**Donor:**
- Email: taj@hotel.com
- Password: donor123

**Receiver:**
- Email: ngo@helper.org
- Password: receiver123

### User Flow Testing

1. **Register/Login**: Go to http://localhost:5173 and register or login
2. **Donate Food**: Click "Donate Food" and fill the form
3. **Browse Donations**: View all available donations
4. **Request Food**: Click "Request This Food" on any donation
5. **Dashboard**: View your donations and requests
6. **Approve Requests**: As a donor, approve/reject requests for your donations

## API Endpoints

### Users
- POST `/api/users/register` - Register new user
- POST `/api/users/login` - Login user
- GET `/api/users` - Get all users
- GET `/api/users/{id}` - Get user by ID
- PUT `/api/users/{id}` - Update user
- DELETE `/api/users/{id}` - Delete user

### Donations
- POST `/api/donations` - Create donation
- GET `/api/donations` - Get all donations
- GET `/api/donations/{id}` - Get donation by ID
- GET `/api/donations/user/{userId}` - Get donations by user
- GET `/api/donations/available` - Get available donations
- GET `/api/donations/search?foodType={type}` - Search donations
- PUT `/api/donations/{id}` - Update donation
- PATCH `/api/donations/{id}/status` - Update donation status
- DELETE `/api/donations/{id}` - Delete donation

### Requests
- POST `/api/requests` - Create request
- GET `/api/requests` - Get all requests
- GET `/api/requests/{id}` - Get request by ID
- GET `/api/requests/donation/{donationId}` - Get requests by donation
- GET `/api/requests/receiver/{receiverId}` - Get requests by receiver
- PATCH `/api/requests/{id}/status` - Update request status
- PUT `/api/requests/{id}` - Update request
- DELETE `/api/requests/{id}` - Delete request

### Feedback
- POST `/api/feedback` - Create feedback
- GET `/api/feedback` - Get all feedback
- GET `/api/feedback/{id}` - Get feedback by ID
- GET `/api/feedback/donation/{donationId}` - Get feedback by donation
- GET `/api/feedback/user/{userId}` - Get feedback by user
- PUT `/api/feedback/{id}` - Update feedback
- DELETE `/api/feedback/{id}` - Delete feedback

## Project Structure

```
Full Stack Project/
├── food-donation-backend/
│   ├── src/main/java/com/fooddonation/
│   │   ├── FoodDonationApplication.java
│   │   ├── config/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   └── controller/
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── schema.sql
│   └── pom.xml
└── food-donation-frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── styles/
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── vite.config.js
```

## Troubleshooting

### Backend Issues
- Ensure MySQL is running
- Check database credentials in application.properties
- Verify Java 17+ is installed: `java -version`
- Check port 8080 is not in use

### Frontend Issues
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check port 5173 is not in use
- Ensure backend is running before testing frontend

## Future Enhancements
- Image upload for food donations
- Real-time notifications
- Location-based search with maps
- Mobile app (React Native)
- Admin dashboard
- Email notifications
- SMS alerts
- Rating system for donors
>>>>>>> 6baece981abcc2bdc992de1aa66bc474a7d3791b
