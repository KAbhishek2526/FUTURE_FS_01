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

/**
 * @desc    Register a new customer account
 * @route   POST /api/users/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user account already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Direct database initialization (the pre-save hook handles hashing automatically)
    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      // Nesting user for frontend AuthContext compatibility
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error processing user registration.',
      error: error.message,
    });
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

    // Explicitly select password field since it is omitted by default in the schema
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Verify password match using our custom instance schema method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      // Nesting user for frontend AuthContext compatibility
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error processing user session authentication.',
      error: error.message,
    });
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

// OTP-based authentication modules
const Otp = require('../models/Otp');
const { sendOtpEmail } = require('../services/emailService');

exports.requestOtp = async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // If registration, ensure account doesn't exist
    if (type === 'register') {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }
    }

    // If login, ensure account exists
    if (type === 'login') {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (!userExists) {
        return res.status(400).json({ success: false, message: 'No account found with this email. Please register.' });
      }
    }

    // Generate 6-digit random code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Cache / save to MongoDB Otp schema with 5m TTL expiry
    await Otp.findOneAndUpdate(
      { email: normalizedEmail },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send email (via SMTP or console logging simulation)
    await sendOtpEmail(normalizedEmail, otp);

    res.status(200).json({
      success: true,
      message: 'OTP successfully dispatched to email.',
      devOtp: otp // Returned in JSON response for sandbox ease!
    });
  } catch (error) {
    console.error('Request OTP Error:', error);
    res.status(500).json({ success: false, message: 'Server error requesting verification code.', error: error.message });
  }
};

exports.verifyRegisterOtp = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ success: false, message: 'All fields name, email, password, and OTP are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify OTP code matches cache
    const record = await Otp.findOne({ email: normalizedEmail });
    if (!record || record.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP verification code.' });
    }

    // Clear verification cache
    await Otp.deleteOne({ _id: record._id });

    // Double check race condition for existing profile
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Save profile to database
    const user = await User.create({ name, email: normalizedEmail, password });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verify Register OTP Error:', error);
    res.status(500).json({ success: false, message: 'Server error verifying registration code.', error: error.message });
  }
};

exports.verifyLoginOtp = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password || !otp) {
      return res.status(400).json({ success: false, message: 'Email, password, and OTP are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check credentials first
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Check OTP matches cache
    const record = await Otp.findOne({ email: normalizedEmail });
    if (!record || record.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP verification code.' });
    }

    // Clear verification cache
    await Otp.deleteOne({ _id: record._id });

    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verify Login OTP Error:', error);
    res.status(500).json({ success: false, message: 'Server error verifying login code.', error: error.message });
  }
};
