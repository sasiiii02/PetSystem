import rateLimit from 'express-rate-limit';
import Professional from '../models/professionalModel.js';
import jwt from 'jsonwebtoken';

// Login rate limiter
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true,
});

// Login controller
export const profLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
 HAMZA    }

    // Find professional by email only
    const professional = await Professional.findOne({ pemail: email });
    console.log('Found professional:', professional);

    if (!professional) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await professional.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT with id, pID, and role
    const token = jwt.sign(
      {
        id: professional._id,
        pID: professional.pID,
        role: professional.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      professional: professional.toJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Server error during login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Registration controller
export const profRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      pID,
      pphoneNumber,
      qualification,
      experience,
      description,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role || !pID || !qualification || !experience) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Normalize role to lowercase
    const normalizedRole = role.toLowerCase();

    // Check if professional already exists
    const existingProf = await Professional.findOne({ pemail: email });
    if (existingProf) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new professional
    const professional = new Professional({
      pName: name,
      pemail: email,
      ppassword: password,
      role: normalizedRole,
      pID,
      pphoneNumber,
      qualification,
      experience,
      description,
    });

    await professional.save();

    // Generate JWT with id, pID, and role
    const token = jwt.sign(
      {
        id: professional._id,
        pID: professional.pID,
        role: professional.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      professional: professional.toJSON(),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Server error during registration',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Logout controller
export const profLogout = (req, res) => {
  res.status(200).json({ message: 'Logout successful - please remove token client-side' });
};

export default {
  profLogin,
  profRegister,
  profLogout,
  loginLimiter,
};