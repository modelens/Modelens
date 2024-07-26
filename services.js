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