🏥 Secure Medical IoT Gateway (Pulse Key)
A Biometric-Secured Healthcare Monitoring System

This project demonstrates a secure Medical IoT (Internet of Things) system that uses a patient's own biological heart rhythm (ECG) to generate cryptographic keys. It ensures that sensitive medical data can only be accessed or transmitted when the patient's unique live biometric signature is present.

🚀 Key Features
❤️ Live Bio-Signal Stream: Visualizes real-time ECG (heartbeat) data using Chart.js, updating every 500ms.

🔐 Biometric Key Generation: Analyzes Heart Rate Variability (HRV) and entropy to generate unique, ephemeral security keys using a custom Python algorithm (hrv_calc.py).

🛡️ AES-256 Simulation: Encrypts sensitive patient records (e.g., condition, medication) using the generated bio-keys before transmission.

⚡ Real-Time Dashboard: A responsive React-based interface for doctors to monitor status and control data encryption/decryption.

🛠️ Tech Stack
Frontend
Framework: React (Vite)

Language: TypeScript (TSX)

Visualization: Chart.js & react-chartjs-2

Styling: CSS Modules (Dark Medical Theme)

Backend
Server: Python (Flask)

Security Logic: Custom entropy algorithms

API: RESTful endpoints for streaming and encryption

Networking: Flask-CORS

📂 Project Structure
Bash
root/
├── backend/
│   ├── app.py             # Main Flask Server
│   ├── venv/              # Python Virtual Environment
│   └── hrv/
│       └── hrv_calc.py    # Custom Heart Rate Entropy Algorithm
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Main Dashboard Logic & UI
│   │   └── main.tsx       # React Entry Point
│   ├── public/
│   └── package.json       # Node Dependencies
└── start_project.bat      # One-click Windows Launcher
📦 Installation & Setup
Prerequisites
Node.js (v16 or higher)

Python (v3.8 or higher)

1. Clone the Repository
Bash
git clone https://github.com/YOUR-USERNAME/secure-medical-iot.git
cd secure-medical-iot
2. Setup Backend (Python)
Navigate to the backend folder and install dependencies:

Bash
cd backend
python -m venv venv
# Activate Virtual Environment (Windows):
venv\Scripts\activate
# Activate Virtual Environment (Mac/Linux):
source venv/bin/activate

pip install flask flask-cors
3. Setup Frontend (React)
Open a new terminal, navigate to the frontend, and install packages:

Bash
cd frontend
npm install
npm install chart.js react-chartjs-2
🚦 How to Run
Option 1: The Easy Way (Windows)
Double-click the start_project.bat file in the root directory. This will automatically launch both servers and open your browser.

Option 2: Manual Start
Terminal 1 (Backend):

Bash
cd backend
python app.py
You should see: ✅ MEDICAL BACKEND RUNNING ON PORT 5000

Terminal 2 (Frontend):

Bash
cd frontend
npm run dev
Open your browser to: http://localhost:5173

🔒 Security Concept
Data Acquisition: The system captures raw ECG data simulation.

Entropy Extraction: The backend calculates the variance and complexity of the heartbeat signal.

Key Synthesis: A unique session key is derived from this biological entropy.

Encryption: Patient data is encrypted with this key, making it mathematically linked to the patient's physiology.

🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

⚠️ Disclaimer
This is a prototype for educational and demonstration purposes. It uses simulated ECG data and standard AES simulation. Do not use for actual life-critical medical applications.