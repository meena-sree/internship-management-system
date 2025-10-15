# Internship Management System (IMS)

A full-stack **Internship Management System** built with **React.js**, **Node.js (Express)**, and **MySQL**.  
It enables **students** to apply for internships, **companies** to post opportunities, and both to track applications, tests, and offers seamlessly.

---

## Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React.js, Redux Toolkit, Axios, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Authentication** | JWT (JSON Web Token), bcrypt |
| **Version Control** | Git & GitHub |

---

##  Core Features

###  For Students:
- Register and log in securely  
- View and apply for internships  
- Take internship-specific tests (if assigned)  
- Track application status (Applied / Interview / Rejected / Offered)  
- View received offers and notifications  

### For Companies:
- Register and post internships  
- View applications and manage statuses  
- Create tests for internships  
- Send offers to shortlisted candidates  
- Notify students automatically of status changes  

---

## System Architecture Overview
Frontend (React)
↓
Axios HTTP Requests
↓
Backend (Node + Express)
↓
Middleware (JWT Auth, Role Checks)
↓
Controller (Business Logic)
↓
Model (MySQL Queries)
↓
Database (internship_db)


---

## Project Structure

ims/
├── client/ → React frontend
│ ├── src/
│ │ ├── pages/ → Login, Dashboard, Listings, etc.
│ │ ├── components/ → Navbar, Footer, ProtectedRoute
│ │ └── redux/ → authSlice, store.js
│ └── package.json
│
├── server/ → Node.js backend
│ ├── controllers/ → Business logic
│ ├── models/ → Database operations
│ ├── middleware/ → JWT & role-based auth
│ ├── routes/ → API endpoints
│ ├── config/ → db.config.js (MySQL connection)
│ └── server.js
│
├── README.md  Project documentation
├── .gitignore
└── .gitattributes

## Database Setup
1. Open MySQL and create a new database named `internship_db`.
2. Run the SQL script in `internship_db.sql` to create all tables.


### Future Enhancements

Email-based notification
File uploads for resumes
Containerization with Docker
