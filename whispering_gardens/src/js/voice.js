// Voice Page JavaScript
class VoiceRecorder {
    constructor() {
        this.audioRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;
        this.recordingTimer = null;
        this.recordingTime = 0;
        this.userData = JSON.parse(localStorage.getItem('signalUserData')) || { voice: [] };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        
        // GSAP animations
        gsap.from('.voice__title', { duration: 0.8, y: -30, opacity: 0 });
        gsap.from('.voice__description', { duration: 0.8, y: 20, opacity: 0, delay: 0.2 });
        gsap.from('.voice__recorder-container', { duration: 1, scale: 0.9, opacity: 0, delay: 0.4 });
    }
    
    bindEvents() {
        document.getElementById('voiceBackBtn').addEventListener('click', () => {
            window.location.href = 'menu.html';
        });
        
        document.getElementById('voiceRecordBtn').addEventListener('click', () => {
            this.toggleRecording();
        });
        
        document.getElementById('voiceRetakeBtn').addEventListener('click', () => {
            this.retake();
        });
        
        document.getElementById('voiceUploadBtn').addEventListener('click', () => {
            this.upload();
        });
    }
    
    async toggleRecording() {
        const recordBtn = document.getElementById('voiceRecordBtn');
        
        if (!this.isRecording) {
            await this.startRecording();
            recordBtn.classList.add('recording');
        } else {
            this.stopRecording();
            recordBtn.classList.remove('recording');
        }
    }
    
    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            this.audioRecorder = new MediaRecorder(stream);
            this.recordedChunks = [];
            this.recordingTime = 0;
            this.isRecording = true;
            
            this.audioRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            
            this.audioRecorder.onstop = () => {
                this.processRecording();
                stream.getTracks().forEach(track => track.stop());
            };
            
            this.audioRecorder.start();
            
            this.recordingTimer = setInterval(() => {
                this.recordingTime++;
                this.updateTimer();
            }, 1000);
            
            this.animateVisualizer();
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Unable to access microphone. Please check permissions.');
        }
    }
    
    stopRecording() {
        this.isRecording = false;
        
        if (this.audioRecorder && this.audioRecorder.state === 'recording') {
            this.audioRecorder.stop();
        }
        
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
        
        document.getElementById('voiceRecordBtn').classList.remove('recording');
        this.stopVisualizer();
    }
    
    processRecording() {
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        
        this.userData.voice.push({
            blob: blob,
            url: audioUrl,
            timestamp: new Date().toISOString(),
            duration: this.recordingTime
        });
        
        this.saveUserData();
    }
    
    updateTimer() {
        const minutes = Math.floor(this.recordingTime / 60);
        const seconds = this.recordingTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('voiceTimer').textContent = timeString;
    }
    
    animateVisualizer() {
        const waves = document.querySelectorAll('.voice__wave');
        waves.forEach((wave, index) => {
            setTimeout(() => {
                wave.classList.add('active');
            }, index * 100);
        });
    }
    
    stopVisualizer() {
        const waves = document.querySelectorAll('.voice__wave');
        waves.forEach(wave => {
            wave.classList.remove('active');
        });
    }
    
    retake() {
        if (this.userData.voice.length > 0) {
            const lastRecording = this.userData.voice.pop();
            URL.revokeObjectURL(lastRecording.url);
            this.saveUserData();
        }
        
        this.recordingTime = 0;
        this.updateTimer();
    }
    
    upload() {
        if (this.userData.voice.length === 0) {
            alert('No recording to upload. Please record something first.');
            return;
        }
        
        window.location.href = 'success_signal.html';
    }
    
    saveUserData() {
        const dataToSave = {
            ...this.userData,
            voice: this.userData.voice.map(item => ({
                timestamp: item.timestamp,
                duration: item.duration
            }))
        };
        
        localStorage.setItem('signalUserData', JSON.stringify(dataToSave));
        console.log('Voice data saved:', dataToSave);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VoiceRecorder();
});