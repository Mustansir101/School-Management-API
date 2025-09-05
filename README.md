# School Management API

A RESTful API for managing school data with proximity-based sorting functionality. Built with Node.js, Express.js, and MySQL.

## 🚀 Features

- **Add Schools**: Store school information with geographic coordinates
- **Proximity Search**: Find schools sorted by distance from user's location
- **Input Validation**: Comprehensive validation for all inputs
- **Error Handling**: Proper HTTP status codes and error messages
- **CORS Support**: Cross-origin resource sharing enabled
- **Environment Configuration**: Flexible configuration for different environments

## 📋 Prerequisites

- Node.js (v18.0.0 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## 🛠️ Installation

**Set up environment variables**

Create a `.env` file in the root directory:

```bash
PORT = 3000
DB_HOST = localhost
DB_USER = your_mysql_username
DB_PASSWORD = your_mysql_password
DB_NAME = school_management
DB_PORT = 3306
```

**Set up the database**

Execute these SQL commands in your MySQL database:

```sql
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

CREATE TABLE IF NOT EXISTS schools (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, address VARCHAR(500) NOT NULL, latitude FLOAT(10, 6) NOT NULL, longitude FLOAT(10, 6) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

CREATE INDEX idx_coordinates ON schools (latitude, longitude);
```

## 🔗 API Endpoints

### Base URL

- **Local**: `http://localhost:3000`
- **Production**: `[YOUR_DEPLOYED_URL_HERE]`

### Endpoints

#### 1. Health Check

- **URL**: `GET /health`
- **Description**: Check if the server is running
- **Response**:
  ```json
  {
    "success": true,
    "message": "Server is running",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```

#### 2. Add School

- **URL**: `POST /api/addSchool`
- **Description**: Add a new school to the database
- **Request Body**:
  ```json
  {
    "name": "Springfield Elementary",
    "address": "742 Evergreen Terrace, Springfield, IL",
    "latitude": 39.7817,
    "longitude": -89.6501
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "message": "School added successfully",
    "data": {
      "id": 6,
      "name": "Springfield Elementary",
      "address": "742 Evergreen Terrace, Springfield, IL",
      "latitude": 39.7817,
      "longitude": -89.6501
    }
  }
  ```
- **Validation Rules**:
  - All fields are required
  - `name` and `address` must be non-empty strings
  - `latitude` must be between -90 and 90
  - `longitude` must be between -180 and 180

#### 3. List Schools by Proximity

- **URL**: `GET /api/listSchools`
- **Description**: Get all schools sorted by distance from user's location
- **Query Parameters**:
  - `latitude` (required): User's latitude
  - `longitude` (required): User's longitude
- **Example**: `/api/listSchools?latitude=40.7128&longitude=-74.0060`
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Schools retrieved and sorted by proximity",
    "data": [
      {
        "id": 5,
        "name": "Northside Primary",
        "address": "654 Cedar Road, New York, NY",
        "latitude": 40.7128,
        "longitude": -74.006,
        "distance": 0
      },
      {
        "id": 2,
        "name": "Riverside Elementary",
        "address": "456 Pine Avenue, Chicago, IL",
        "latitude": 41.8781,
        "longitude": -87.6298,
        "distance": 1145.33
      }
    ]
  }
  ```

## 📮 Postman Collection

**Import the Postman collection to test all endpoints:**

**Check it out** : [School Management API Collection](https://documenter.getpostman.com/view/39785900/2sB3Hkpfi9)

**Collection includes:**

- All API endpoints with example requests
- Different test scenarios (valid/invalid data)
- Multiple location examples for proximity testing

## 🌐 Live Demo

**API Base URL**: `[YOUR_DEPLOYED_URL_HERE]`

**Test the API:**

- Health Check: `/health`
- Add School: `POST /api/addSchool`
- List Schools: `GET /api/listSchools?latitude=40.7128&longitude=-74.0060`

## 🏗️ Project Structure

```
school-management-api/
│
├── src/ index.js          # Main server file
│
├── database/ index.js          # Database configuration
│
├── routes/ index.js          # API routes
│
├── .env                  # Environment variables
├── package.json         # Dependencies and scripts
```

## 🛡️ Input Validation

The API includes comprehensive input validation:

- **Required Fields**: All fields must be provided
- **Data Types**: Proper type checking for strings and numbers
- **Coordinate Validation**: Latitude (-90 to 90) and longitude (-180 to 180) range checking
- **String Sanitization**: Automatic trimming of whitespace

## 🗄️ Database Schema

**Table**: `schools`

| Column     | Type         | Constraints                 |
| ---------- | ------------ | --------------------------- |
| id         | INT          | PRIMARY KEY, AUTO_INCREMENT |
| name       | VARCHAR(255) | NOT NULL                    |
| address    | VARCHAR(500) | NOT NULL                    |
| latitude   | FLOAT(10,6)  | NOT NULL                    |
| longitude  | FLOAT(10,6)  | NOT NULL                    |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   |
| updated_at | TIMESTAMP    | ON UPDATE CURRENT_TIMESTAMP |

**Indexes**: Composite index on (latitude, longitude) for optimized distance queries.

## 📐 Distance Calculation

The API uses the **Haversine formula** to calculate accurate distances between geographic coordinates:

```javascript
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};
```

---

**Built with ❤️ by Mustansir**
