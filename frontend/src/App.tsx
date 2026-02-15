import React, { useState } from 'react';
import './App.css';

const API_URL = "http://127.0.0.1:5000/api";

export default function App() {
  const [key, setKey] = useState<string>("");
  const [encrypted, setEncrypted] = useState<string>("");
  const [decrypted, setDecrypted] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const addLog = (msg: string) => setLogs(prev => [`> ${msg}`, ...prev]);

  const handleGenKey = async () => {
    setIsAnalyzing(true);
    addLog("INITIATING DATA COLLECTION SEQUENCE...");

    // 60 Second Countdown
    for (let i = 60; i > 0; i--) {
      setTimeLeft(i);
      await new Promise(r => setTimeout(r, 1000));
    }
    setTimeLeft(0);

    addLog("PROCESSING BIOMETRIC HRV...");
    try {
      const res = await fetch(`${API_URL}/generate-key`, { method: 'POST' });
      const data = await res.json();
      setKey(data.session_key_fragment);
      addLog("BIO-KEY GENERATED SECURELY");
    } catch (e) {
      addLog("ERROR: CONNECTION FAILED");
    }
    setIsAnalyzing(false);
  };

  const handleEncrypt = async () => {
    const res = await fetch(`${API_URL}/encrypt`, { method: 'POST' });
    const data = await res.json();
    setEncrypted(data.encrypted_hex);
    addLog("DATA ENCRYPTED FOR TRANSMISSION");
  };

  const handleDecrypt = async () => {
    const res = await fetch(`${API_URL}/decrypt`, { method: 'POST' });
    const data = await res.json();
    setDecrypted(data.decrypted_data);
    addLog("DATA DECRYPTED SUCCESSFULLY");
  };

  return (
    <div className="bento-container">
      {/* Card 1: Title & Identity */}
      <div className="card title-card">
        <h1>PulseKey<br />Protocol</h1>
        <p className="subtitle">SECURE MEDICAL IOT GATEWAY</p>
      </div>

      {/* Card 2: Status / Time */}
      <div className="card status-card">
        <div className="status-header">SYSTEM STATUS</div>
        <div className={`status-indicator ${isAnalyzing ? 'active' : ''}`}>
          {isAnalyzing ? (
            <div className="countdown-display">
              <span className="huge-number">{timeLeft}</span>
              <span className="unit">SEC</span>
            </div>
          ) : (
            <div className="ready-display">
              <span className="huge-number">{key ? "SECURE" : "READY"}</span>
            </div>
          )}
        </div>
        <div className="location-tag">
          SESSION: {new Date().getFullYear()} <br />
          LATENCY: 12ms
        </div>
      </div>

      {/* Card 3: Controls (Skill Matrix style) */}
      <div className="card controls-card">
        <div className="card-header">OPERATIONAL CONTROL</div>
        <div className="button-grid">
          <button
            onClick={handleGenKey}
            className={`bento-btn ${isAnalyzing ? 'disabled' : ''}`}
            disabled={isAnalyzing}
          >
            <span className="btn-label">01 // INITIALIZE</span>
            <span className="btn-status">{isAnalyzing ? "BUSY" : "IDLE"}</span>
          </button>
          <button
            onClick={handleEncrypt}
            className="bento-btn"
            disabled={!key}
          >
            <span className="btn-label">02 // ENCRYPT</span>
            <span className="btn-status">{key ? "READY" : "LOCKED"}</span>
          </button>
          <button
            onClick={handleDecrypt}
            className="bento-btn"
            disabled={!encrypted}
          >
            <span className="btn-label">03 // DECRYPT</span>
            <span className="btn-status">{encrypted ? "READY" : "LOCKED"}</span>
          </button>
        </div>
      </div>

      {/* Card 4: Data Terminal (Bottom Wide) */}
      <div className="card terminal-card">
        <div className="card-header">DATA TERMINAL</div>
        <div className="terminal-grid">
          <div className="data-block">
            <label>SESSION KEY</label>
            <div className="data-value key-value">{key || "---"}</div>
          </div>
          <div className="data-block">
            <label>ENCRYPTED PAYLOAD</label>
            <div className="data-value">{encrypted || "---"}</div>
          </div>
          <div className="data-block">
            <label>DECRYPTED RECORD</label>
            <div className="data-value highlight">{decrypted || "---"}</div>
          </div>
        </div>
      </div>

      {/* Card 5: Logs (Right Side) */}
      <div className="card logs-card">
        <div className="card-header">SYSTEM LOGS</div>
        <div className="log-scroller">
          {logs.map((log, i) => <div key={i} className="log-line">{log}</div>)}
          <div className="terminal-cursor">_</div>
        </div>
      </div>
    </div>
  );
}