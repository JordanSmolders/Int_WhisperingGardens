
class WordInput {
    constructor() {
        this.userData = JSON.parse(localStorage.getItem('signalUserData')) || { word: [] };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadDraft();
        
   
        gsap.from('.word__title', { duration: 0.8, y: -30, opacity: 0 });
        gsap.from('.word__description', { duration: 0.8, y: 20, opacity: 0, delay: 0.2 });
        gsap.from('.word__input-container', { duration: 1, y: 30, opacity: 0, delay: 0.4 });
        gsap.from('.word__actions', { duration: 0.8, y: 20, opacity: 0, delay: 0.6 });
        
     
        setTimeout(() => {
            document.getElementById('wordTextarea').focus();
        }, 800);
    }
    
    bindEvents() {
        document.getElementById('wordBackBtn').addEventListener('click', () => {
            this.saveDraft();
            window.location.href = 'menu.html';
        });
        
        document.getElementById('wordClearBtn').addEventListener('click', () => {
            this.clearText();
        });
        
        document.getElementById('wordSubmitBtn').addEventListener('click', () => {
            this.submitWord();
        });
        
      
        document.getElementById('wordTextarea').addEventListener('input', (e) => {
            this.autoSave(e.target.value);
        });
        
        // Handle Enter key for submission (Ctrl+Enter or Cmd+Enter)
        document.getElementById('wordTextarea').addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                this.submitWord();
            }
        });
        

        document.getElementById('wordTextarea').addEventListener('input', (e) => {
            this.updateCharacterCount(e.target.value.length);
        });
    }
    
    loadDraft() {
        const draft = localStorage.getItem('wordDraft');
        if (draft) {
            document.getElementById('wordTextarea').value = draft;
        }
    }
    
    saveDraft() {
        const text = document.getElementById('wordTextarea').value;
        if (text.trim()) {
            localStorage.setItem('wordDraft', text);
        } else {
            localStorage.removeItem('wordDraft');
        }
    }
    
    clearText() {
        const textarea = document.getElementById('wordTextarea');
        
 
        gsap.to(textarea, {
            duration: 0.2,
            scale: 0.98,
            ease: 'power2.out',
            onComplete: () => {
                textarea.value = '';
                textarea.focus();
                localStorage.removeItem('wordDraft');
                
             
                gsap.to(textarea, {
                    duration: 0.2,
                    scale: 1,
                    ease: 'power2.out'
                });
            }
        });
    }
    
    submitWord() {
        const textarea = document.getElementById('wordTextarea');
        const text = textarea.value.trim();
        
        if (!text) {
         
            gsap.to(textarea, {
                duration: 0.1,
                x: -10,
                repeat: 5,
                yoyo: true,
                ease: 'power2.inOut',
                onComplete: () => {
                    gsap.set(textarea, { x: 0 });
                }
            });
            
            alert('Please enter some text before submitting.');
            textarea.focus();
            return;
        }
        
  
        if (text.length > 1000) {
            alert('Please keep your message under 1000 characters.');
            textarea.focus();
            return;
        }
        

        this.userData.word.push({
            text: text,
            timestamp: new Date().toISOString(),
            wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
            characterCount: text.length
        });
        
        this.saveUserData();
        
      
        localStorage.removeItem('wordDraft');
        
      
        gsap.to('.word__content', {
            duration: 0.5,
            scale: 0.95,
            opacity: 0.8,
            ease: 'power2.out',
            onComplete: () => {
                window.location.href = 'success_signal.html';
            }
        });
    }
    
    autoSave(text) {
     
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            if (text.trim()) {
                localStorage.setItem('wordDraft', text);
            } else {
                localStorage.removeItem('wordDraft');
            }
        }, 500);
    }
    
    updateCharacterCount(count) {
    
        const maxChars = 1000;
        const remaining = maxChars - count;
        
     
        const charCountElement = document.getElementById('charCount');
        if (charCountElement) {
            charCountElement.textContent = `${remaining} characters remaining`;
            
         
            if (remaining < 100) {
                charCountElement.style.color = '#ff5722';
            } else if (remaining < 200) {
                charCountElement.style.color = '#ff9800';
            } else {
                charCountElement.style.color = 'rgba(255, 255, 255, 0.7)';
            }
        }
    }
    
    saveUserData() {
       
        const dataToSave = {
            ...this.userData,
            word: this.userData.word.map(item => ({
                text: item.text,
                timestamp: item.timestamp,
                wordCount: item.wordCount,
                characterCount: item.characterCount
            }))
        };
        
        localStorage.setItem('signalUserData', JSON.stringify(dataToSave));
        console.log('Word data saved:', dataToSave.word[dataToSave.word.length - 1]);
    }
    
  
    getUserStats() {
        const totalWords = this.userData.word.reduce((total, entry) => total + (entry.wordCount || 0), 0);
        const totalCharacters = this.userData.word.reduce((total, entry) => total + (entry.characterCount || 0), 0);
        const totalEntries = this.userData.word.length;
        
        return {
            totalWords,
            totalCharacters,
            totalEntries,
            averageWordsPerEntry: totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0
        };
    }
    
    
    exportWords() {
        const words = this.userData.word.map(entry => ({
            text: entry.text,
            date: new Date(entry.timestamp).toLocaleString(),
            wordCount: entry.wordCount,
            characterCount: entry.characterCount
        }));
        
        console.log('User word entries:', words);
        return words;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new WordInput();
});


document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
       
        const text = document.getElementById('wordTextarea')?.value;
        if (text && text.trim()) {
            localStorage.setItem('wordDraft', text);
        }
    }
});


window.addEventListener('beforeunload', () => {
    const text = document.getElementById('wordTextarea')?.value;
    if (text && text.trim()) {
        localStorage.setItem('wordDraft', text);
    }
});