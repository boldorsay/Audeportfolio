import './style.css'

// The three images available in public/
const images = [
  '/vertical3.png',
  '/square3.png',
  '/horizontal3.png'
];

// Create a sequence of 9 images (3 sets of 3)
const sequence = [...images, ...images, ...images];

// We duplicate the sequence to create a seamless infinite scroll effect
const displayImages = [...sequence, ...sequence];

const itemsHtml = displayImages.map((src, index) => `
  <div class="scroll-item">
    <img src="${src}" alt="Portfolio Image ${index}" />
  </div>
`).join('');

document.querySelector('#app').innerHTML = `
  <div class="scroll-container">
    <div class="scroll-track">
      ${itemsHtml}
    </div>
  </div>
`;

// --- Infinite Scroll & Speed Control Logic ---

const track = document.querySelector('.scroll-track');
let scrollPos = 0;

// Configuration
const baseSpeed = 0.5;      // Constant slow movement
const friction = 0.95;      // How quickly the extra speed decays (lower = faster stop)
const sensitivity = 0.05;   // How much scroll affects speed

let velocity = 0;           // Additional speed from user scrolling

function animate() {
  // Apply friction to velocity to make it decay gradually
  velocity *= friction;

  // Stop micro-calculations when velocity is negligible
  if (Math.abs(velocity) < 0.01) {
    velocity = 0;
  }

  // Calculate total speed
  // velocity can be negative if scrolling up, allowing reverse or slowing down
  const currentSpeed = baseSpeed + velocity;

  // Move position
  scrollPos -= currentSpeed;

  // --- Infinite Loop Logic ---
  // We need to know when we've scrolled past half the track content
  const trackWidth = track.scrollWidth;

  // Note: scrollWidth might not be fully ready immediately on load in some browsers 
  // without a slight delay or checking images loaded, but usually OK in modern Vite/Chrome.
  // Ideally, we'd wait for images to load, but the layout is flex with fixed heights (60vh), 
  // so width should be somewhat stable if aspect ratios are known or images load fast.

  if (trackWidth > 0) {
    const halfWidth = trackWidth / 2;

    // Wrap around
    if (scrollPos <= -halfWidth) {
      scrollPos += halfWidth;
    } else if (scrollPos > 0) {
      scrollPos -= halfWidth;
    }
  }

  // Apply transform
  track.style.transform = `translateX(${scrollPos}px)`;

  requestAnimationFrame(animate);
}

// Start the loop
animate();

// --- User Interaction (Mouse Wheel) ---
window.addEventListener('wheel', (e) => {
  // e.deltaY is usually positive for scrolling down
  // We add to velocity. 
  // You can adjust direction by changing + to -
  velocity += e.deltaY * sensitivity;
});
