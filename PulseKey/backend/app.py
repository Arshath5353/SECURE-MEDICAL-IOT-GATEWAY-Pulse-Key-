import os
import wfdb
import numpy as np
import hashlib
import uuid
import base64
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS

app = Flask(__name__, static_url_path='/static')
CORS(app)

# Configuration
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
RECORD_NAME = '100'

@app.route('/')
def index():
    return render_template('index.html')

def load_real_ecg_segment(start_idx=0, end_idx=1000):
    """Loads a segment of the MIT-BIH record."""
    try:
        record_path = os.path.join(DATA_DIR, RECORD_NAME)
        # wfdb.rdsamp returns (signal_array, fields_dict)
        # We read channel 0 (MLII usually)
        signals, fields = wfdb.rdsamp(record_path, channels=[0], sampfrom=start_idx, sampto=end_idx)
        # Flatten and convert to list for JSON serialization
        return signals.flatten().tolist(), fields['fs']
    except Exception as e:
        print(f"Error loading WFDB data: {e}")
        return None, 360

@app.route('/api/ecg-stream', methods=['GET'])
def get_ecg_stream():
    """Returns a snippet of real ECG data for visualization."""
    data, fs = load_real_ecg_segment(0, 500) # Get first 500 samples
    if data is None:
        return jsonify({"error": "Failed to load ECG data. Ensure '100.dat' and '100.hea' are in data/"}), 500
    return jsonify({"signal": data, "fs": fs})

@app.route('/api/generate-key', methods=['POST'])
def generate_key():
    """Derives a cryptographic key from real ECG features."""
    # Simulation: We take a random chunk of the signal to simulate 'live' capture
    # In a real device, this would be the current heartbeat window.
    start = np.random.randint(0, 10000)
    data, _ = load_real_ecg_segment(start, start + 200)
    
    if data is None:
        return jsonify({"error": "Data load failed"}), 500

    # Convert physiological data to a hash --> Key
    # We convert the float array to bytes
    data_bytes = str(data).encode('utf-8')
    # Use SHA-256 to get a stable 32-byte key
    derived_key = hashlib.sha256(data_bytes).hexdigest() 
    
    return jsonify({
        "status": "success",
        "key": derived_key,
        "source_segment_index": start
    })

@app.route('/api/encrypt', methods=['POST'])
def encrypt_data():
    """Encrypts patient data using AES-CBC with the bio-derived key."""
    req_data = request.json
    key_hex = req_data.get('key')
    patient_data = req_data.get('data')

    if not key_hex or not patient_data:
        return jsonify({"error": "Missing key or data"}), 400

    try:
        # 1. Prepare Key (32 bytes for AES-256)
        key = bytes.fromhex(key_hex)
        if len(key) != 32:
            # If key size is wrong, just hash it to fix it (robustness for demo)
            key = hashlib.sha256(key).digest()

        # 2. Generate IV (16 bytes)
        iv = os.urandom(16)

        # 3. Pad Data (PKCS7)
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(patient_data.encode()) + padder.finalize()

        # 4. Encrypt (AES-CBC)
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        ciphertext = encryptor.update(padded_data) + encryptor.finalize()

        # 5. Return Hex (IV + Ciphertext)
        result_hex = (iv + ciphertext).hex()
        
        return jsonify({
            "status": "success",
            "encrypted_hex": result_hex,
            "iv_hex": iv.hex()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Scalable Medical IoT Security Backend Running...")
    app.run(debug=True, port=5000)
