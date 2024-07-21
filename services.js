function checkLoggedIn() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to book this service.');
        window.location.href = 'login.html'; 
    } else {
        // Implement your booking logic here
        alert('Booking functionality to be implemented.'); // Replace with your actual booking logic
    }
}
document.addEventListener("DOMContentLoaded", function() {
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const servicesContainer = document.querySelector('.services-container');

    // Scroll to left
    leftBtn.addEventListener('click', function() {
        servicesContainer.scrollBy({
            left: -servicesContainer.offsetWidth,
            behavior: 'smooth'
        });
    });

    // Scroll to right
    rightBtn.addEventListener('click', function() {
        servicesContainer.scrollBy({
            left: servicesContainer.offsetWidth,
            behavior: 'smooth'
        });
    });

    // Continuously scroll
    setInterval(function() {
        servicesContainer.scrollBy({
            left: servicesContainer.offsetWidth,
            behavior: 'smooth'
        });
    }, 3000); // Adjust the interval (in milliseconds) as needed
});