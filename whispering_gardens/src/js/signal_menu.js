// Menu Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP animations
    gsap.from('.menu__title-section', { 
        duration: 0.8, 
        x: -50, 
        opacity: 0 
    });
    
    gsap.from('.menu__close', { 
        duration: 0.8, 
        scale: 0, 
        opacity: 0, 
        delay: 0.2 
    });
    
    gsap.from('.menu__artist-image', { 
        duration: 0.8, 
        y: 30, 
        opacity: 0, 
        delay: 0.4 
    });
    
    gsap.from('.menu__option', { 
        duration: 0.6, 
        y: 30, 
        opacity: 0, 
        stagger: 0.1, 
        delay: 0.6 
    });

    // Event listeners
    document.getElementById('menuCloseBtn').addEventListener('click', () => {
        window.location.href = 'signal.html';
    });

    // Menu option clicks
    document.querySelectorAll('.menu__option').forEach(option => {
        option.addEventListener('click', (e) => {
            const optionType = e.currentTarget.dataset.option;
            window.location.href = `${optionType}.html`;
        });
    });
});