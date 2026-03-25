import time
import random
import json
import os

# Configuration
DATA_FILE = r'c:\Users\양동혁\Desktop\이지비스\01_프로젝트_지하차도_침수예측_시스템\04_SW_개발_및_프로토타입\underpass_sim_data.json'
SIM_INTERVAL = 2  # Seconds between data points

class UnderpassSimulator:
    def __init__(self):
        self.actual_water_level = 0.0  # mm
        self.rainfall_rate = 0.0      # mm/h
        self.learning_iterations = 0
        self.base_error_margin = 25.0 # Initial error margin in mm
        self.current_error_margin = 25.0
        self.is_raining = False
        self.sim_time = 0

    def calculate_current_error(self):
        # AI learns over time: Error decreases exponentially with iterations
        # Formula: current_error = base_error * (0.8 ^ iterations)
        return self.base_error_margin * (0.8 ** self.learning_iterations)

    def step(self):
        self.sim_time += 1
        
        # Simulate weather: simple rain event every few steps
        if self.sim_time % 30 == 0:
            self.is_raining = not self.is_raining
            if self.is_raining:
                self.rainfall_rate = random.uniform(20.0, 80.0)
            else:
                self.rainfall_rate = 0.0
                # After rain stops, simulate a 'retraining' session
                self.learning_iterations += 1
                self.current_error_margin = self.calculate_current_error()

        # Water level physics
        if self.is_raining:
            # Rise rate based on rainfall and a simplified drainage factor
            drainage_capacity = 5.0 # mm/step
            inflow = self.rainfall_rate / 10.0 # simplified
            self.actual_water_level += max(0, inflow - (drainage_capacity * random.uniform(0.5, 1.2)))
        else:
            # Drain water slowly if it's high
            if self.actual_water_level > 0:
                self.actual_water_level -= random.uniform(1.0, 3.0)
                if self.actual_water_level < 0:
                    self.actual_water_level = 0

        # Sensor Simulation
        error = random.uniform(-self.current_error_margin, self.current_error_margin)
        radar_reading = max(0, self.actual_water_level + error)
        
        vision_error = random.uniform(-self.current_error_margin * 1.5, self.current_error_margin * 1.5)
        vision_reading = max(0, self.actual_water_level + vision_error)

        # AI Fusion and Prediction
        fused_level = (radar_reading + vision_reading) / 2.0
        
        # Simple prediction: time to reach 300mm limit
        evac_threshold = 300.0
        rise_rate = max(0.1, (fused_level / (self.sim_time + 1))) # very simplified
        time_to_evac = max(0, (evac_threshold - fused_level) / rise_rate) if fused_level < evac_threshold else 0

        data = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "sim_time": self.sim_time,
            "actual_level": round(self.actual_water_level, 2),
            "radar_reading": round(radar_reading, 2),
            "vision_reading": round(vision_reading, 2),
            "fused_level": round(fused_level, 2),
            "error_margin_mm": round(self.current_error_margin, 2),
            "learning_iterations": self.learning_iterations,
            "is_raining": self.is_raining,
            "rainfall_rate": round(self.rainfall_rate, 2),
            "time_to_evac": round(time_to_evac, 1) if self.is_raining else "N/A"
        }

        # Write to JSON for frontend
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
        
        print(f"[{data['timestamp']}] Level: {data['actual_level']}mm | Error Margin: {data['error_margin_mm']}mm | Learning: {data['learning_iterations']}")

    def run(self, cycles=100):
        print(f"Underpass Flood Simulator Started. Output: {DATA_FILE}")
        try:
            for _ in range(cycles):
                self.step()
                time.sleep(SIM_INTERVAL)
        except KeyboardInterrupt:
            print("Simulator Stopped.")

if __name__ == "__main__":
    sim = UnderpassSimulator()
    sim.run(cycles=300) # Run for approx 10 mins
