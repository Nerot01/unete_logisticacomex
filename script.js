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

function magnify(imgID, zoom) {
    var img, glass, w, h, bw;
    img = document.getElementById(imgID);

    // Remove existing glass if any to prevent duplicates
    let existingGlass = document.querySelector('.img-magnifier-glass');
    if (existingGlass) {
        existingGlass.remove();
    }

    /*Create magnifier glass:*/
    glass = document.createElement("DIV");
    glass.setAttribute("class", "img-magnifier-glass");

    /*Insert magnifier glass:*/
    img.parentElement.insertBefore(glass, img);

    /*Set background properties for the magnifier glass:*/
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
    bw = 3;
    w = glass.offsetWidth / 2;
    h = glass.offsetHeight / 2;

    /*Execute a function when someone moves the magnifier glass over the image:*/
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);

    /*and also for touch screens:*/
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);

    // Show glass on mouse enter, hide on leave (optional, or keep always visible if desirable)
    // For this UI, let's keep it simple: if mouse moves over image/glass, it's visible.
    // We might want to initially hide it.
    glass.style.display = 'block';

    function moveMagnifier(e) {
        var pos, x, y;
        /*Prevent any other actions that may occur when moving over the image*/
        e.preventDefault();
        /*Get the cursor's x and y positions:*/
        pos = getCursorPos(e);
        x = pos.x;
        y = pos.y;
        /*Prevent the magnifier glass from being positioned outside the image:*/
        if (x > img.width - (w / zoom)) { x = img.width - (w / zoom); }
        if (x < w / zoom) { x = w / zoom; }
        if (y > img.height - (h / zoom)) { y = img.height - (h / zoom); }
        if (y < h / zoom) { y = h / zoom; }
        /*Set the position of the magnifier glass:*/
        glass.style.left = (x - w) + "px";
        glass.style.top = (y - h) + "px";
        /*Display what the magnifier glass "sees":*/
        glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
    }

    function getCursorPos(e) {
        var a, x = 0, y = 0;
        e = e || window.event;
        /*Get the x and y positions of the image:*/
        a = img.getBoundingClientRect();
        /*Calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /*Consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return { x: x, y: y };
    }
}

// --- Lightbox / Modal Logic ---
let modalImages = [];
let currentModalIndex = 0;
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("img01");
const zoomContainer = document.querySelector(".zoom-container");

// Zoom/Pan State
let scale = 1;
let pointX = 0;
let pointY = 0;
let startX = 0;
let startY = 0;
let isPanning = false;

function setTransform() {
    modalImg.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
}

function resetZoom() {
    scale = 1;
    pointX = 0;
    pointY = 0;
    setTransform();
}

function openModal(index, imagesArray) {
    modal.style.display = "block";
    modalImages = imagesArray;
    currentModalIndex = index;
    modalImg.src = modalImages[currentModalIndex].src;
    resetZoom();
}

function changeModalImage(n) {
    currentModalIndex += n;
    if (currentModalIndex >= modalImages.length) {
        currentModalIndex = 0;
    } else if (currentModalIndex < 0) {
        currentModalIndex = modalImages.length - 1;
    }
    modalImg.src = modalImages[currentModalIndex].src;
    resetZoom();
}

// Zoom/Pan Event Listeners
if (zoomContainer) {
    // Zoom on wheel
    zoomContainer.addEventListener("wheel", (e) => {
        e.preventDefault();
        const xs = (e.clientX - pointX) / scale;
        const ys = (e.clientY - pointY) / scale;

        const delta = -Math.sign(e.deltaY);
        const newScale = Math.min(Math.max(1, scale + delta * 0.2), 5); // Limit zoom 1x to 5x

        // Adjust point to zoom towards cursor
        // Simple zoom-to-center logic for stability or complex cursor zoom?
        // Let's stick to simple zoom first, or cursor logic if robust.
        // Simplified cursor zoom Logic:
        // (This gets tricky with translates, let's keep it simple: Zoom center or fix math)
        // For simplicity and robustness given time:
        scale = newScale;
        setTransform();
    });

    // Panning
    zoomContainer.addEventListener("mousedown", (e) => {
        if (scale > 1) { // Only pan if zoomed
            e.preventDefault();
            startX = e.clientX - pointX;
            startY = e.clientY - pointY;
            isPanning = true;
            zoomContainer.style.cursor = "grabbing";
        }
    });

    zoomContainer.addEventListener("mouseup", () => {
        isPanning = false;
        zoomContainer.style.cursor = "grab";
    });

    zoomContainer.addEventListener("mousemove", (e) => {
        if (!isPanning) return;
        e.preventDefault();
        pointX = e.clientX - startX;
        pointY = e.clientY - startY;
        setTransform();
    });

    zoomContainer.addEventListener("mouseleave", () => {
        isPanning = false;
        zoomContainer.style.cursor = "grab";
    });
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
            resetZoom(); // Reset on close
        }
    }

    if (modal) {
        modal.onclick = function (event) {
            // Close if clicked on modal (backdrop) OR zoom-container (backdrop of image)
            // But only if not currently panning (handled by click event order usually)
            // And maybe only if not zoomed? Or dragging?
            // If checking classList:
            if (event.target === modal || event.target.classList.contains('zoom-container')) {
                modal.style.display = "none";
                resetZoom(); // Reset on close
            }
        }
    }
});
