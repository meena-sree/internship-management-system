const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Format: "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }

    // Save user data (id + role) in request object
    req.user = decoded;
    next();
  });
}

// Role-based check
function isStudent(req, res, next) {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: "Access denied. Students only." });
  }
  next();
}

function isCompany(req, res, next) {
  if (req.user.role !== 'company') {
    return res.status(403).json({ message: "Access denied. Companies only." });
  }
  next();
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
}

module.exports = { verifyToken, isStudent, isCompany, isAdmin };
