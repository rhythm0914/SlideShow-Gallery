const canvas = document.getElementById("galleryCanvas");
const ctx = canvas.getContext("2d");

const images = [];
let imagesLoaded = 0;

for (let i = 1; i <= 10; i++) {
    let img = new Image();
    img.src = `images/img${i}.jpg`;
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === images.length) {
            resizeCanvas(); // Only resize when all images are loaded
        }
    };
    images.push(img);
}

let currentIndex = 0;
let autoSlideInterval;
let isZooming = false;

// Resize canvas dynamically
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawImage();
}

window.addEventListener("resize", resizeCanvas);

// Draw image on canvas with watermark
function drawImage() {
    const img = images[currentIndex];
    if (!img.complete) return; // Prevent drawing if image isn't loaded

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Watermark
    ctx.font = "20px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText("© My Gallery", canvas.width - 120, canvas.height - 20);
}

// Navigate images
function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    drawImage();
}
function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    drawImage();
}

// Swipe Gesture Navigation
let startX = 0;
canvas.addEventListener("touchstart", (e) => startX = e.touches[0].clientX);
canvas.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    if (startX > endX + 50) nextImage();
    else if (startX < endX - 50) prevImage();
});

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
});

// Slideshow Controls
function startSlideshow() {
    clearInterval(autoSlideInterval); // Prevent multiple intervals
    autoSlideInterval = setInterval(nextImage, 4000);
}
function stopSlideshow() {
    clearInterval(autoSlideInterval);
}

// Zoom on Hover
canvas.addEventListener("mousemove", (e) => {
    if (!isZooming) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images[currentIndex], -x * 0.5, -y * 0.5, canvas.width * 1.5, canvas.height * 1.5);
});
canvas.addEventListener("mouseleave", () => {
    isZooming = false;
    drawImage();
});
canvas.addEventListener("mouseenter", () => isZooming = true);

// Lightbox Functions
function openLightbox(imgSrc) {
    document.getElementById("lightbox").style.display = "block";
    document.getElementById("lightbox-img").src = imgSrc;
    
    // Show the comment section when the lightbox opens
    document.getElementById("commentSection").classList.remove("hidden");
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
    
    // Hide the comment section when the lightbox closes
    document.getElementById("commentSection").classList.add("hidden");
}

// Download Image
function downloadImage(imgSrc) {
    let link = document.createElement("a");
    link.href = imgSrc;
    link.download = imgSrc.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Share Image
function shareImage(imgSrc) {
    navigator.clipboard.writeText(imgSrc).then(() => alert("Image link copied! Share it anywhere."));
}

// Add Comment
function addComment() {
    let commentText = document.getElementById("comment-input").value.trim();
    if (commentText === "") return;
    
    let commentList = document.getElementById("comment-list");
    let li = document.createElement("li");
    li.textContent = commentText;
    commentList.appendChild(li);
    
    document.getElementById("comment-input").value = "";
}

// Event Listeners
document.getElementById("prevBtn").addEventListener("click", () => {
    prevImage();
    stopSlideshow();
});
document.getElementById("nextBtn").addEventListener("click", () => {
    nextImage();
    stopSlideshow();
});

// Initialize when all images are loaded
window.onload = () => {
    if (imagesLoaded === images.length) {
        drawImage();
        startSlideshow();
    }
};
