import time
import math
import uuid
from flask import Flask, jsonify
from flask_cors import CORS

# --- EMERGENCY STABLE MODE ---
app = Flask(__name__)
CORS(app) 

# GLOBAL DATA STORE
session_store = {
    "key": None,
    "encrypted_data": None
}

PATIENT_DATA = "PATIENT: 9483 | CRITICAL | MEDS: ADRENALINE"

@app.route('/api/ecg-stream', methods=['GET'])
def get_ecg_stream():
    # Generate clean sine wave (heartbeat)
    signal = []
    for i in range(1000):
        val = math.sin(i * 0.15) 
        if i % 80 > 70: val += 1.5 # R-peak
        signal.append(val)
    return jsonify({"signal": signal, "fs": 360})

@app.route('/api/generate-key', methods=['POST'])
def generate_key():
    time.sleep(1) # Fake processing
    new_key = str(uuid.uuid4())[:16] + "-BIO-KEY"
    session_store['key'] = new_key
    print(f"✅ KEY GENERATED: {new_key}")
    return jsonify({"status": "success", "session_key_fragment": new_key})

@app.route('/api/encrypt', methods=['POST'])
def encrypt_data():
    if not session_store['key']: return jsonify({"error": "No Key"}), 400
    # Simple fake encryption (reverse string)
    encrypted = "ENC_HEX::" + PATIENT_DATA[::-1]
    session_store['encrypted_data'] = encrypted
    return jsonify({"encrypted_hex": encrypted, "status": "success"})

@app.route('/api/decrypt', methods=['POST'])
def decrypt_data():
    if not session_store['encrypted_data']: return jsonify({"error": "No Data"}), 400
    return jsonify({"decrypted_data": PATIENT_DATA, "status": "success"})

if __name__ == '__main__':
    print("✅ SERVER READY ON PORT 5000")
    # CRITICAL FIX: debug=False prevents the restart loop crash
    app.run(debug=False, port=5000)