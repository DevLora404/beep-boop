// Morse code mapping
//JavaScript version bc i hate myself
const textToMorseMap = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
    '\'': '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
    '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
};

// Create reverse mapping
const morseToTextMap = {};
for (let key in textToMorseMap) {
    morseToTextMap[textToMorseMap[key]] = key;
}

// Audio context for Morse playback
let audioContext;
let isPlaying = false;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function convertToMorse() {
    const text = document.getElementById('textInput').value.toUpperCase();
    let morse = '';

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ') {
            morse += ' / ';
        } else if (textToMorseMap[char]) {
            morse += textToMorseMap[char] + ' ';
        }
    }

    document.getElementById('morseInput').value = morse.trim();
    updateCharCount('morse');
}

function convertToText() {
    const morse = document.getElementById('morseInput').value;
    const words = morse.split(' / ');
    let text = '';

    for (let word of words) {
        const letters = word.split(' ');
        for (let letter of letters) {
            if (morseToTextMap[letter]) {
                text += morseToTextMap[letter];
            }
        }
        text += ' ';
    }

    document.getElementById('textInput').value = text.trim();
    updateCharCount('text');
}

function clearAll() {
    document.getElementById('textInput').value = '';
    document.getElementById('morseInput').value = '';
    updateCharCount('text');
    updateCharCount('morse');
}

function swapInputs() {
    const textInput = document.getElementById('textInput');
    const morseInput = document.getElementById('morseInput');
    const temp = textInput.value;
    textInput.value = morseInput.value;
    morseInput.value = temp;
    updateCharCount('text');
    updateCharCount('morse');
}

// Character counter
function updateCharCount(type) {
    const input = document.getElementById(type === 'text' ? 'textInput' : 'morseInput');
    const counter = document.getElementById(type === 'text' ? 'textCharCount' : 'morseCharCount');
    const length = input.value.length;
    const words = input.value.trim().split(/\s+/).filter(w => w.length > 0).length;
    counter.textContent = `${length} characters, ${words} word${words !== 1 ? 's' : ''}`;
}

// Copy to clipboard
function copyToClipboard(elementId) {
    const textarea = document.getElementById(elementId);
    textarea.select();
    document.execCommand('copy');
    
    // Visual feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✓ Copied!';
    button.style.background = 'rgba(34, 197, 94, 0.2)';
    button.style.borderColor = 'rgba(34, 197, 94, 0.4)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        button.style.borderColor = '';
    }, 2000);
}

// Play Morse code as audio
async function playMorse() {
    if (isPlaying) return;
    
    const morse = document.getElementById('morseInput').value;
    if (!morse.trim()) return;
    
    initAudioContext();
    isPlaying = true;
    
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '⏸ Playing...';
    button.disabled = true;
    
    const dotDuration = 100; // ms
    const dashDuration = dotDuration * 3;
    const symbolGap = dotDuration;
    const letterGap = dotDuration * 3;
    const wordGap = dotDuration * 7;
    const frequency = 600; // Hz
    
    let currentTime = audioContext.currentTime;
    
    const words = morse.split(' / ');
    
    for (let w = 0; w < words.length; w++) {
        const letters = words[w].split(' ');
        
        for (let l = 0; l < letters.length; l++) {
            const letter = letters[l];
            
            for (let i = 0; i < letter.length; i++) {
                const symbol = letter[i];
                const duration = symbol === '.' ? dotDuration : dashDuration;
                
                // Create oscillator for beep
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.01);
                gainNode.gain.setValueAtTime(0.3, currentTime + duration / 1000 - 0.01);
                gainNode.gain.linearRampToValueAtTime(0, currentTime + duration / 1000);
                
                oscillator.start(currentTime);
                oscillator.stop(currentTime + duration / 1000);
                
                currentTime += duration / 1000 + symbolGap / 1000;
            }
            
            if (l < letters.length - 1) {
                currentTime += letterGap / 1000 - symbolGap / 1000;
            }
        }
        
        if (w < words.length - 1) {
            currentTime += wordGap / 1000 - letterGap / 1000;
        }
    }
    
    // Reset button after audio finishes
    const totalDuration = (currentTime - audioContext.currentTime) * 1000;
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        isPlaying = false;
    }, totalDuration);
}

// Dark/Light mode toggle
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const icon = document.querySelector('.theme-icon');
    icon.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
    
    // Save preference
    const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
}

// Load theme preference
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        document.querySelector('.theme-icon').textContent = '🌙';
    }
    updateCharCount('text');
    updateCharCount('morse');
});

// Allow Enter key to convert
document.getElementById('textInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        convertToMorse();
    }
});

document.getElementById('morseInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        convertToText();
    }
});