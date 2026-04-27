
function calc(a, b) {
    return a * b;
}

let p = new Promise((resolve, reject) => {
    let result = calc(6, 2);
    if (result === 12) {
        resolve(result);
    } else reject ("there was an error");
});

p.then(value => {
    console.log(value);
}).catch(error => {
    console.log(error);
})

import { 
    setupCardClickHandlers,
 } from './components/slider.js';

// When the page has fully loaded, initialize the slider
document.addEventListener('DOMContentLoaded', function() {
    initSlider();
    toggleMobileMenu();
    initNavbarScroll();
    initGifLoader();
    imageSlide();
    // initTestimonialCarousel();
    initEvidenceLightboxClosers();
    
    // Expose lightbox function to global scope for inline onclick
    window.openEvidenceLightbox = openEvidenceLightbox;
});

// === Mobile Menu Toggle ===
function toggleMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Open menu
    mobileMenuToggle?.addEventListener('click', function() {
        mobileMenu?.classList.add('active');
        mobileMenuOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close menu - close button
    mobileMenuClose?.addEventListener('click', function() {
        mobileMenu?.classList.remove('active');
        mobileMenuOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close menu - overlay click
    mobileMenuOverlay?.addEventListener('click', function() {
        mobileMenu?.classList.remove('active');
        mobileMenuOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close menu - nav link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu?.classList.remove('active');
            mobileMenuOverlay?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// === Navbar Scroll ===
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
}

function initSlider() {
    // Get the slider container element
    let sliderContainer = document.querySelector('.slider');
    
    // Get all the card elements and convert to array
    let allCards = Array.from(document.querySelectorAll('.card'));
    
    // Exit if we can't find the slider or cards
    if (!sliderContainer || allCards.length === 0) {
        console.warn('Could not find slider or cards');
        return;
    }
    
    // Set up click handlers for all cards
    setupCardClickHandlers(allCards);
}

// === GIF Loading ===
function initGifLoader() {
    const loadGifBtn = document.querySelector('#load-gif-btn');
    const gifContainer = document.querySelector('#gif-display-container');
    
    loadGifBtn?.addEventListener('click', function() {
        fetchAndDisplayGif();
    });
}

// Placeholder function for fetching GIF from API
async function fetchAndDisplayGif() {
    const gifContainer = document.querySelector('#gif-display-container');
    
    // Show loading state
    gifContainer.innerHTML = '<p style="color: var(--nt-500);">Loading GIF...</p>';
    
    try {
        const response = await fetch('https://api.giphy.com/v1/gifs/translate?api_key=NIxDXG8qZHt31HsOlVZYFbUdttURBVP3&s=superwoman cartoon');
        const data = await response.json();
        
        // Extract GIF URL from Giphy response
        const gifUrl = data.data.images.original.url;
        
        // Create and display image
        const img = document.createElement('img');
        img.src = gifUrl;
        img.alt = 'Process demonstration';
        
        gifContainer.innerHTML = '';
        gifContainer.appendChild(img);
        
        console.log('GIF loaded successfully:', gifUrl);
    } catch (error) {
        console.error('Error fetching GIF:', error);
        gifContainer.innerHTML = '<p class="gif-error">Error loading GIF. Please try again.</p>';
    }
}


// === Image Slide Effect ===
function imageSlide() {
    const benefitsImg = document.querySelector('.benefits-img');
    if (!benefitsImg) return;
    
    // Configuration
    const BREAKPOINT = 768;  // Mobile to desktop breakpoint
    const INITIAL_OFFSET = 10;  // How far off-screen to the right (in %)
    const SLIDE_DISTANCE = 20;  // How far the image should slide in (in %)
    
    let isDesktop = window.innerWidth >= BREAKPOINT;
    
    function setInitialState() {
        if (isDesktop) {
            // Desktop: off-screen to the right
            benefitsImg.style.transform = `translateX(${INITIAL_OFFSET}%)`;
            benefitsImg.style.opacity = '1';
            benefitsImg.style.transition = 'none';
        } else {
            // Mobile: fade-in effect starts invisible
            benefitsImg.style.transform = 'translateX(0)';
            benefitsImg.style.opacity = '0';
            benefitsImg.style.transition = 'none';
        }
    }
    
    function updateImagePosition() {
        const rect = benefitsImg.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate progress: 0 when element enters viewport from below, 1 when fully scrolled past top
        let progress = 0;
        
        if (rect.bottom < 0) {
            progress = 1;
        } else if (rect.top > viewportHeight) {
            progress = 0;
        } else {
            const distanceIntoViewport = viewportHeight - rect.top;
            const triggerDistance = viewportHeight + rect.height;
            progress = distanceIntoViewport / triggerDistance;
            progress = Math.max(0, Math.min(1, progress));
        }
        
        if (isDesktop) {
            // Desktop: slide-in from right
            const translateAmount = INITIAL_OFFSET - (progress * SLIDE_DISTANCE);
            benefitsImg.style.transform = `translateX(${translateAmount}%)`;
            benefitsImg.style.opacity = '1';
        } else {
            // Mobile: instant pop-in (opacity jumps to 1 in first 15% of scroll)
            benefitsImg.style.transform = 'translateX(0)';
            const popProgress = Math.min(1, progress / 0.15);
            benefitsImg.style.opacity = popProgress.toString();
        }
    }
    
    function handleResize() {
        const wasDesktop = isDesktop;
        isDesktop = window.innerWidth >= BREAKPOINT;
        
        // If breakpoint crossed, reinitialize
        if (wasDesktop !== isDesktop) {
            setInitialState();
            updateImagePosition();
        }
    }
    
    // Set initial state
    setInitialState();
    
    // Listen for scroll events with passive flag for better performance
    window.addEventListener('scroll', updateImagePosition, { passive: true });
    
    // Listen for resize events to handle breakpoint changes
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Initial call to set correct position on page load
    updateImagePosition();
}


// === Evidence Lightbox ===
function openEvidenceLightbox(caseHeadingElement) {
    // Find the associated evidence-items
    const evidenceHeading = caseHeadingElement.closest('.evidence-heading');
    if (!evidenceHeading) return;
    
    const evidenceItems = evidenceHeading.nextElementSibling;
    if (!evidenceItems || !evidenceItems.classList.contains('evidence-items')) return;
    
    // Get lightbox elements
    const lightboxOverlay = document.getElementById('evidence-lightbox-overlay');
    const lightboxContent = document.getElementById('evidence-lightbox-content');
    
    if (!lightboxOverlay || !lightboxContent) {
        console.error('Lightbox elements not found');
        return;
    }
    
    // Clone each evidence-cont child and append to lightbox
    lightboxContent.innerHTML = '';
    Array.from(evidenceItems.children).forEach(child => {
        const clonedChild = child.cloneNode(true);
        lightboxContent.appendChild(clonedChild);
    });
    
    // Show lightbox
    lightboxOverlay.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Initialize lightbox close handlers
function initEvidenceLightboxClosers() {
    const lightboxOverlay = document.getElementById('evidence-lightbox-overlay');
    const closeBtn = document.getElementById('evidence-lightbox-close');
    
    if (!lightboxOverlay) return;
    
    // Close button handler
    closeBtn?.addEventListener('click', closeLightbox);
    
    // Overlay click handler (click outside the modal)
    lightboxOverlay.addEventListener('click', function(e) {
        // Only close if clicking directly on overlay, not its children
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });
    
    // Keyboard handler (ESC key)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
            closeLightbox();
        }
    });
}

function closeLightbox() {
    const lightboxOverlay = document.getElementById('evidence-lightbox-overlay');
    if (!lightboxOverlay) return;
    
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
}