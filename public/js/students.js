const API = '/api/students';
let editModal;

document.addEventListener('DOMContentLoaded', () => {
    // Modal initialize karo
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
        editModal = new bootstrap.Modal(modalElement);
    }
    loadStudents();
    
    // Form submit
    const form = document.getElementById('addStudentForm');
    if (form) {
        form.addEventListener('submit', addStudent);
    }
    
    // Update button
    const updateBtn = document.getElementById('updateBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', updateStudent);
    }
});

async function loadStudents() {
    try {
        const res = await fetch(API);
        const data = await res.json();
        if (data.success) {
            displayStudents(data.data);
        } else {
            console.error('Failed to load');
        }
    } catch (err) {
        console.error(err);
    }
}

function displayStudents(students) {
    const tbody = document.getElementById('studentsTableBody');
    if (!students || students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No students found</td></tr>';
        return;
    }
    tbody.innerHTML = students.map((s, i) => `
        <tr>
            <td>${i+1}</td>
            <td>${escapeHtml(s.name)}</td>
            <td>${s.age}</td>
            <td><span class="badge bg-${getGradeColor(s.grade)}">${s.grade}</span></td>
            <td>${escapeHtml(s.email)}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-btn" data-id="${s._id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${s._id}">Delete</button>
            </td>
        </tr>
    `).join('');
    
    // Attach event listeners to dynamically created buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openEdit(btn.getAttribute('data-id')));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteStudent(btn.getAttribute('data-id')));
    });
}

function getGradeColor(grade) {
    const colors = { 'A':'success', 'B':'info', 'C':'warning', 'D':'secondary', 'F':'danger' };
    return colors[grade] || 'primary';
}

async function addStudent(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const grade = document.getElementById('grade').value;
    const email = document.getElementById('email').value.trim();
    
    if (!name || !age || !grade || !email) {
        alert('Please fill all fields');
        return;
    }
    
    try {
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, age, grade, email })
        });
        const data = await res.json();
        if (data.success) {
            alert('Student added!');
            document.getElementById('addStudentForm').reset();
            loadStudents();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (err) {
        alert('Network error');
    }
}

async function openEdit(id) {
    try {
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();
        if (data.success) {
            const student = data.data;
            document.getElementById('editId').value = student._id;
            document.getElementById('editName').value = student.name;
            document.getElementById('editAge').value = student.age;
            document.getElementById('editGrade').value = student.grade;
            document.getElementById('editEmail').value = student.email;
            editModal.show();
        } else {
            alert('Student not found');
        }
    } catch (err) {
        alert('Error loading student');
    }
}

async function updateStudent() {
    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value.trim();
    const age = parseInt(document.getElementById('editAge').value);
    const grade = document.getElementById('editGrade').value;
    const email = document.getElementById('editEmail').value.trim();
    
    if (!name || !age || !grade || !email) {
        alert('Please fill all fields');
        return;
    }
    
    try {
        const res = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, age, grade, email })
        });
        const data = await res.json();
        if (data.success) {
            alert('Student updated!');
            editModal.hide();
            loadStudents();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (err) {
        alert('Network error');
    }
}

async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                alert('Deleted!');
                loadStudents();
            } else {
                alert('Error deleting');
            }
        } catch (err) {
            alert('Network error');
        }
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}