// Unique Modern Portfolio JS - Particles, Animations, Interactivity
// Particle System Canvas
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouse = { x: 0, y: 0 };

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `hsl(${Math.random()*60 + 180}, 100%, 60%)`; // Cyan-Purple range
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        
        // Mouse attraction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < 100) {
            this.x += dx * 0.02;
            this.y += dy * 0.02;
        }
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animateParticles);
}

// Mouse tracking
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Resize handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Typing Animation
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Glitch for BSE text
document.addEventListener('DOMContentLoaded', () => {
    const glitchSpan = document.querySelector('.glitch');
    glitchSpan.setAttribute('data-text', glitchSpan.textContent);
});

// Smooth scroll - Disabled for multi-page (external links now)
 /*
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
*/

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navUl = document.querySelector('nav ul');

menuToggle.addEventListener('click', () => {
    navUl.style.display = navUl.style.display === 'flex' ? 'none' : 'flex';
});

// Scroll reveal animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Trigger stats counter animation
            const numbers = entry.target.querySelectorAll('.number[data-target]');
            numbers.forEach(number => animateCounter(number));
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Counter animation function
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const increment = target / 100;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (target > 1 ? '+' : '');
    }, 20);
}

// Typing effect after load
window.addEventListener('load', () => {
    const typingElement = document.querySelector('.typing');
    if (typingElement) {
        const fullText = typingElement.textContent;
        typeWriter(typingElement, fullText, 150);
    }
    
    // Add fade-in class
    document.body.classList.add('loaded');
    
    // Start particles
    initParticles();
    animateParticles();
});

// Contact form - Safe for all pages (checks existence)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! This is a demo portfolio - form integrates with EmailJS/Netlify in production.');
        e.target.reset();
    });
}

// Parallax effect for hero image
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const profilePic = document.querySelector('.profile-pic');
    if (profilePic) {
        profilePic.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Project card / Gallery item hover tilt effect - For services & gallery
document.querySelectorAll('.project-card, .gallery-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Gallery Lightbox
const galleryItems = document.querySelectorAll('.gallery-item img[data-lightbox]');
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
    <span class="lightbox-close">&times;</span>
    <img id="lightbox-img" src="" alt="">
`;
lightbox.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 10000;
`;
document.body.appendChild(lightbox);

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.src;
        const lightboxImg = document.getElementById('lightbox-img');
        lightboxImg.src = imgSrc;
        lightbox.style.display = 'flex';
    });
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        lightbox.style.display = 'none';
    }
});

// Easter egg: Double click logo for particle explosion
const logo = document.querySelector('.logo');
logo.addEventListener('dblclick', () => {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            particles.push(new Particle());
        }, i * 20);
    }
});
