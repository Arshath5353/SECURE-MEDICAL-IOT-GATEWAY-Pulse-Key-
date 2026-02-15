const API_URL = 'http://localhost:5000/api';

const ecgCanvas = document.getElementById('ecgCanvas');
const ctx = ecgCanvas.getContext('2d');
const generateBtn = document.getElementById('generateBtn');
const encryptBtn = document.getElementById('encryptBtn');
const keyDisplay = document.getElementById('keyDisplay');
const outputDisplay = document.getElementById('outputDisplay');
const patientInput = document.getElementById('patientData');

let ecgData = [];
let currentIndex = 0;
let animationId;
let currentKey = null;

// --- ECG VISUALIZATION ---
async function startEcgStream() {
    try {
        const response = await fetch(`${API_URL}/ecg-stream`);
        const result = await response.json();

        if (result.signal) {
            ecgData = result.signal;
            drawEcg();
        }
    } catch (e) {
        console.error("ECG Stream Error:", e);
        // Fallback for visual if backend is offline initially
        ecgData = new Array(500).fill(0).map((_, i) => Math.sin(i * 0.1) * 0.5);
        drawEcg();
    }
}

function resizeCanvas() {
    ecgCanvas.width = ecgCanvas.parentElement.clientWidth;
    ecgCanvas.height = ecgCanvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Static draw function (Live animation removed)
function drawEcg() {
    const width = ecgCanvas.width;
    const height = ecgCanvas.height;
    const centerY = height / 2;
    const scale = height / 3;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    ctx.strokeStyle = '#00ff9d';
    ctx.lineWidth = 2;

    // Draw the static waveform from the start
    const pointsToDraw = Math.min(width, ecgData.length);

    for (let x = 0; x < pointsToDraw; x++) {
        const y = centerY - (ecgData[x] * scale);

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.stroke();
}

// --- INTERACTION LOGIC ---

generateBtn.addEventListener('click', async () => {
    generateBtn.textContent = "SCANNING...";
    generateBtn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/generate-key`, { method: 'POST' });
        const result = await response.json();

        if (result.status === 'success') {
            currentKey = result.key;

            // "Typewriter" effect for key
            keyDisplay.style.color = "#fff";
            keyDisplay.textContent = result.key;
            keyDisplay.style.borderLeftColor = "#00ff9d";

            encryptBtn.disabled = false;
            generateBtn.textContent = "RE-GENERATE KEY";
            generateBtn.disabled = false;
        } else {
            keyDisplay.textContent = "ERROR: " + (result.error || "Signal Lost");
            generateBtn.disabled = false;
        }
    } catch (e) {
        keyDisplay.textContent = "CONNECTION FAILURE";
        generateBtn.disabled = false;
        generateBtn.textContent = "RETRY";
    }
});

encryptBtn.addEventListener('click', async () => {
    if (!currentKey) return;

    const data = patientInput.value;
    encryptBtn.innerHTML = "ENCRYPTING...";

    try {
        const response = await fetch(`${API_URL}/encrypt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: currentKey, data: data })
        });

        const result = await response.json();

        if (result.status === 'success') {
            outputDisplay.innerHTML = `
                <span style="color:#888;">IV:</span> ${result.iv_hex}<br>
                <span style="color:#fff;">CT:</span> ${result.encrypted_hex.substring(32)}
            `;
            outputDisplay.parentElement.style.borderLeftColor = "#00ff9d";
            encryptBtn.innerHTML = "ENCRYPTION COMPLETE";
            setTimeout(() => encryptBtn.innerHTML = "ENCRYPT DATA", 2000);
        }
    } catch (e) {
        outputDisplay.textContent = "ENCRYPTION FAILED";
        console.error(e);
    }
});

// Start
startEcgStream();
