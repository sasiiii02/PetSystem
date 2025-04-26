import mongoose from 'mongoose';

const professionalSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Never return password in queries
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: (v) => /^\d{10}$/.test(v),
      message: props => `${props.value} is not a valid phone number!`
    }
  },

  // Professional Details
  role: {
    type: String,
    required: true,
    enum: ['groomer', 'veterinarian', 'pet-trainer'],
    default: 'groomer'
  },
  professionalId: {  // e.g., "vet001", "groom002", "trainer003"
    type: String,
    required: [true, 'Professional ID is required'],
    unique: true,
    trim: true
  },
  specialization: {  // e.g., "Dog Grooming", "Exotic Pets", "Obedience Training"
    type: String,
    required: [true, 'Specialization is required'],
    trim: true
  },
  experience: {
    type: String,  // Could be "2 years" or "5 months"
    required: [true, 'Experience is required']
  },
  qualifications: {  // e.g., "Certified Vet", "Master Groomer"
    type: [String],  // Array to store multiple qualifications
    required: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    trim: true
  },

  // Status & Metadata
  isVerified: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  servicesOffered: {  // e.g., ["Bathing", "Nail Trimming", "Checkup"]
    type: [String],
    required: true
  },
  hourlyRate: {
    type: Number,
    min: [0, 'Hourly rate cannot be negative']
  },
  profileImage: {
    type: String,  // URL to image
    default: 'default-profile.jpg'
  }
}, {
  timestamps: true,  // Adds createdAt & updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Remove password from JSON responses
professionalSchema.methods.toJSON = function() {
  const professional = this.toObject();
  delete professional.password;
  return professional;
};

// Indexes for faster querying
professionalSchema.index({ email: 1, professionalId: 1, role: 1 });

const Professional = mongoose.model('Professional', professionalSchema);
export default Professional;