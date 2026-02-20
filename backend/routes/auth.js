const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT
const signToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Helper: send response
const sendAuthResponse = (res, statusCode, user) => {
  const token = signToken(user._id, user.role);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};


// ==============================
// REGISTER
// ==============================
router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters'),

    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email required'),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already exists',
        });
      }

      const user = await User.create({
        username,
        email,
        password,
      });

      sendAuthResponse(res, 201, user);

    } catch (err) {
      console.error('REGISTER ERROR:', err.message);
      res.status(500).json({
        success: false,
        message: 'Server error during registration',
      });
    }
  }
);


// ==============================
// LOGIN
// ==============================
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      sendAuthResponse(res, 200, user);

    } catch (err) {
      console.error('LOGIN ERROR:', err.message);
      res.status(500).json({
        success: false,
        message: 'Server error during login',
      });
    }
  }
);



// ==============================
// GET CURRENT USER
// ==============================
router.get('/me', protect, async (req, res) => {
  try {
    const { _id, username, email, role } = req.user;

    return res.status(200).json({
      success: true,
      user: {
        id: _id,
        username,
        email,
        role,
      },
    });
  }catch (error) {
  console.error("Registration error:", error); // 👈 add this
  res.status(500).json({ success: false, message: "Server error during registration" });
}
});

// ==============================
// EXPORT
// ==============================
module.exports = router;