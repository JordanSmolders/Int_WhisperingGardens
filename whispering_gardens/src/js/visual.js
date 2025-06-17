// Visual Page JavaScript
class VisualCapture {
    constructor() {
        this.stream = null;
        this.facingMode = 'user';
        this.userData = JSON.parse(localStorage.getItem('signalUserData')) || { visual: [] };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initCamera();
        
        // GSAP animations
        gsap.from('.visual__title', { duration: 0.8, y: -30, opacity: 0 });
        gsap.from('.visual__description', { duration: 0.8, y: 20, opacity: 0, delay: 0.2 });
        gsap.from('.visual__camera-container', { duration: 1, scale: 0.9, opacity: 0, delay: 0.4 });
    }
    
    bindEvents() {
        document.getElementById('visualBackBtn').addEventListener('click', () => {
            this.stopCamera();
            window.location.href = 'menu.html';
        });
        
        document.getElementById('visualCaptureBtn').addEventListener('click', () => {
            this.capturePhoto();
        });
        
        document.getElementById('visualRetakeBtn').addEventListener('click', () => {
            this.retakePhoto();
        });
        
        document.getElementById('visualUploadBtn').addEventListener('click', () => {
            this.uploadPhoto();
        });
    }
    
    async initCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: this.facingMode }
            });
            
            const video = document.getElementById('visualVideo');
            video.srcObject = this.stream;
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please check permissions.');
        }
    }
    
    capturePhoto() {
        const video = document.getElementById('visualVideo');
        const canvas = document.getElementById('visualCanvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
            const imageUrl = URL.createObjectURL(blob);
            
            this.userData.visual.push({
                blob: blob,
                url: imageUrl,
                timestamp: new Date().toISOString()
            });
            
            this.saveUserData();
            
            video.style.display = 'none';
            canvas.style.display = 'block';
            
            // Animate capture
            gsap.from(canvas, { duration: 0.3, scale: 1.1, ease: 'back.out(1.7)' });
        });
    }
    
    retakePhoto() {
        const video = document.getElementById('visualVideo');
        const canvas = document.getElementById('visualCanvas');
        
        video.style.display = 'block';
        canvas.style.display = 'none';
        
        if (this.userData.visual.length > 0) {
            this.userData.visual.pop();
            this.saveUserData();
        }
    }
    
    uploadPhoto() {
        if (this.userData.visual.length === 0) {
            alert('No photo to upload. Please take a photo first.');
            return;
        }
        
        window.location.href = 'success_signal.html';
    }
    
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }
    
    saveUserData() {
        const dataToSave = {
            ...this.userData,
            visual: this.userData.visual.map(item => ({
                timestamp: item.timestamp
            }))
        };
        
        localStorage.setItem('signalUserData', JSON.stringify(dataToSave));
        console.log('Visual data saved:', dataToSave);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VisualCapture();
});