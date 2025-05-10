document.getElementById('foodServiceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const pnr = document.getElementById('pnr').value;
    const foodItem = document.getElementById('foodItem').value;
    const quantity = document.getElementById('quantity').value;
    const deliveryTime = document.getElementById('deliveryTime').value;

    fetch('http://localhost:3000/orderFood', { // Ensure the URL is correct
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnr, foodItem, quantity, deliveryTime })
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Food ordered successfully: Order ID ' + data.orderId);
        }
    })
    .catch(error => alert('Error ordering food: ' + error.message));
});
