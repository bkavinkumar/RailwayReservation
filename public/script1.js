document.getElementById('cancellationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const pnr = document.getElementById('pnr').value;

    fetch('http://localhost:3000/cancelTicket', { // Ensure the URL is correct
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnr })
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Ticket cancelled successfully: ' + data.message);
        }
    })
    .catch(error => alert('Error cancelling ticket: ' + error.message));
});
