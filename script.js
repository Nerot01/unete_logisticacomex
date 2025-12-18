document.addEventListener('DOMContentLoaded', () => {

    // Accordion Logic
    const acc = document.getElementsByClassName("accordion-btn");

    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            // Close other panels if needed (optional, keeping independent for now or strict accordion?)
            // Let's implement strict accordion (only one open at a time) for cleaner mobile view

            /* Uncomment this block to allow only one panel open at a time
            for (let j = 0; j < acc.length; j++) {
                if (acc[j] !== this && acc[j].classList.contains("active")) {
                    acc[j].classList.remove("active");
                    acc[j].nextElementSibling.style.maxHeight = null;
                    acc[j].nextElementSibling.classList.remove("open");
                }
            }
            */

            this.classList.toggle("active");
            const panel = this.nextElementSibling;

            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                panel.classList.remove("open");
            } else {
                panel.classList.add("open");
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }

    // Carousel Logic
    // We have multiple carousels, so we need to scope variables to the click event context
});

function moveSlide(button, direction) {
    const carousel = button.closest('.carousel');
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);

    // Find current slide
    const currentSlide = track.querySelector('.current-slide');
    const currentIndex = slides.indexOf(currentSlide);

    let targetIndex = currentIndex + direction;

    // Loop
    if (targetIndex < 0) {
        targetIndex = slides.length - 1;
    } else if (targetIndex >= slides.length) {
        targetIndex = 0;
    }

    const targetSlide = slides[targetIndex];

    currentSlide.classList.remove('current-slide');
    targetSlide.classList.add('current-slide');
}

// --- Lightbox / Modal Logic ---
let modalImages = [];
let currentModalIndex = 0;
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("img01");

function openModal(index, imagesArray) {
    modal.style.display = "block";
    modalImages = imagesArray;
    currentModalIndex = index;
    modalImg.src = modalImages[currentModalIndex].src;
}

function changeModalImage(n) {
    currentModalIndex += n;
    if (currentModalIndex >= modalImages.length) {
        currentModalIndex = 0;
    } else if (currentModalIndex < 0) {
        currentModalIndex = modalImages.length - 1;
    }
    modalImg.src = modalImages[currentModalIndex].src;
}

document.addEventListener('DOMContentLoaded', () => {
    // Get all slides
    var slides = document.querySelectorAll(".carousel-slide");

    slides.forEach(slide => {
        let img = slide.querySelector('img');
        if (img) {
            img.style.cursor = "pointer";
            img.addEventListener('click', function () {
                // Find all images in THIS specific carousel
                let carouselTrack = this.closest('.carousel-track');
                let allImagesInCarousel = Array.from(carouselTrack.querySelectorAll('img'));

                // Get index of clicked image
                let index = allImagesInCarousel.indexOf(this);

                openModal(index, allImagesInCarousel);
            });
        }
    });

    // Close buttons
    var span = document.getElementsByClassName("close")[0];
    if (span) {
        span.onclick = function () {
            modal.style.display = "none";
        }
    }

    if (modal) {
        modal.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }
});
