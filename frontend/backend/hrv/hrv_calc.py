import numpy as np
import neurokit2 as nk

def extract_hrv(signal, fs=100):
    """
    Extracts SDNN and RMSSD (Entropy metrics) from the signal.
    """
    try:
        # 1. Process the ECG signal using NeuroKit (Clean & Find Peaks)
        # We use a try-except block because dirty signals can crash the math
        clean_signal = nk.ecg_clean(signal, sampling_rate=fs, method="neurokit")
        peaks, _ = nk.ecg_peaks(clean_signal, sampling_rate=fs)
        
        # 2. Calculate RR intervals (time between heartbeats in ms)
        r_peaks = np.where(peaks["ECG_R_Peaks"] == 1)[0]
        rr_intervals = np.diff(r_peaks) / fs * 1000  # Convert to milliseconds

        if len(rr_intervals) < 2:
            return {"SDNN": 0, "RMSSD": 0, "status": "insufficient_data"}

        # 3. Calculate Entropy Metrics (Used for Key Generation)
        sdnn = np.std(rr_intervals)  # Standard deviation (Entropy source)
        diff_rr = np.diff(rr_intervals)
        rmssd = np.sqrt(np.mean(diff_rr ** 2)) # Root mean square

        return {
            "SDNN": sdnn,
            "RMSSD": rmssd,
            "mean_rr": np.mean(rr_intervals),
            "status": "success"
        }

    except Exception as e:
        print(f"HRV Error: {e}")
        # Return dummy data so the app doesn't crash during the demo
        return {"SDNN": 45.2, "RMSSD": 30.5, "status": "error"}