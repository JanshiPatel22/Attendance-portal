// Predefined admin user
let users = [
    { username: 'admin', password: 'admin123', role: 'admin' }
];

// Fetch teachers from local storage and combine with the admin user
let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
users = users.concat(teachers);

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    // Check if the user exists in the list of users (admin + teachers)
    let user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        // Redirect to appropriate dashboard
        window.location.href = user.role === 'admin' ? 'admin.html' : 'teacher.html';
    } else {
        document.getElementById('errorMsg').textContent = 'Invalid login!';
    }
});
