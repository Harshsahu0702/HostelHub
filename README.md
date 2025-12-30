<div align="center">

  <h1>🏨 HostelHub - Smart Hostel Management System</h1>
  
  <p>
    <strong>A next-generation, full-stack solution for modernizing hostel administration and student life.</strong>
  </p>

  <p>
    <a href="https://hostel-hubb.vercel.app/" target="_blank"><strong>🚀 Live Demo</strong></a> |
    <a href="#features">✨ Features</a> |
    <a href="#tech-stack">🛠️ Tech Stack</a> |
    <a href="#installation">⚙️ Installation</a>
  </p>

  <br />

  <!-- Badges -->
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />

</div>

<br />

## 🌟 Overview

**HostelHub** is a comprehensive full-stack application designed to streamline the complex operations of hostel management. It bridges the gap between administrators and students through a seamless, digital interface. From **QR-code based digital attendance** to **real-time chat**, HostelHub ensures security, efficiency, and a premium user experience.

---

## ✨ Key Features

### 🛡️ Admin Dashboard (Command Center)
- **📊 Real-time Analytics**: Visual overview of hostel occupancy, attendance, and active complaints.
- **📷 Smart Attendance System**: Built-in **QR Code Scanner** for instant, fraud-proof student attendance.
- **👥 Student Management**: centralized portal to register students, manage credentials, and view profiles.
- **🛏️ Room Allotment**: Drag-and-drop style or easy interface for room and bed mapping.
- **📝 Complaint Resolution**: Track and resolve student issues with status updates.
- **📢 Real-time Chat**: Direct communication channel with students via Socket.io.
- **📤 Departure Management**: Approve or reject student leave requests digitally.
- **🍳 Mess Management**: Manage food menus and view mess-related feedback.

### 🎓 Student Panel
- **📱 Personalized Dashboard**: At-a-glance view of attendance, fees, and notices.
- **🎫 Digital Gate Pass**: Request QR-based gate passes for leaves and departures.
- **💬 Community Chat**: Real-time messaging with administration.
- **🍲 Mess Menu**: View daily and weekly food schedules.
- **🆘 Anti-Ragging Support**: Dedicated section for immediate help and reporting.
- **💳 Fee Status**: Check payment history and pending dues.
- **🗯️ Feedback & Complaints**: Raise issues directly to the admin.

---

## 🛠️ Tech Stack

### Frontend (Client-Side)
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (for modern, responsive design)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (smooth transitions) & TSParticles
- **Routing**: React Router DOM v7
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios
- **QR Technology**: `html5-qrcode` (Scanning)
- **Icons**: Lucide React & React Icons

### Backend (Server-Side)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) (REST API)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & BCryptJS (Password Hashing)
- **Real-time**: Socket.io (Bi-directional communication)
- **QR Generation**: `qrcode` package

---

## 🛡️ Security Architecture

- **🔒 JWT Authentication**: Stateless authentication mechanism ensuring secure API access.
- **🛡️ BCrypt Hashing**: Industry-standard password hashing; passwords are never stored in plain text.
- **🕵️ Protected Routes**: Middleware to verify tokens and user roles (Admin vs. Student) before granting access.
- **🌐 CORS Configured**: Secure cross-origin resource sharing setup.
- **🔐 Environment Variables**: Sensitive keys (DB URI, JWT Secrets) are strictly kept out of the codebase using `.env`.

---

## ⚙️ Installation & Setup Workflow

Follow these steps to set up HostelHub locally on your machine.

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account (or local MongoDB)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Harshsahu0702/HostelHub.git
cd HostelHub
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

**Configuration**: Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```
*Note: Ensure your MongoDB IP whitelist allows connections.*

**Start Server**:
```bash
npm start
# or for development with auto-reload
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder:
```bash
cd ../hostel-hub
npm install
```

**Start Frontend**:
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

---

## 🚀 Deployment

### Frontend (Vercel)
The project includes a `vercel.json` for SPA routing support.
1. Push code to GitHub.
2. Import repository in Vercel.
3. Vercel automatically detects Vite.
4. Add environment variables if needed.
5. Deploy!

### Backend (Render/Railway)
1. Push code to GitHub.
2. Connect repository to Render/Railway.
3. specific build command `npm install`.
4. Start command `npm start`.
5. Add all `.env` variables in the dashboard.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Made with ❤️ by <strong>DETROIT'S</strong></p>
</div>
