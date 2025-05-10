document.getElementById('downloadReport').addEventListener('click', function() {
    fetch('http://localhost:3000/downloadReport', { // Ensure the URL is correct
        method: 'GET',
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'booking_report.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => alert('Error downloading report: ' + error.message));
});
