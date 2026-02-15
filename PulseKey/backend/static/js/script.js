const API_URL = '/api';

const generateBtn = document.getElementById('generateBtn');
const encryptBtn = document.getElementById('encryptBtn');
const keyDisplay = document.getElementById('keyDisplay');
const outputDisplay = document.getElementById('outputDisplay');
const patientInput = document.getElementById('patientData');

let currentKey = null;

// --- INTERACTION LOGIC ---

generateBtn.addEventListener('click', async () => {
    generateBtn.disabled = true;
    let timeLeft = 60;

    const countdownInterval = setInterval(async () => {
        generateBtn.textContent = `COLLECTING DATA FROM DATASET... ${timeLeft}s`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(countdownInterval);
            generateBtn.textContent = "ANALYZING...";

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
        }
    }, 1000);
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


