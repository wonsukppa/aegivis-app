import time
import random

class UnderpassFloodAI:
    def __init__(self, radar_port, camera_id):
        self.radar_port = radar_port
        self.camera_id = camera_id
        self.current_water_level = 0.0  # mm
        self.water_rising_rate = 0.0    # mm/min
        self.last_check_time = time.time()
        self.critical_threshold = 200.0 # 20cm is critical for underpasses
        
    def get_radar_data(self):
        # Simulate mmWave Radar distance measurement
        # In real scenario: Serial/TCP reading from sensor
        noise = random.uniform(-0.5, 0.5)
        return self.current_water_level + noise

    def get_vision_ai_status(self):
        # Simulate AI CCTV Vision Analysis
        # In real scenario: Processing frame with YOLO/OpenCV
        if self.current_water_level > 5.0:
            return "WATER_DETECTED"
        return "DRY"

    def predict_flood_time(self):
        if self.water_rising_rate <= 0:
            return float('inf')
        remaining_level = self.critical_threshold - self.current_water_level
        return remaining_level / self.water_rising_rate

    def fusion_decision_logic(self):
        radar_val = self.get_radar_data()
        vision_status = self.get_vision_ai_status()
        
        # Core Fusion Logic: Cross-verification
        if radar_val > 10.0 and vision_status == "WATER_DETECTED":
            return "CONFIRMED_FLOOD", radar_val
        elif radar_val > 10.0 and vision_status == "DRY":
            return "WARNING_SENSOR_NOISE", radar_val
        else:
            return "SAFE", radar_val

    def run_simulation(self, duration_mins=10):
        print(f"--- [Aegivis AI] Underpass Monitoring Started ---")
        for i in range(duration_mins):
            # Simulate water rising (5-15mm per minute)
            self.water_rising_rate = random.uniform(5, 15)
            self.current_water_level += self.water_rising_rate
            
            status, level = self.fusion_decision_logic()
            est_time = self.predict_flood_time()
            
            print(f"[Min {i+1}] Level: {level:.2f}mm | Status: {status} | Prediction: {est_time:.1f} mins to critical")
            
            if level >= self.critical_threshold:
                print("!!! [CRITICAL] FLOOD DETECTED - ACTIVATING BARRIERS !!!")
                break
            time.sleep(0.1) # Accelerated simulation

if __name__ == "__main__":
    aegivis_ai = UnderpassFloodAI("COM3", 0)
    aegivis_ai.run_simulation()
