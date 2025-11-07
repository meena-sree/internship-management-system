const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";


//register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findByEmail(email);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create(name, email, hashedPassword, role);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};


//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    if (email === "admin@ims.com" && password === "admin123") {
      const token = jwt.sign(
        { id: 0, role: "admin", email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.json({
        message: "Admin login successful",
        token,
        user: { name: "Super Admin", email, role: "admin" },
      });
    }
    
    //find user
    const users = await User.findByEmail(email);
    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    //compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    //generate jwt
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    //response
    res.json({
      message: "Login successful",
      token,
      user: { id: user.user_id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};
