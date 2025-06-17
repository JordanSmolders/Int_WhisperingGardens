// Dance Page JavaScript
class DanceRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;
        this.recordingTimer = null;
        this.recordingTime = 0;
        this.selectedDuration = 10;
        this.facingMode = 'user';
        this.stream = null;
        this.userData = JSON.parse(localStorage.getItem('signalUserData')) || { dance: [] };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initCamera();
        
        // GSAP animations
        gsap.from('.dance__title', { duration: 0.8, y: -30, opacity: 0 });
        gsap.from('.dance__description', { duration: 0.8, y: 20, opacity: 0, delay: 0.2 });
        gsap.from('.dance__video-container', { duration: 1, scale: 0.9, opacity: 0, delay: 0.4 });
    }
    
    bindEvents() {
        document.getElementById('danceBackBtn').addEventListener('click', () => {
            this.stopCamera();
            window.location.href = 'menu.html';
        });
        
        document.getElementById('danceRecordBtn').addEventListener('click', () => {
            this.toggleRecording();
        });
        
        document.getElementById('danceFlipBtn').addEventListener('click', () => {
            this.flipCamera();
        });
        
        document.getElementById('danceDiscardBtn').addEventListener('click', () => {
            this.showModal('discard');
        });
        
        document.getElementById('danceRetakeBtn').addEventListener('click', () => {
            this.retake();
        });
        
        document.getElementById('danceUploadBtn').addEventListener('click', () => {
            this.showModal('upload');
        });
        
        // Timer buttons
        document.querySelectorAll('.dance__timer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.dance__timer-btn').forEach(b => 
                    b.classList.remove('dance__timer-btn--active'));
                e.target.classList.add('dance__timer-btn--active');
                this.selectedDuration = parseInt(e.target.dataset.time);
            });
        });
        
        // Modal events
        document.getElementById('modalCancelBtn').addEventListener('click', () => {
            this.hideModal();
        });
        
        document.getElementById('modalUploadBtn').addEventListener('click', () => {
            this.confirmUpload();
        });
        
        document.getElementById('discardCancelBtn').addEventListener('click', () => {
            this.hideModal();
        });
        
        document.getElementById('discardConfirmBtn').addEventListener('click', () => {
            this.confirmDiscard();
        });
    }
    
    async initCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: this.facingMode },
                audio: true
            });
            
            const video = document.getElementById('danceVideo');
            video.srcObject = this.stream;
            
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                this.processRecording();
            };
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please check permissions.');
        }
    }
    
    toggleRecording() {
        const recordBtn = document.getElementById('danceRecordBtn');
        
        if (!this.isRecording) {
            this.startRecording();
            recordBtn.classList.add('recording');
        } else {
            this.stopRecording();
            recordBtn.classList.remove('recording');
        }
    }
    
    startRecording() {
        this.isRecording = true;
        this.recordedChunks = [];
        this.recordingTime = 0;
        
        this.mediaRecorder.start();
        
        this.recordingTimer = setInterval(() => {
            this.recordingTime++;
            this.updateTimer();
            
            if (this.recordingTime >= this.selectedDuration) {
                this.stopRecording();
            }
        }, 1000);
        
        gsap.to('.dance__timer-controls', { duration: 0.3, opacity: 0.5 });
    }
    
    stopRecording() {
        this.isRecording = false;
        
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
        }
        
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
        
        document.getElementById('danceRecordBtn').classList.remove('recording');
        gsap.to('.dance__timer-controls', { duration: 0.3, opacity: 1 });
    }
    
    processRecording() {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        
        this.userData.dance.push({
            blob: blob,
            url: videoUrl,
            timestamp: new Date().toISOString(),
            duration: this.recordingTime
        });
        
        this.saveUserData();
        
        const video = document.getElementById('danceVideo');
        video.srcObject = null;
        video.src = videoUrl;
        video.controls = true;
    }
    
    updateTimer() {
        const minutes = Math.floor(this.recordingTime / 60);
        const seconds = this.recordingTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('danceTimer').textContent = timeString;
    }
    
    async flipCamera() {
        this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        
        await this.initCamera();
    }
    
    retake() {
        if (this.userData.dance.length > 0) {
            const lastRecording = this.userData.dance.pop();
            URL.revokeObjectURL(lastRecording.url);
            this.saveUserData();
        }
        
        const video = document.getElementById('danceVideo');
        video.controls = false;
        video.src = '';
        video.srcObject = this.stream;
        
        this.recordingTime = 0;
        this.updateTimer();
    }
    
    showModal(type) {
        const modal = document.getElementById(`${type}Modal`);
        modal.classList.remove('modal--hidden');
        
        gsap.from(modal.querySelector('.modal__content'), {
            duration: 0.3,
            scale: 0.8,
            opacity: 0,
            ease: 'back.out(1.7)'
        });
    }
    
    hideModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('modal--hidden');
        });
    }
    
    confirmUpload() {
        this.hideModal();
        window.location.href = 'success_signal.html';
    }
    
    confirmDiscard() {
        this.hideModal();
        this.retake();
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
            dance: this.userData.dance.map(item => ({
                timestamp: item.timestamp,
                duration: item.duration
            }))
        };
        
        localStorage.setItem('signalUserData', JSON.stringify(dataToSave));
        console.log('Dance data saved:', dataToSave);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DanceRecorder();
});