document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const trainNumber = document.getElementById('trainNumber').value;
    const paymentAmount = document.getElementById('paymentAmount').value;

    fetch('http://localhost:3000/bookTicket', { // Ensure the URL is correct
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, trainNumber, paymentAmount })
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Ticket booked successfully: PNR ' + data.pnr + '\nPayment ID: ' + data.paymentId);
        }
    })
    .catch(error => alert('Error booking ticket: ' + error.message));
});
