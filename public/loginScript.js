document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const responseText = await response.text();

    if (response.ok) {
        alert('Login successful');
        window.location.href = 'home.html'; // Redirect to the home page
    } else {
        alert(`Login failed: ${responseText}. Please register.`);
    }
});
