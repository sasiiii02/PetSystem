import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Pet from '../models/Pet.js'; // Import Pet model for cascading deletion

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @route   POST /api/users/register
// @desc    Register a new user
export const registerUser = async (req, res) => {
  const { name, email, phoneNumber, city, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ name, email, phoneNumber, city, password });
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        city: newUser.city,
        token: generateToken(newUser),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// @route   POST /api/users/login
// @desc    Authenticate user & get token
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        city: user.city,
        token: generateToken(user),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// @route   GET /api/users/profile
// @desc    Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// @route   PUT /api/users/profile
// @desc    Update user profile
export const updateProfile = async (req, res) => {
  const { name, email, phoneNumber, city } = req.body;
  const userId = req.user.userId; // Consistent with generateToken

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check for duplicate email (excluding current user)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return res.status(400).json({ message: 'Email already in use' });
    }

    // Update only provided fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.city = city || user.city;

    await user.save();

    // Regenerate token if name or email changed
    const token = generateToken(user);

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        city: user.city,
        token,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already in use' });
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ message: Object.values(error.errors)[0].message });
    } else {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  }
};

// @route   DELETE /api/users/profile
// @desc    Delete user profile
export const deleteProfile = async (req, res) => {
  const userId = req.user.userId; // Consistent with generateToken

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete associated pets (cascading deletion)
    await Pet.deleteMany({ userId });

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Profile and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting profile', error: error.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProfileById = async (req, res) => {
  try {

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};