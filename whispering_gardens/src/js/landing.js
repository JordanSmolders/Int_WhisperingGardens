// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP animations
    gsap.from('.landing__logo', { 
        duration: 1, 
        y: -50, 
        opacity: 0, 
        ease: 'bounce.out' 
    });
    
    gsap.from('.landing__title', { 
        duration: 1, 
        delay: 0.3, 
        y: 30, 
        opacity: 0 
    });
    
    gsap.from('.landing__description', { 
        duration: 1, 
        delay: 0.6, 
        y: 30, 
        opacity: 0 
    });
    
    gsap.from('.landing__button', { 
        duration: 1, 
        delay: 0.9, 
        y: 30, 
        opacity: 0 
    });

    // Event listeners
    document.getElementById('startSignalBtn').addEventListener('click', () => {
        window.location.href = 'signal_menu.html';
    });
     // Event listeners
    document.getElementById('landingCloseBtn').addEventListener('click', () => {
        window.location.href = 'home.html';
    });

    // Calendar button (placeholder functionality)
    document.querySelector('.landing__calendar-button').addEventListener('click', () => {
        alert('Calendar feature would be implemented here.');
    });
});