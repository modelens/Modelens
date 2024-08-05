function checkLoggedIn() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to book this service.');
        window.location.href = 'login.html';
    } else {
        window.location.href = 'register.html';// Replace with your actual booking logic
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.right-arrow');
    const prevButton = document.querySelector('.left-arrow');
    const slideWidth = slides[0].getBoundingClientRect().width;

    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };

    slides.forEach(setSlidePosition);

    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    nextButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.current-slide') || slides[0];
        let nextSlide = currentSlide.nextElementSibling;
        if (!nextSlide) {
            nextSlide = slides[0];
        }
        moveToSlide(track, currentSlide, nextSlide);
    });

    prevButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.current-slide') || slides[0];
        let prevSlide = currentSlide.previousElementSibling;
        if (!prevSlide) {
            prevSlide = slides[slides.length - 1];
        }
        moveToSlide(track, currentSlide, prevSlide);
    });
});

//testimonial

const swiper = new Swiper('#carouselContainer', {
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 5,
    loop: true,
    spaceBetween: 30,
    effect: "coverflow",
    coverflowEffect: {
        rotate: 0,
        depth: 800,
        slideShadows: true,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    autoplay: { delay: 1000 }
});

window.onresize = queryResizer;
queryResizer();

function queryResizer() {
    if (window.innerWidth < 724) swiper.params.slidesPerView = 2;
    if (window.innerWidth > 501) swiper.params.slidesPerView = 2;
    if (window.innerWidth > 724) swiper.params.slidesPerView = 2.3;
    if (window.innerWidth < 501) swiper.params.slidesPerView = 1;
    swiper.update();
}


document.addEventListener("DOMContentLoaded", function () {
    const showMoreButtons = document.querySelectorAll('.show-more-btn');

    showMoreButtons.forEach(button => {
        button.addEventListener('click', function () {
            const contentHolder = this.previousElementSibling;
            if (this.textContent === 'Show More') {
                contentHolder.style.display = '-webkit-box';
                contentHolder.style.webkitLineClamp = 'initial'; /* Show all lines */
                this.textContent = 'Show Less';
            } else {
                contentHolder.style.display = '-webkit-box';
                contentHolder.style.webkitLineClamp = 2; /* Show only two lines */
                this.textContent = 'Show More';
            }
        });
    });
});
