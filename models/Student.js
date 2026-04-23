const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 5, max: 100 },
  grade: { type: String, required: true, uppercase: true, enum: ['A','B','C','D','F'] },
  email: { type: String, required: true, unique: true, lowercase: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);