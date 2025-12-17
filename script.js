document.addEventListener('DOMContentLoaded', () => {
    
    // Accordion Logic
    const acc = document.getElementsByClassName("accordion-btn");
    
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
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
