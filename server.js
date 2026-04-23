require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('⚠️ MongoDB not connected yet'));

app.use('/api/students', require('./routes/students'));
// In-memory feedback storage
let feedbacks = [
    { id: 1, name: "Sarah Ahmed", message: "Campus is beautiful! The library is world-class.", rating: 5, date: "2026-04-15" },
    { id: 2, name: "Ali Raza", message: "Sports facilities are amazing. Love the environment.", rating: 4, date: "2026-04-16" }
];

// Get all feedback
app.get('/api/feedback', (req, res) => {
    res.json({ success: true, data: feedbacks });
});

// Add new feedback
app.post('/api/feedback', express.json(), (req, res) => {
    const { name, message, rating } = req.body;
    if (!name || !message || !rating) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }
    const newFeedback = {
        id: feedbacks.length + 1,
        name: name,
        message: message,
        rating: parseInt(rating),
        date: new Date().toISOString().split('T')[0]
    };
    feedbacks.push(newFeedback);
    res.status(201).json({ success: true, data: newFeedback });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/students', (req, res) => res.sendFile(path.join(__dirname, 'public', 'students.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get('/feedback', (req, res) => res.sendFile(path.join(__dirname, 'public', 'feedback.html')));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));