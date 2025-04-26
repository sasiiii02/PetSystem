import mongoose from 'mongoose';

const medicalReportSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ['Medical', 'Grooming', 'Training', 'vaccination'] // Added 'vaccination' to enum
  },
  date: { type: Date, required: true },
  diagnosis: { type: String, required: function() { return this.type === 'Medical'; } },
  treatment: { type: String, required: function() { return this.type === 'Medical'; } },
  groomingService: { type: String, required: function() { return this.type === 'Grooming'; } },
  groomerNotes: { type: String, required: function() { return this.type === 'Grooming'; } },
  trainingFocus: { type: String, required: function() { return this.type === 'Training'; } },
  trainerNotes: { type: String, required: function() { return this.type === 'Training'; } },
  description: { type: String, required: function() { return this.type === 'vaccination'; } }, // Added for vaccination records
  doctorId: { type: String, required: function() { return this.type === 'vaccination'; } } // Added for vaccination records
});

const petSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  gender:{ type : String, required: true },
  breed: { type: String, required: true },
  petBYear: { type: Number, required: true },
  vaccinations: { type: String, required: true },
  specialNotes: { type: String },
  petimage:{type: String},
  medicalRecords: [medicalReportSchema],
});

export default mongoose.model('Pet', petSchema);