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
        this.recordedVideoBlob = null;
        this.isInPreviewMode = false;
        
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
            window.location.href = 'signal_menu.html';
        });
        
        document.getElementById('danceRecordBtn').addEventListener('click', () => {
            this.toggleRecording();
        });
        
        document.getElementById('danceFlipBtn').addEventListener('click', () => {
            this.flipCamera();
        });
        
        document.getElementById('danceDiscardBtn').addEventListener('click', () => {
            if (this.isInPreviewMode) {
                this.exitPreviewMode();
            } else {
                this.showModal('discard');
            }
        });
        
        document.getElementById('danceRetakeBtn').addEventListener('click', () => {
            this.retake();
        });
        
        document.getElementById('danceUploadBtn').addEventListener('click', () => {
            if (this.isInPreviewMode) {
                this.confirmVideo();
            } else {
                this.showModal('upload');
            }
        });
        
        // Timer buttons
        document.querySelectorAll('.dance__timer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.isRecording) {
                    document.querySelectorAll('.dance__timer-btn').forEach(b => 
                        b.classList.remove('dance__timer-btn--active'));
                    e.target.classList.add('dance__timer-btn--active');
                    this.selectedDuration = parseInt(e.target.dataset.time);
                }
            });
        });
        
        // Modal events
        document.getElementById('modalCancelBtn')?.addEventListener('click', () => {
            this.hideModal();
        });
        
        document.getElementById('modalUploadBtn')?.addEventListener('click', () => {
            this.confirmUpload();
        });
        
        document.getElementById('discardCancelBtn')?.addEventListener('click', () => {
            this.hideModal();
        });
        
        document.getElementById('discardConfirmBtn')?.addEventListener('click', () => {
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
        
        // Disable timer buttons during recording
        document.querySelectorAll('.dance__timer-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        });
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
        
        // Re-enable timer buttons
        document.querySelectorAll('.dance__timer-btn').forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
    }
    
    processRecording() {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        this.recordedVideoBlob = blob;
        const videoUrl = URL.createObjectURL(blob);
        
        // Enter preview mode
        this.enterPreviewMode(videoUrl);
    }
    
    enterPreviewMode(videoUrl) {
        this.isInPreviewMode = true;
        
        const video = document.getElementById('danceVideo');
        video.srcObject = null;
        video.src = videoUrl;
        video.controls = true;
        video.loop = true;
        
        // Update UI for preview mode
        this.updateUIForPreview();
        
        // Show preview overlay
        this.showPreviewOverlay();
    }
    
    showPreviewOverlay() {
        // Create preview overlay if it doesn't exist
        let overlay = document.querySelector('.dance__preview-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'dance__preview-overlay';
            overlay.innerHTML = `
                <div class="dance__preview-text">Review your dance video</div>
                <div class="dance__preview-controls">
                    <button class="dance__preview-btn dance__preview-btn--retake" id="previewRetakeBtn">
                        Retake
                    </button>
                    <button class="dance__preview-btn dance__preview-btn--confirm" id="previewConfirmBtn">
                        Looks good!
                    </button>
                </div>
            `;
            document.querySelector('.dance__video-container').appendChild(overlay);
            
            // Bind preview overlay events
            document.getElementById('previewRetakeBtn').addEventListener('click', () => {
                this.exitPreviewMode();
            });
            
            document.getElementById('previewConfirmBtn').addEventListener('click', () => {
                this.confirmVideo();
            });
        }
        
        // Animate overlay in
        gsap.from(overlay, {
            duration: 0.5,
            opacity: 0,
            y: 30,
            ease: 'power2.out'
        });
        
        overlay.style.display = 'flex';
    }
    
    hidePreviewOverlay() {
        const overlay = document.querySelector('.dance__preview-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
    
    updateUIForPreview() {
        // Update button text and functionality
        const uploadBtn = document.getElementById('danceUploadBtn');
        const retakeBtn = document.getElementById('danceRetakeBtn');
        const discardBtn = document.getElementById('danceDiscardBtn');
        
        uploadBtn.textContent = 'Upload';
        retakeBtn.textContent = 'Retake';
        discardBtn.innerHTML = '×';
        
        // Hide recording controls
        gsap.to('.dance__controls-overlay', { duration: 0.3, opacity: 0 });
    }
    
    exitPreviewMode() {
        this.isInPreviewMode = false;
        this.recordedVideoBlob = null;
        
        // Reset video to live stream
        const video = document.getElementById('danceVideo');
        video.controls = false;
        video.src = '';
        video.srcObject = this.stream;
        
        // Hide preview overlay
        this.hidePreviewOverlay();
        
        // Show recording controls
        gsap.to('.dance__controls-overlay', { duration: 0.3, opacity: 1 });
        
        // Reset timer
        this.recordingTime = 0;
        this.updateTimer();
        
        // Reset UI
        const uploadBtn = document.getElementById('danceUploadBtn');
        const retakeBtn = document.getElementById('danceRetakeBtn');
        
        uploadBtn.textContent = 'Upload';
        retakeBtn.textContent = 'Retake';
    }
    
    confirmVideo() {
        if (!this.recordedVideoBlob) {
            alert('No video to upload. Please record something first.');
            return;
        }
        
        // Save the video
        const videoUrl = URL.createObjectURL(this.recordedVideoBlob);
        this.userData.dance.push({
            blob: this.recordedVideoBlob,
            url: videoUrl,
            timestamp: new Date().toISOString(),
            duration: this.recordingTime
        });
        
        this.saveUserData();
        
        // Animate success and navigate
        gsap.to('.dance', {
            duration: 0.5,
            scale: 0.95,
            opacity: 0.8,
            ease: 'power2.out',
            onComplete: () => {
                window.location.href = 'succes_signal.html';
            }
        });
    }
    
    updateTimer() {
        const minutes = Math.floor(this.recordingTime / 60);
        const seconds = this.recordingTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('danceTimer').textContent = timeString;
    }
    
    async flipCamera() {
        if (this.isRecording) {
            alert('Cannot flip camera while recording.');
            return;
        }
        
        this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        
        await this.initCamera();
    }
    
    retake() {
        if (this.isInPreviewMode) {
            this.exitPreviewMode();
        } else {
            // Remove last recording if exists
            if (this.userData.dance.length > 0) {
                const lastRecording = this.userData.dance.pop();
                URL.revokeObjectURL(lastRecording.url);
                this.saveUserData();
            }
            
            this.recordingTime = 0;
            this.updateTimer();
        }
    }
    
    showModal(type) {
        const modal = document.getElementById(`${type}Modal`);
        if (modal) {
            modal.classList.remove('modal--hidden');
            
            gsap.from(modal.querySelector('.modal__content'), {
                duration: 0.3,
                scale: 0.8,
                opacity: 0,
                ease: 'back.out(1.7)'
            });
        }
    }
    
    hideModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('modal--hidden');
        });
    }
    
    confirmUpload() {
        this.hideModal();
        if (this.isInPreviewMode) {
            this.confirmVideo();
        } else {
            window.location.href = 'succes_signal.html';
        }
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