import jwt from "jsonwebtoken";
import Professional from "../models/professional.js";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerProfessional = async (req, res) => {
  const {pName,role,pID,pemail,ppassword,pphoneNumber,qualification,experience,description,} = req.body;

  try {
    // Check if professional already exists
    const professionalExists = await Professional.findOne({ $or: [{ pemail }, { pID }] });
    if (professionalExists) {
      return res.status(400).json({
        message: professionalExists.pemail === pemail ? "Email already exists" : "Professional ID already exists",
      });
    }

    // Create new professional
    const professional = new Professional({
      pName,
      role,
      pID,
      pemail,
      ppassword,
      pphoneNumber: pphoneNumber || undefined,
      qualification,
      experience,
      description: description || undefined,
    });

    // Save professional (password will be hashed by pre-save hook)
    await professional.save();

    res.status(201).json({
      message: "Professional registered successfully.",
      professional: {
        pName: professional.pName,
        pemail: professional.pemail,
        role: professional.role,
        pID: professional.pID,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message || "Server error during registration" });
  }
};

export const loginProfessional = async (req, res) => {
  const { pemail, ppassword } = req.body;

  try {
    // Find professional by email
    const professional = await Professional.findOne({ pemail });
    
    if (!professional) {
      console.log("Professional not found for email:", pemail);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password using the comparePassword method
    const isMatch = await professional.comparePassword(ppassword);
    console.log("Password match result:", isMatch);
    console.log("Stored password hash:", professional.ppassword);
    
    if (!isMatch) {
      console.log("Password mismatch for professional:", professional.pemail);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(professional._id);

    res.status(200).json({
      token,
      _id: professional._id,
      name: professional.pName,
      email: professional.pemail,
      role: professional.role
    });
  } catch (error) {
    console.error("Login error details:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Get professional profile
export const getProfile = async (req, res) => {
  try {
    const professional = await Professional.findById(req.user.id).select('-ppassword');
    res.json(professional);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllProfessionals = async (req, res) => {
  try {
    const professionals = await Professional.find().select('-password');
    res.status(200).json(professionals);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProfileById = async (req, res) => {
  try {

    const professional = await Professional.findById(professionalId);
    if (!professional) {
      return res.status(404).json({ message: 'professional not found' });
    }

    await User.findByIdAndDelete(professionalId);
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const updateProfessional = async (req, res) => {
  try {
    const admin = await Professional.findById(req.userId);
    const { name, professionalEmail, phoneNumber, city, role } = req.body;
    const professional = await Professional.findById(professionalId);
    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' });
    }
    professional.name = name || professional.name;
    professional.professionalEmail = professionalEmail || professional.professionalEmail;
    professional.phoneNumber = phoneNumber || professional.phoneNumber;
    professional.city = city || professional.city;
    professional.role = role || professional.role;
    await professional.save();
    res.status(200).json({ message: 'Profile updated successfully', professional });
  } catch (error) {
    console.error('Error updating professional:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};