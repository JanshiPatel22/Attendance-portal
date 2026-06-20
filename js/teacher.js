document.addEventListener('DOMContentLoaded', function() {
    // Load students into dropdown on page load
    populateStudentSelect(); 

    // Load attendance data on page load
    loadAttendance(); 

    // Set today's date as the default for attendance date
    document.getElementById('attendanceDate').value = new Date().toISOString().split('T')[0];

    // Add Student Form Submission
    document.getElementById('addStudentForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the form from submitting in the traditional way

        let studentName = document.getElementById('studentName').value.trim();
        console.log("Add Student button clicked"); // Debugging output

        if (studentName) {
            addStudent(studentName);
            document.getElementById('studentName').value = ''; // Clear input field after adding
            alert('Student added successfully.');
        } else {
            alert('Please enter a valid student name.');
        }
    });

    // Add Attendance Form Submission
    document.getElementById('addAttendanceForm').addEventListener('submit', function(e) {
        e.preventDefault();

        let studentName = document.getElementById('studentSelect').value;
        let attendanceDate = document.getElementById('attendanceDate').value;
        let attendanceStatus = document.getElementById('attendanceStatus').value;

        if (!studentName || !attendanceDate || !attendanceStatus) {
            alert('Please fill all the fields.');
            return;
        }

        addAttendance(studentName, attendanceDate, attendanceStatus);
        alert('Attendance marked successfully.');
        loadAttendance(); // Reload attendance after marking
    });
});

// Function to add student to localStorage
function addStudent(studentName) {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')); // Get the current teacher's class
    let students = JSON.parse(localStorage.getItem('students')) || []; // Get existing students or initialize empty

    // Check if the student already exists
    let studentExists = students.some(student => student.name === studentName && student.class === loggedInUser.class);

    if (studentExists) {
        alert('Student already exists in this class.');
        return;
    }

    // Add the new student
    students.push({ name: studentName, class: loggedInUser.class });
    localStorage.setItem('students', JSON.stringify(students)); // Save to localStorage

    // Re-populate the dropdown
    populateStudentSelect();
}

// Populate student dropdown for marking attendance
function populateStudentSelect() {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let studentSelect = document.getElementById('studentSelect');

    // Clear the existing dropdown options
    studentSelect.innerHTML = '<option value="" disabled selected>Select Student</option>';

    // Filter students by the class of the logged-in teacher
    let filteredStudents = students.filter(student => student.class === loggedInUser.class);

    if (filteredStudents.length === 0) {
        studentSelect.innerHTML = '<option value="" disabled>No students available</option>';
    } else {
        filteredStudents.forEach(student => {
            studentSelect.innerHTML += `<option value="${student.name}">${student.name}</option>`;
        });
    }
}

// Add Attendance
function addAttendance(studentName, attendanceDate, attendanceStatus) {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let attendance = JSON.parse(localStorage.getItem('attendance')) || [];

    attendance.push({
        studentName,
        date: attendanceDate,
        status: attendanceStatus,
        class: loggedInUser.class
    });

    localStorage.setItem('attendance', JSON.stringify(attendance));
}

// Load and display attendance list
function loadAttendance() {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let attendance = JSON.parse(localStorage.getItem('attendance')) || [];
    let attendanceList = document.getElementById('attendanceList');

    attendanceList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody id="attendanceBody">
            </tbody>
        </table>
    `;

    let tableBody = document.getElementById('attendanceBody');
    tableBody.innerHTML = ''; // Clear the table body

    attendance.filter(record => record.class === loggedInUser.class).forEach(record => {
        let row = `<tr>
            <td>${record.studentName}</td>
            <td>${record.date}</td>
            <td>${record.status}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Logout function
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}
