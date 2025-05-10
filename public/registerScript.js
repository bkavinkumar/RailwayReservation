document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const responseText = await response.text();

    if (response.ok) {
        alert('Registration successful');
        window.location.href = 'index.html'; // Redirect to the login page
    } else {
        alert(`Registration failed: ${responseText}`);
    }
});
