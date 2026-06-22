# 📋 TaskPad - Task Management Application

<div align="center">

[![React](https://img.shields.io/badge/React-19.2.6-blue?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green?logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen?logo=mongodb)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/License-ISC-yellow)](LICENSE)

A modern, feature-rich task management application with real-time collaboration, role-based access control, and comprehensive reporting capabilities.

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Project Structure](#project-structure) • [API Documentation](#api-documentation) • [Contributing](#contributing)

</div>

---

## ✨ Features

### 👤 User Management
- **User Authentication** - Secure signup and login with JWT-based authentication
- **Role-Based Access Control** - Admin and User roles with different permissions
- **User Dashboard** - Personalized dashboard for task management
- **Profile Management** - Update user information and preferences

### 📝 Task Management
- **Create Tasks** - Create tasks with descriptions, due dates, and priorities
- **Task Tracking** - View, update, and delete tasks with real-time updates
- **Task Assignment** - Admin can assign tasks to users
- **Task Categories** - Organize tasks by categories or projects
- **Status Management** - Track task progress through different statuses

### 👨‍💼 Admin Panel
- **Dashboard Analytics** - View key metrics and insights
- **Task Management** - Full control over all tasks in the system
- **User Management** - Manage user accounts and permissions
- **Report Generation** - Export tasks and reports to Excel
- **System Monitoring** - Track system activity and performance

### 📊 Reporting & Analytics
- **Data Export** - Generate and download Excel reports
- **Charts & Graphs** - Visual representation of task metrics
- **Task Statistics** - View task completion rates and trends

### 🛡️ Security
- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Secure token-based authentication
- **CORS Protection** - Cross-origin request protection
- **Environment Variables** - Sensitive data management

---

## 🚀 Tech Stack

### Frontend
- **React 19.2.6** - Modern UI library
- **Vite** - Lightning-fast build tool
- **React Router v7** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library

### Backend
- **Node.js & Express.js** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **ExcelJS** - Excel report generation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Tools & Services
- **Concurrently** - Run multiple npm scripts simultaneously
- **Nodemon** - Auto-restart development server
- **ESLint** - Code linting

---

## 📦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskpad
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   cd client && npm install && cd ..
   ```

3. **Configure environment variables**

   Create `.env` file in the `server` directory:
   ```env
   PORT=8080
   CLIENT_URL=http://localhost:5173

   # MongoDB
   MONGOOSE_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

   # JWT Secrets
   ACCESS_TOKEN_SECRET=<your-secret-key>
   REFRESH_TOKEN_SECRET=<your-secret-key>
   
   # Token Expiry
   ACCESS_TOKEN_EXPIRY=30m
   REFRESH_TOKEN_EXPIRY=30d

   # Admin
   ADMIN_INVITE_TOKEN=<secure-token>
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   This will start both the client (http://localhost:5173) and server (http://localhost:8080) concurrently.

### Running Individual Services

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

---

## 📁 Project Structure

```
taskpad/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   ├── pages/                  # Page components
│   │   │   ├── admin/              # Admin dashboard & management
│   │   │   ├── auth/               # Login & signup
│   │   │   └── user/               # User dashboard & tasks
│   │   ├── context/                # React Context for state management
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── routes/                 # Route configuration
│   │   ├── utils/                  # Helper utilities
│   │   └── assets/                 # Static assets
│   ├── vite.config.js              # Vite configuration
│   ├── eslint.config.js            # ESLint configuration
│   └── package.json
│
├── server/                         # Node.js Backend
│   ├── src/
│   │   ├── controllers/            # Business logic
│   │   │   ├── auth.controllers.js
│   │   │   ├── task.controllers.js
│   │   │   ├── user.controllers.js
│   │   │   └── report.controllers.js
│   │   ├── models/                 # MongoDB schemas
│   │   │   ├── User.model.js
│   │   │   └── Task.model.js
│   │   ├── routes/                 # API endpoints
│   │   ├── middlewares/            # Custom middleware
│   │   ├── db/                     # Database connection
│   │   ├── utils/                  # Helper utilities
│   │   ├── uploads/                # File uploads directory
│   │   ├── app.js                  # Express app setup
│   │   └── index.js                # Server entry point
│   ├── .env                        # Environment variables
│   └── package.json
│
└── package.json                    # Root package configuration
```

---

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### Task Endpoints
- `GET /api/tasks` - Get all tasks (user-specific)
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics

### User Endpoints
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin only)

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard metrics
- `POST /api/admin/users/invite` - Invite users
- `GET /api/admin/reports` - Generate reports
- `POST /api/reports/export` - Export data to Excel

---

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for secure authentication:

1. **Registration** - User creates account with email and password
2. **Login** - User receives access and refresh tokens
3. **Authorization** - Access token verified for protected routes
4. **Token Refresh** - Refresh token used to obtain new access token
5. **Logout** - Token invalidated on server side

Passwords are securely hashed using bcryptjs with salt rounds of 10.

---

## 🎨 User Roles

### User Role
- View own tasks
- Create and manage personal tasks
- View task details
- Update profile information

### Admin Role
- All user permissions
- View all tasks in system
- Manage other users
- Generate reports
- Export data to Excel
- System administration

---

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
```bash
# Add Procfile to root
echo "web: cd server && npm start" > Procfile

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy to Vercel
vercel deploy
```

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client and server in development mode |
| `npm run server` | Start only the backend server |
| `npm run client` | Start only the frontend client |
| `npm run build` | Build the client for production |
| `npm run lint` | Run ESLint on client code |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use ESLint for code consistency
- Follow naming conventions
- Write meaningful commit messages
- Add comments for complex logic

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 🆘 Support

For support, email support@taskpad.com or open an issue on GitHub.

---

## 📱 Screenshots

*Coming soon*

---

## 🗺️ Roadmap

- [ ] Real-time notifications
- [ ] Collaboration features
- [ ] Mobile app (React Native)
- [ ] Dark mode theme
- [ ] Advanced search and filtering
- [ ] Task templates
- [ ] Integration with third-party tools
- [ ] Performance optimization

---

<div align="center">

**Made with ❤️ by the TaskPad Team**

⭐ If you like this project, please consider giving it a star!

</div>
