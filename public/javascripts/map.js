var map = L.map('mapid').setView([6.2200427, -75.5977792], 20);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

$.ajax({
    dataType: "json",
    url: "api/bikes",
    success: (result) => {
        console.log(result);
        result.bikes.forEach((bike) => {
            L.marker(bike.location).addTo(map)
                .bindPopup('Here is the bike: ' + bike.id)
                .openPopup();
        });
    }
})