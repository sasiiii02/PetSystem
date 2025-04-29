import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import userRoutes from "./routes/userRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import profRoutes from './routes/profRoutes.js'; // Professional auth routes
import adminRoutes from "./routes/adminRoutes.js";

import appointmentRoutes from './routes/appointmentRoutes.js';
import notificationRoutes from "./routes/notificationRoutes.js";
import adoptablePetRoutes from './routes/adoptablePetRoutes.js';
import adoptionFormRoutes from './routes/adoptionFormRoutes.js';
import forAdoptionRoutes from './routes/forAdoptionRoutes.js';
import passDataAdoptablePetTable from './routes/passDataAdoptablePetTable.js';
import eventRoutes from "./routes/eventRoutes.js"; // Import event routes
import registrationRoutes from "./routes/registrationRoutes.js";
import professionalAppointmentRoutes from './routes/appointmentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests
app.use('/uploads', express.static('uploads'));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'petcare_products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/admins", adminRoutes);


app.use('/api/appointments', appointmentRoutes); // User appointments
app.use('/api/professional-appointments', professionalAppointmentRoutes); // Professional appointments
app.use('/api/professionals', profRoutes); // Professional auth routes

 // Add the admin routes here
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/notifications", notificationRoutes);

// Adoption routes
app.use('/api/adoptablepets', adoptablePetRoutes);
app.use('/api/adoptionform', adoptionFormRoutes);
app.use('/api/foradoption', forAdoptionRoutes);
app.use('/api', passDataAdoptablePetTable);



const upload = multer({ storage: storage });

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://PetCareSys:PetCareSys@cluster0.iiemfla.mongodb.net/PetCare_db?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { 
    public_id: { type: String },
    url: { type: String }
  },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  inStock: { type: Number, required: true },
  rating: { type: Number, default: 4.5 },
  sold: { type: Number, default: 0 }
});

const Product = mongoose.model('Product', productSchema);



app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new product with image upload
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, subCategory, inStock } = req.body;
    
    const product = new Product({
      name,
      description,
      price,
      originalPrice,
      image: {
        public_id: req.file.public_id,
        url: req.file.path
      },
      category,
      subCategory,
      inStock
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);
