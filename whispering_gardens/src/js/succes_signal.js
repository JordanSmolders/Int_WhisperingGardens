
document.addEventListener('DOMContentLoaded', () => {

    gsap.from('.success__title', { 
        duration: 1, 
        y: -30, 
        opacity: 0, 
        ease: 'power2.out' 
    });
    
    gsap.from('.success__navigate-btn', { 
        duration: 0.8, 
        y: 20, 
        opacity: 0, 
        delay: 0.3 
    });
    
    gsap.from('.success__image', { 
        duration: 1, 
        scale: 0.9, 
        opacity: 0, 
        delay: 0.5 
    });

    document.getElementById('successBackBtn').addEventListener('click', () => {
        window.location.href = 'signal_menu.html';
    });

    document.getElementById('successNavigateBtn').addEventListener('click', () => {
        alert('Navigation to statue feature would be implemented here. This would typically open a map application or provide turn-by-turn directions to the museum statue location.');
    });

    const userData = JSON.parse(localStorage.getItem('signalUserData'));
    if (userData) {
        console.log('User has created signals:', userData);
        

        let signalTypes = [];
        if (userData.dance && userData.dance.length > 0) signalTypes.push('Dance');
        if (userData.visual && userData.visual.length > 0) signalTypes.push('Visual');
        if (userData.word && userData.word.length > 0) signalTypes.push('Word');
        if (userData.voice && userData.voice.length > 0) signalTypes.push('Voice');
        
        if (signalTypes.length > 0) {
            console.log(`Signal types created: ${signalTypes.join(', ')}`);
        }
    }
});