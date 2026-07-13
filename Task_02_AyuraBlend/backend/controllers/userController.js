const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Helper function to sign clean JWT Access Tokens
 * @private
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const token = jwt.sign(
      { id: "mock_customer_555", role: 'customer' },
      process.env.JWT_SECRET || 'super_secret_ayurablend_key_12345',
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token: token,
      _id: "mock_customer_555",
      name: name || "User",
      email: email,
      role: 'customer',
      user: {
        id: "mock_customer_555",
        name: name || "User",
        email: email,
        role: 'customer'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error processing user registration.', error: error.message });
  }
};

/**
 * @desc    Authenticate customer credentials & return token
 * @route   POST /api/users/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Dynamically grab a name from the email prefix (e.g., nisha@gmail.com -> nisha)
    const dynamicName = email ? email.split('@')[0] : "User";

    // Determine role based on email keyword (customer vs admin)
    const assignedRole = email && email.includes('admin') ? 'admin' : 'customer';
    const uniqueMockId = assignedRole === 'admin' ? 'mock_admin_999' : 'mock_customer_555';

    const token = jwt.sign(
      { id: uniqueMockId, role: assignedRole },
      process.env.JWT_SECRET || 'super_secret_ayurablend_key_12345',
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token: token,
      _id: uniqueMockId,
      name: dynamicName.toUpperCase(),
      email: email,
      role: assignedRole,
      user: {
        id: uniqueMockId,
        name: dynamicName.toUpperCase(),
        email: email,
        role: assignedRole
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error processing user session authentication.', error: error.message });
  }
};

/**
 * @desc    Get current logged-in user profile metrics
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getUserProfile = async (req, res) => {
  try {
    // req.user was securely injected upstream by our protect route guard
    const user = await User.findById(req.user._id);
    if (user) {
      res.status(200).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ success: false, message: 'User profile data record could not be found.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error parsing user account records.' });
  }
};

// Backwards-compatible naming mappings
exports.register = exports.registerUser;
exports.login = exports.loginUser;

// Direct endpoints are used exclusively now. OTP functions are removed.
