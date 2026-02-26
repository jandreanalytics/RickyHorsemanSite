// Scroll-triggered fade-in animations
document.addEventListener('DOMContentLoaded', function() {
    const autoFadeSelectors = [
        '.service-card',
        '.testimonial-card',
        '.work-step',
        '.project-card',
        '.faq-item',
        '.about-content',
        '.services-link',
        '.about-link',
        '.testimonials-link',
        '.how-we-work-link'
    ];

    // Collect all target elements
    const allElements = [];
    autoFadeSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            allElements.push(el);
        });
    });

    // Check if element is already in the viewport on load
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    // Apply hidden state only to elements below the fold
    allElements.forEach(el => {
        if (isInViewport(el)) {
            // Already visible on load — show immediately, no animation
            el.classList.add('fade-in-on-scroll', 'fade-in-visible');
        } else {
            // Below the fold — hide and animate on scroll
            el.classList.add('fade-in-on-scroll');
        }
    });

    // Observe all hidden elements
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in-on-scroll:not(.fade-in-visible)').forEach(el => {
        observer.observe(el);
    });
});

// Parallax effect for Our Story image
document.addEventListener('DOMContentLoaded', function() {
    const storyImage = document.querySelector('.our-story-image img');
    
    if (storyImage) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const elementPosition = storyImage.parentElement.offsetTop;
            
            // Calculate parallax based on distance from top of viewport
            const distanceFromTop = elementPosition - scrollPosition;
            
            // Only apply parallax when element is in view
            if (scrollPosition + window.innerHeight > elementPosition && scrollPosition < elementPosition + storyImage.parentElement.offsetHeight) {
                // Subtle parallax - move at 0.2x speed, constrained to small range
                const parallaxAmount = Math.min(Math.max(distanceFromTop * 0.2, -20), 20);
                storyImage.style.transform = `translateY(${parallaxAmount}px)`;
            }
        });
    }
});
