const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Backend running...');
});

// Import routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const { verifyToken, isStudent, isCompany } = require('./middleware/auth.middleware');

// Dummy test route for students
app.get('/api/student-only', verifyToken, isStudent, (req, res) => {
  res.json({ message: `Hello Student ${req.user.id}, you are authorized!` });
});

// Dummy test route for companies
app.get('/api/company-only', verifyToken, isCompany, (req, res) => {
  res.json({ message: `Hello Company ${req.user.id}, you are authorized!` });
});

//internship
const internshipRoutes = require("./routes/internship.routes");
app.use("/api/internships", internshipRoutes);

//application
const applicationRoutes = require("./routes/application.routes");
app.use("/api/applications", applicationRoutes);


//tests
const testRoutes = require("./routes/test.routes");
app.use("/api/tests", testRoutes);

//notification
const notificationRoutes = require("./routes/notification.routes");
app.use("/api/notifications", notificationRoutes);

//offer
const offerRoutes = require("./routes/offer.routes");
app.use("/api/offers", offerRoutes);
