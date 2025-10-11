document.addEventListener('DOMContentLoaded', () => {
    loadTeachers();
    populateClassFilter();
});

document.getElementById('addTeacherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let teacherName = document.getElementById('teacherName').value;
    let teacherPassword = document.getElementById('teacherPassword').value;
    let teacherClass = document.getElementById('teacherClass').value;

    let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    teachers.push({ username: teacherName, password: teacherPassword, class: teacherClass, role: 'teacher' });
    localStorage.setItem('teachers', JSON.stringify(teachers));

    alert('Teacher added successfully!');
    document.getElementById('teacherName').value = '';
    document.getElementById('teacherPassword').value = '';
    document.getElementById('teacherClass').value = '';

    loadTeachers();
    populateClassFilter();
});

function loadTeachers() {
    let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    let teacherList = document.getElementById('teacherList');
    teacherList.innerHTML = '<ul>';
    teachers.forEach(teacher => {
        teacherList.innerHTML += `<li>Teacher: ${teacher.username} | Class: ${teacher.class}</li>`;
    });
    teacherList.innerHTML += '</ul>';
}

function populateClassFilter() {
    let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    let classFilter = document.getElementById('classFilter');
    classFilter.innerHTML = '<option value="">All Classes</option>';
    let classes = new Set(teachers.map(teacher => teacher.class));
    classes.forEach(cls => {
        classFilter.innerHTML += `<option value="${cls}">${cls}</option>`;
    });
}

function viewReports() {
    let attendance = JSON.parse(localStorage.getItem('attendance')) || [];
    let reports = document.getElementById('reports');
    reports.innerHTML = '';

    let groupedByClass = {};
    attendance.forEach(record => {
        if (!groupedByClass[record.class]) {
            groupedByClass[record.class] = [];
        }
        groupedByClass[record.class].push(record);
    });

    Object.keys(groupedByClass).forEach(cls => {
        reports.innerHTML += `<h3>Class: ${cls}</h3>`;
        let presentCount = groupedByClass[cls].filter(record => record.status === 'Present').length;
        let absentCount = groupedByClass[cls].filter(record => record.status === 'Absent').length;

        reports.innerHTML += `<p>Total Present: ${presentCount}</p>`;
        reports.innerHTML += `<p>Total Absent: ${absentCount}</p><hr>`;
    });
}

function viewReportsByDate() {
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert('Please select both dates.');
        return;
    }

    let attendance = JSON.parse(localStorage.getItem('attendance')) || [];
    let reports = document.getElementById('reports');
    reports.innerHTML = '';

    attendance.forEach(record => {
        let recordDate = new Date(record.date);
        if (recordDate >= new Date(startDate) && recordDate <= new Date(endDate)) {
            reports.innerHTML += `<p>${record.studentName} was ${record.status} on ${record.date}</p>`;
        }
    });
}

function filterByClass() {
    let selectedClass = document.getElementById('classFilter').value;
    let attendance = JSON.parse(localStorage.getItem('attendance')) || [];
    let reports = document.getElementById('reports');
    reports.innerHTML = '';

    attendance.forEach(record => {
        if (selectedClass === '' || record.class === selectedClass) {
            reports.innerHTML += `<p>${record.studentName} (${record.class}): ${record.status} on ${record.date}</p>`;
        }
    });
}

function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}
