$(document).ready(function() {
    $('#bookingForm').on('submit', function(e) {
        e.preventDefault();

        const origin = $('#origin').val();
        const destination = $('#destination').val();
        const date = $('#date').val();

        $.ajax({
            url: '/searchTrains',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ origin, destination, date }),
            success: function(response) {
                displayTrains(response.trains);
            },
            error: function(error) {
                console.error(error);
            }
        });
    });

    function displayTrains(trains) {
        let trainResults = $('#trainResults');
        trainResults.empty();

        if (trains.length > 0) {
            trains.forEach(train => {
                let trainCard = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${train.name}</h5>
                            <p class="card-text">Departure: ${train.departure}</p>
                            <p class="card-text">Arrival: ${train.arrival}</p>
                            <button class="btn btn-primary book-ticket" data-id="${train._id}">Book Ticket</button>
                        </div>
                    </div>
                `;
                trainResults.append(trainCard);
            });

            $('.book-ticket').on('click', function() {
                const trainId = $(this).data('id');
                bookTicket(trainId);
            });
        } else {r
            trainResults.append('<p>No trains available on the selected date.</p>');
        }
    }

    function bookTicket(trainId) {
        $.ajax({
            url: '/bookTicket',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ trainId }),
            success: function(response) {
                alert(`Ticket booked successfully!\nPNR: ${response.pnr}\nTicket No: ${response.ticketNo}\nCost: ${response.cost}`);
            },
            error: function(error) {
                console.error(error);
            }
        });
    }
});
