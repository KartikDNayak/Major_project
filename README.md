## 🚀 Features

### 🎓 Student Experience
- **Course Discovery**: Browse, search, and filter courses by categories.
- **Dynamic Enrollment**: One-click enrollment with instant access to learning materials.
- **Interactive Lessons**: Video player integration with detailed lesson descriptions.
- **Progress Tracking**: Real-time progress percentage and lesson completion marking.
- **My Courses Dashboard**: Personalized view of all enrolled, active, and completed courses.

### 🛡️ Admin Capabilities
- **Management Portal**: Full CRUD operations for courses and lessons.
- **Insights Dashboard**: View platform-wide statistics (total users, courses, enrollments).
- **Control**: Toggle featured status and manage course metadata.

### 🛠️ Technical Highlights
- **3-Layer Architecture**: Controller-Service-Repository pattern for maximum maintainability.
- **Dual Persistence**: Zero-config **H2** (in-memory) for development and **MySQL** for production.
- **Modern UI**: Custom CSS with glassmorphism, smooth animations, and mobile-first responsiveness.
- **Data Seeding**: Automatic initialization with sample courses and demo accounts.

---

## 📂 Project Structure

```text
online-learning-platform/
├── pom.xml                                    # Maven dependencies
├── README.md                                  # Documentation
├── ss/                                        # Project screenshots
│
├── src/
│   ├── main/
│   │   ├── java/com/learning/platform/
│   │   │   ├── OnlineLearningPlatformApplication.java # Entry point
│   │   │   ├── config/                        # CORS & Data Seeding
│   │   │   ├── controller/                    # REST API Endpoints
│   │   │   ├── dto/                           # Data Transfer Objects
│   │   │   ├── model/                         # JPA Entities (Database Models)
│   │   │   ├── repository/                    # Spring Data JPA Repositories
│   │   │   └── service/                       # Business Logic Layer
│   │   │
│   │   └── resources/
│   │       ├── application.properties         # Default Configuration
│   │       ├── application-mysql.properties   # MySQL Configuration
│   │       └── static/                        # Frontend Assets
│   │           ├── *.html                     # Page Templates
│   │           ├── css/style.css              # Custom Design System
│   │           └── js/*.js                    # Frontend Logic & API Integration
```
## 🛠️ Installation & Setup

### Prerequisites
- **Java 17** or higher
- **Maven 3.8+**

### Quick Start (H2 In-Memory)
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd online-learning-platform
   ```
2. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```
3. **Access the platform**:
   Open `http://localhost:8080` in your browser.

### MySQL Configuration (Optional)
1. Create a database: `CREATE DATABASE learningdb;`
2. Update `src/main/resources/application-mysql.properties` with your MySQL user/password.
3. Run with the MySQL profile:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=mysql
   ```
---

## 🔐 Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| *Admin* | admin | admin123 |
| *User* | demo | demo123 |

---

## 🔌 API Documentation (Brief)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/courses | GET | Fetch all available courses |
| /api/auth/login | POST | Authenticate user |
| /api/enrollments | POST | Register for a course |
| /api/admin/stats | GET | Platform analytics (Admin only) |

---

## 📄 License
This project is licensed under the MIT License - feel free to use it for learning or commercial purposes.
