const express = require('express');
const router = express.Router();

// In-memory storage
let students = [
    { _id: "1", name: "Sana", age: 17, grade: "A", email: "sana@example.com", createdAt: new Date() }
];
let nextId = 2;

// GET all students
router.get('/', (req, res) => {
    res.json({ success: true, data: students });
});

// ✅ GET single student by ID (yeh route pehle missing tha)
router.get('/:id', (req, res) => {
    const student = students.find(s => s._id === req.params.id);
    if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student });
});

// POST new student
router.post('/', (req, res) => {
    const { name, age, grade, email } = req.body;
    if (!name || !age || !grade || !email) {
        return res.status(400).json({ success: false, message: 'All fields required' });
    }
    if (students.some(s => s.email === email)) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    const newStudent = {
        _id: String(nextId++),
        name,
        age: parseInt(age),
        grade,
        email,
        createdAt: new Date()
    };
    students.push(newStudent);
    res.status(201).json({ success: true, data: newStudent });
});

// PUT update student
router.put('/:id', (req, res) => {
    const index = students.findIndex(s => s._id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Student not found' });
    }
    const { name, age, grade, email } = req.body;
    students[index].name = name;
    students[index].age = parseInt(age);
    students[index].grade = grade;
    students[index].email = email;
    res.json({ success: true, data: students[index] });
});

// DELETE student
router.delete('/:id', (req, res) => {
    const index = students.findIndex(s => s._id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Student not found' });
    }
    students.splice(index, 1);
    res.json({ success: true, message: 'Deleted' });
});

module.exports = router;